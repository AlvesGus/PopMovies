"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "./_components/navbar";
import { useMovies } from "./providers/movies";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "./_components/loading";

interface MoviesProps {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export default function Home() {
  const { GetMoviesRandom, isLoading, movies } = useMovies();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<MoviesProps | null>(null);

  useEffect(() => {
    if (movies.length > 0) {
      setCurrentMovie(movies[0]);
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const alreadyFavorite = favorites.some(
        (favorite: MoviesProps) => favorite.id === movies[0].id
      );
      setIsFavorite(alreadyFavorite);
    }
  }, [movies]);

  const handleFavoriteMovie = (movie: MoviesProps): boolean => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isCurrentlyFavorite = favorites.some(
      (favorite: MoviesProps) => favorite.id === movie.id
    );
    let updatedFavorites;

    if (isCurrentlyFavorite) {
      updatedFavorites = favorites.filter(
        (favorite: MoviesProps) => favorite.id !== movie.id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false); 
      return false;
    } else {
      updatedFavorites = [...favorites, movie];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(true); 
      return true;
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-96 pt-10 md:w-full mx-auto flex flex-col items-center justify-center gap-8 p-2 mb-10 md:px-12 lg:px-24 xl:px-48 ">
        {movies.length > 0 ? (
          isLoading ? (
            <Loading/>
          ) : (
            <div>
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-zinc-950 lg:h-[500px] rounded-lg border border-border flex flex-col xl:flex-row xl:gap-10 lg:items-center lg:w-full "
                >
                  <div className="relative w-full">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="object-fit w-full lg:h-[500px] rounded-t-lg xl:rounded-l-lg xl:rounded-r-none"
                    />
                   <div className="absolute w-full h-10 bottom-0 left-0 bg-gradient-to-t from-zinc-900/80 to-transparent z-100"></div>
                    <div className="absolute top-2 right-2 flex items-center justify-center gap-2 text-lg px-4 py-2 bg-zinc-950 rounded-full">
                      <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-2 md:max-w-[500px] md:justify-between lg:h-[450px] lg:mr-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                    <h2 className="mt-3 text-center text-3xl font-bold tracking-wide px-2">
                      {movie.title}
                    </h2>
                    <span className="text-center text-zinc-400">Ano de lançamento: {new Date(movie.release_date).toLocaleDateString('pt-BR', { year: 'numeric' })}</span>
                    </div>
                    <p className="px-3 text-start text-md line-clamp-4 lg:line-clamp-none">
                      {movie.overview}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4  px-2">
                      <Button
                        onClick={() => handleFavoriteMovie(movie)}
                        variant="outline"
                        className="w-full px-4 cursor-pointer text-lg tracking-wide"
                      >
                        Favoritar
                        <Heart
                          className={
                            isFavorite ? "fill-red-500 text-red-500" : ""
                          }
                        />
                      </Button>
                      <Button
                        variant="action"
                        onClick={GetMoviesRandom}
                        className="w-full cursor-pointer px-4 text-lg tracking-wide"
                      >
                        Nova recomendação
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            <h1 className="text-center text-2xl lg:text-3xl xl:text-5xl tracking-wide">
              Aqui você poderá receber novas recomendações de filmes para animar
              o final de semana
            </h1>
            <div className="relative mt-10 w-full flex items-center justify-center">
              <div className="absolute w-full h-10 top-0 left-0 bg-gradient-to-b from-zinc-900/80 to-transparent z-100"></div>
              <div className="absolute w-full h-10 bottom-0 left-0 bg-gradient-to-t from-zinc-900/80 to-transparent z-100"></div>
              <img
                src="./backdrop.png"
                alt=""
                className="brightness-50 rounded-md shadow-md lg:w-1/2"
              />
            </div>
            <Button
              variant="action"
              onClick={GetMoviesRandom}
              className="w-full max-w-96 cursor-pointer mb-10 mt-10 text-lg tracking-wide"
            >
              Nova recomendação
            </Button>
          </>
        )}
      </main>
    </>
  );
}