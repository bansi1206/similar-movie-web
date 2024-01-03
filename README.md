# Similar Movie Web

This project is a web application that recommends movies based on user input. It leverages machine learning models, including Universal Sentence Encoder and a custom BERT-based model, to provide accurate and personalized movie recommendations.

## Getting Started

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

### Installation

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/bansi1206/similar-movie-web.git

   ```

2. Navigate to the project directory:
   ```bash
   cd similar-movie-web
   ```
3. Install the Node.js dependencies:

   ```bash
   npm install
   ```

4. Navigate to the src/app/api directory:

   ```bash
   cd src/app/api
   ```

5. Install the Python dependencies:
   ```bash
   pip install flask tensorflow-hub pandas scikit-learn tabulate matplotlib numpy flask-cors transformers
   ```
6. Download Model + Dataset and exact to src/app/api:
https://drive.google.com/file/d/151ysqUvPvG3Ul1i94j7ah22sXaOLqNV5/view?usp=sharing

### Running the Application

1. Start the Flask API:

   ```bash
   python app.py
   ```

2. Back in the root directory, start the Next app:
   ```bash
   npm run dev
   ```

### Usage

1. Select the desired recommendation engine (Universal Sentence Encoder or BERT) from the dropdown.

2. Enter a movie-related text in the search bar.
