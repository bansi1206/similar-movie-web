"use client";
import { map } from "lodash";
import { useEffect, useState } from "react";

type MovieList = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

type Props = {
  recommendations: any[];
};

export const MovieList: React.FC<Props> = ({ recommendations }) => {
  const [movieList, setMovieList] = useState<MovieList[]>([]);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetails = await Promise.all(
          recommendations.map(async (movie: { id: any }) => {
            try {
              const options = {
                method: "GET",
                headers: {
                  accept: "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMmY3Zjk1Mzk2MWViYmExNmRlYjdiMjAwYzYzZTkzMyIsInN1YiI6IjYzNGUzYmI5YzE3NWIyMDA4MmRlMzQ1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NX4drgjq-4ugnV5rlRmwT0CjkfdhzmpYGJ6JlZP0CIE",
                },
              };
              const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
                options
              );
              const data = await response.json();
              return data;
            } catch (error) {
              console.error(
                `Error fetching details for movie ${movie.id}:`,
                error
              );
              return null;
            }
          })
        );
        setMovieList(movieDetails);
        console.log(">>>> List", movieList);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [recommendations]);

  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-2 gap-10 max-w-full mb-[152px]">
          {map(movieList, (movie) => (
            <div>
              <h1 className="text-2xl">{movie?.original_title}</h1>
              <img
                className="rounded-[5px] w-[510px] mb-4 object-cover shadow-movie"
                src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
                alt={movie?.original_title}
              />
              <div className="flex gap-2 mb-2">
                {map(movie?.genres, (genre) => (
                  <div
                    key={genre?.id}
                    className="rounded-[3px] bg-[#283A61]  text-[#FFFFFFD9] p-1 text-center mb-[8px]"
                  >
                    {genre?.name}
                  </div>
                ))}
              </div>
              <div className="text-base line-clamp-3 text-[#434343]">
                {movie?.overview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
