"use client";
import { Loading } from "@/app/_components/loading";
import { Navbar } from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Heart, Star, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

interface MoviesProps {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  movieId: string;
  production_companies: {
    name: string;
  }[];
  genres: {
    name: string;
  }[];
}

interface PageProps {
  params: {
    movieId: string;
  };
  
}

export default async function MoviePage({ params }: { params: { movieId: string } }) {
  const { movieId } = await useParams();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<MoviesProps | null>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [currentMovie, setCurrentMovie] = useState<MoviesProps | null>(null);

  useEffect(() => {
    if (movie) {
      setCurrentMovie(movie);
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const alreadyFavorite = favorites.some(
        (favorite: MoviesProps) => favorite.id === movie.id
      );
      setIsFavorite(alreadyFavorite);
    }
  }, [movie]);

  useEffect(() => {
    setIsLoading(true);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjRmMGRmNzQ2ZDUwZDEwYmZiOWRhNDEzOTkxYzNkZiIsIm5iZiI6MTcwNTUyMjM3Ny4yMDQsInN1YiI6IjY1YTgzNGM5ZWEzOTQ5MDEzMTFlZmMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NyhDFIoC2y72dh5rNdv5rh1IFib7PoGB8nctJIZLD2E",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=pt-BR`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCredits(data.cast);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [movieId]);

  const handleFavoriteMovie = (movie: MoviesProps): boolean => {
    if (!session) {
      toast.error(
        "Você precisa estar logado para adicionar filmes aos favoritos."
      );
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

  const handleVoltar = () => {
    const from = window.location.pathname.split('/')[1];
    if (from) {
      window.location.href = `/${from}`;
    } else {
      window.location.href = "/";
    }
  };
  return (
    <>
      <ToastContainer autoClose={3000} theme="dark" />
      <div className="pt-10 p-4 md:px-12 lg:px-24 xl:px-48">
        <Button onClick={handleVoltar} variant="ghost">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Button>
      </div>

      <main className="w-full pt-3 p-5 md:px-12 lg:px-24 xl:px-48 mb-10">
        {movie && (
          <div className="border border-border px-5 rounded-md">
            <h2 className="mt-3 w-full text-3xl font-bold tracking-wide">
              {movie.title}
            </h2>
            <div className="relative pt-5 gap-3 flex flex-col md:flex-row md:gap-10">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="h-full rounded-md border border-border"
              />
              <div className="flex flex-col justify-center gap-10 h-[400px] md:w-[500px] md:h-auto">
                <span className="pt-5 text-2xl lg:pt-0 text-white text-start">Sinopse</span>
                <div>
                  <p className="text-lg text-white text-start line-clamp-6">
                    {movie.overview}
                  </p>
                </div>
                <div className="pt-5">
                  <span>
                    Ano de lançamento:{" "}
                    {new Date(movie.release_date).toLocaleDateString("pt-BR", {
                      year: "numeric",
                    })}
                  </span>
                  <p>Produção de: {movie.production_companies[0]?.name}</p>
                  <p>
                    Gênero: {movie.genres.map((genre) => genre.name).join(", ")}
                  </p>
                  <div className="pt-5">
                    <Button
                      onClick={() => handleFavoriteMovie(movie)}
                      variant="outline"
                      className="w-full px-4 cursor-pointer text-lg tracking-wide "
                    >
                      Favoritar
                      <Heart
                        className={
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <p className="text-xl py-5">Atores:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {credits.slice(0, 6).map((credit) => (
                  <div key={credit.id}>
                    <div>
                      {credit.profile_path ? (
                        <div className="w-[150px]">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                            alt="profile actor"
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="w-[150px] h-[225px] border border-border rounded-md">
                          <User className="w-full h-full text-zinc-400" />
                        </div>
                      )}
                      <p className="w-[150px] pt-2">{credit.character}</p>
                      <p className="text-zinc-400 w-[150px]">{credit.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}