'use client';
import React, { useContext, createContext, useState } from 'react';

interface MoviesProviderProps {
  children: React.ReactNode;
}

interface MoviesProps {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export interface MoviesContextType {
  GetMoviesRandom: () => Promise<void>;
  GetGenreMovies: () => Promise<void>;
  GetMoviesWithGenreId: (genreId: string) => Promise<void>;
  movies: MoviesProps[];
  isLoading: boolean;
  genres: GenresProps[];
  moviesId: MoviesProps[];
}

export interface GenresProps {
  id: string,
  name: string;
}
export const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export function MoviesProvider({ children }: MoviesProviderProps) {
  const [movies, setMovies] = useState<MoviesProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [moviesId, setMoviesId] = useState<MoviesProps[]>([]);

  const GetMoviesRandom = async () => {
    setIsLoading(true);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjRmMGRmNzQ2ZDUwZDEwYmZiOWRhNDEzOTkxYzNkZiIsIm5iZiI6MTcwNTUyMjM3Ny4yMDQsInN1YiI6IjY1YTgzNGM5ZWEzOTQ5MDEzMTFlZmMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NyhDFIoC2y72dh5rNdv5rh1IFib7PoGB8nctJIZLD2E',
      },
    };
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const randomIndex = Math.floor(Math.random() * 19) + 1;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?&include_adult=false&include_video=false&language=pt-BR&primary_release_date.gte=2018-01-01&primary_release_date.lte=2025-12-31&page=${randomPage}&sort_by=popularity.desc&vote_average.gte=8&vote_average.lte=10`,
        options
      );
      const data = await response.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomMovie = data.results[randomIndex];
        
        if(randomMovie.poster_path === null) {
          GetMoviesRandom();
          return;
        }
        if(randomMovie.overview === '') {
          GetMoviesRandom();
          return;
        }

        setMovies([randomMovie]);
        setTimeout(() => {
          setIsLoading(false);
         }, 2000);
      }
    } catch (error) {
      console.error(error);
    } 
  };

  const GetGenreMovies = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjRmMGRmNzQ2ZDUwZDEwYmZiOWRhNDEzOTkxYzNkZiIsIm5iZiI6MTcwNTUyMjM3Ny4yMDQsInN1YiI6IjY1YTgzNGM5ZWEzOTQ5MDEzMTFlZmMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NyhDFIoC2y72dh5rNdv5rh1IFib7PoGB8nctJIZLD2E'
      }
    };
    
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=pt-BR', options)
      .then(res => res.json())
      .then(res => setGenres(res.genres))
      .catch(err => console.error(err));
  }

  const GetMoviesWithGenreId = async (genreId: string) => {
    setIsLoading(true); 
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjRmMGRmNzQ2ZDUwZDEwYmZiOWRhNDEzOTkxYzNkZiIsIm5iZiI6MTcwNTUyMjM3Ny4yMDQsInN1YiI6IjY1YTgzNGM5ZWEzOTQ5MDEzMTFlZmMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NyhDFIoC2y72dh5rNdv5rh1IFib7PoGB8nctJIZLD2E'
      }
    };
    const randomPage = Math.floor(Math.random() * 50) + 1;
  
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&sort_by=popularity.desc&page=${randomPage}&sort_by=popularity.desc&vote_average.gte=8&vote_average.lte=10&with_genres=${genreId}`,
        options
      );
      const data = await response.json();
  
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const validMovies = data.results.filter(
          (movie: { poster_path: string | null; overview: string; }) => movie.poster_path !== null && movie.overview !== ''        );
  
        if (validMovies.length > 0) {
          const randomIndex = Math.floor(Math.random() * validMovies.length);
          const randomMovie = validMovies[randomIndex];
          setMoviesId([randomMovie]);
        } else {
          setMoviesId([]);
          console.warn("Nenhum filme válido encontrado para este gênero na página.");
        }
      } else if (data && data.total_results === 0) {
        setMoviesId([]);
        console.warn("Nenhum filme encontrado para este gênero.");
      } else {
        setMoviesId([]);
        console.error("Resposta da API inválida:", data);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setMoviesId([]); // Limpe os filmes em caso de erro
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Defina isLoading como false no final da tentativa
      }, 2000);
    }
  };

  return (
    <MoviesContext.Provider value={{ GetMoviesRandom, movies, isLoading, GetGenreMovies, genres, GetMoviesWithGenreId, moviesId }}>
      {children}
    </MoviesContext.Provider>
  );
}export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
};