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
                className="border border-border rounded-md pb-5 bg-zinc-900"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-t-md"
                />
                <div className="px-2 pt-2 ">
                  <h2 className="text-xl">{movie.title}</h2>
                  <span className="text-sm md:text-md text-zinc-400">
                    Lançamento:{" "}
                    {new Date(movie.release_date).toLocaleDateString("pt-BR", {
                      year: "numeric",
                    })}
                  </span>
                  <div>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveFavoriteMovie(movie.id)}
                      className="w-full my-2"
                    >
                      Remover dos favoritos
                    </Button>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs rounded-md text-zinc-400">
                    <Button
                      onClick={() => handleInfoMovies(movie.id)}
                      variant="ghost"
                    >
                      Ver mais <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
