from flask import Flask, request, jsonify
import tensorflow_hub as hub
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from tabulate import tabulate
import matplotlib.pyplot as plt
import numpy as np
from flask_cors import CORS
from transformers import BertTokenizer, TFBertForSequenceClassification

app = Flask(__name__)
CORS(app)

# Load Universal Sentence Encoder
model_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(model_url)

def embed(texts):
    return model(texts)

# Load movie data
movies = pd.read_csv('./dataset/imdb_movies.csv')
movies['overview'].fillna('', inplace=True)
movies_w_des = movies[["original_title", "overview"]]
descriptions = list(movies_w_des['overview'])

# Embed descriptions using Universal Sentence Encoder
des_embeddings = np.load('./dataset/use_embeddings.npy')

# Fit Nearest Neighbors model
nn = NearestNeighbors(n_neighbors=10, metric='cosine')
nn.fit(des_embeddings)

@app.route('/api/recommend/use', methods=['POST'])
def recommend_api():
    data = request.get_json()

    if 'text' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    text_input = data['text']

    # Embed the input text
    emb = model([text_input])

    # Find nearest neighbors
    neighbors = nn.kneighbors(emb, return_distance=False)[0]

    # Get movie recommendations
    recommendations = movies[['id', 'original_title', 'genres', 'overview']].iloc[neighbors]

    # Convert DataFrame to JSON
    recommendations_json = recommendations.to_dict(orient='records')

    return jsonify({'recommendations': recommendations_json})


#Bert Model
# Load BERT-based model
loaded_model = TFBertForSequenceClassification.from_pretrained('./bert_semantic_similarity_model', num_labels=3)

# Load BERT embeddings
bert_embeddings = np.load('./dataset/bert_embeddings.npy')

# Tokenizer for BERT
max_length = 128
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Fit Nearest Neighbors model for BERT embeddings
nn_bert = NearestNeighbors(n_neighbors=10)
nn_bert.fit(bert_embeddings)

@app.route('/api/recommend/bert', methods=['POST'])
def recommend_bert_api():
    data = request.get_json()

    if 'text' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    text_input = data['text']

    # Tokenize input text
    text_encoding = tokenizer(
        text=[text_input],
        truncation=True,
        padding=True,
        max_length=max_length,
        return_tensors="tf"
    )

    # Extract inputs from BatchEncoding object
    input_data = {
        'input_ids': text_encoding['input_ids'],
        'token_type_ids': text_encoding['token_type_ids'],
        'attention_mask': text_encoding['attention_mask']
    }

    # Get the BERT embeddings for the input text
    bert_logits = loaded_model.predict(input_data)['logits']
    bert_embedding = bert_logits.reshape(1, -1)  # Reshape to match the expected input shape

    # Use Nearest Neighbors to find similar movies based on BERT embeddings
    neighbors = nn_bert.kneighbors(bert_embedding, return_distance=False)[0]

    # Return recommended movie names
    recommended_movies = movies[['id','original_title','genres','overview']].iloc[neighbors]
    recommendations_json = recommended_movies.to_dict(orient='records')

    return jsonify({'recommendations': recommendations_json})


if __name__ == '__main__':
    app.run(debug=True)
