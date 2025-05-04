"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../_components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { LoadingFavorite } from "../_components/loading-favorite";

interface MoviesProps {
  release_date: string | number | Date;
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<MoviesProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setMovies(favorites);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleRemoveFavoriteMovie = (movieId: string) => {
    const updatedFavorites = movies.filter((movie) => movie.id !== movieId);
    setMovies(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleInfoMovies = (movieId: string) => {
    const movie = movies.find((movie) => movie.id === movieId);
    redirect(`/movies/${movieId}?from=favorites`);
  };

  if (!session) {
    redirect("/");
  }

  if (isLoading) {
    return (
      <>
        <div className="w-full pt-10 p-4 md:px-12 lg:px-24 xl:px-48 flex flex-col items-center justify-center">
          <LoadingFavorite />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full pt-10 p-4 md:px-12 lg:px-24 xl:px-48">
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div>
              <Image
                src="/ghost.svg"
                alt="ghost icon"
                width={200}
                height={200}
                className="w-full h-auto brightness-75"
              />
            </div>

            <h1 className="text-center text-2xl lg:text-3xl xl:text-5xl tracking-wide pt-6">
              Você ainda não adicionou nenhum filme aos favoritos
            </h1>
            <div className="pt-10">
              <Button
                variant="action"
                className="w-80 cursor-pointer text-xl"
                asChild
              >
                <Link href="/">Voltar para a home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full  pt-5 mb-10 p-2 md:px-12 lg:px-24 xl:px-48 place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-center">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className=" rounded-lg border border-border w-full flex flex-col justify-between md:h-[550px]"
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
                    alt={movie.title}
                    className="object-fill w-full rounded-t-lg xl:rounded-l-lg xl:rounded-r-none"
                  />
                  <div className="absolute bg-zinc-950 top-2 right-2 flex items-center justify-center gap-2 text-lg px-4 py-2  rounded-full">
                    <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                  <div>
                    <p className="text-xl text-center tracking-wide pt-4 h-20">
                      {movie.title}
                    </p>
                    <span className="w-full flex items-center justify-center gap-1 text-zinc-400">
                      Ano de lançamento:
                      <span>
                        {new Date(movie.release_date).toLocaleDateString(
                          "pt-BR",
                          {
                            year: "numeric",
                          }
                        )}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="w-full px-4 py-5 space-y-2">
                  <Button
                    variant="destructive"
                    className="w-full px-4 cursor-pointer text-lg tracking-wide"
                    onClick={() => handleRemoveFavoriteMovie(movie.id)}
                  >
                    Remover dos favoritos
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-2 text-lg px-4 py-2  rounded-full text-zinc-400">
                  <Button onClick={() => handleInfoMovies(movie.id)} variant='ghost'>Ver mais <ArrowRight/></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
