"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "../_components/navbar";
import { useMovies } from "../providers/movies";
import { ArrowRight, Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../_components/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const { data: session } = useSession();
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
    if (!session) {
      toast.error("Você precisa estar logado para favoritar um filme!", {
        style: {
          maxWidth: "90vw",
        },
      });
      return false;
    }

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

  const handleInfoMovies = (movieId: string) => {
    const movie = movies.find((movie) => movie.id === movieId);
    redirect(`/movies/${movieId}`);
  };

  return (
    <>
      <ToastContainer
        autoClose={3000}
        theme="dark"
        position="top-right"
        closeButton={false}
      />
      <main className="w-96 py-10 md:w-full mx-auto flex flex-col items-center justify-center gap-8 p-2 mb-10 md:px-12 lg:px-24 xl:px-48 ">
        {movies.length > 0 ? (
          isLoading ? (
            <Loading />
          ) : (
            <div className="border border-border rounded-md">
              {movies.map((movie) => (
                <div key={movie.id}>
                  <div className="relative flex flex-col items-center justify-center md:flex-row md:items-start md:mx-auto">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full md:w-[400px] rounded-l-md"
                    />
                    <div className="flex flex-col justify-center gap-3 md:w-[800px] px-8 pt-10">
                      <h2 className="text-3xl font-bold tracking-wide">
                        {movie.title}
                      </h2>
                      <span className="text-xl text-white text-start">
                        Sinopse
                      </span>
                      <div>
                        <p className="text-md text-white text-start line-clamp-6">
                          {movie.overview}
                        </p>
                      </div>
                      <div className="pt-5">
                        <span>
                          Ano de lançamento:{" "}
                          {new Date(movie.release_date).toLocaleDateString(
                            "pt-BR",
                            {
                              year: "numeric",
                            }
                          )}
                        </span>
                        <Button
                          onClick={() => handleFavoriteMovie(movie)}
                          variant="outline"
                          className="w-full px-4 cursor-pointer text-lg tracking-wide mt-3"
                        >
                          Favoritar
                          <Heart
                            className={
                              isFavorite ? "fill-red-500 text-red-500" : ""
                            }
                          />
                        </Button>
                      </div>
                      <Button
                        variant="action"
                        onClick={GetMoviesRandom}
                        className="w-full cursor-pointer px-4 text-lg tracking-wide mb-5"
                      >
                        Nova recomendação
                      </Button>
                  <div className="flex items-center justify-end gap-2 text-lg px-4 py-5  rounded-full text-zinc-400">
                    <Button
                      onClick={() => handleInfoMovies(movie.id)}
                      variant="ghost"
                    >
                      Ver mais <ArrowRight />
                    </Button>
                  </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            <h1 className="text-center text-2xl tracking-wide">
              Aqui você poderá receber novas recomendações de filmes para animar seu dia
            </h1>
            <div className="relative mt-10 w-full flex items-center justify-center">
              <div className="absolute w-full h-10 top-0 left-0 bg-gradient-to-b from-zinc-950/80 to-transparent z-2"></div>
              <div className="absolute w-full h-10 bottom-0 left-0 bg-gradient-to-t from-zinc-950/80 to-transparent z-2"></div>
              <img
                src="./backdrop.png"
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
