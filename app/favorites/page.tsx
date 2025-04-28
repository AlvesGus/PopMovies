"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../_components/navbar";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const [movies, setMovies] = useState<MoviesProps[]>([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setMovies(favorites);
  }, []);

  const handleRemoveFavoriteMovie = (movieId: string) => {
    const updatedFavorites = movies.filter((movie) => movie.id !== movieId);
    setMovies(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (movies.length === 0) {
    return (
      <>
        <Navbar />
        <div className="w-full pt-10 p-4 md:px-12 lg:px-24 xl:px-48 flex flex-col items-center justify-center">
          <div>
            <Image
              src="/ghost.svg"
              alt="ghost icon"
              width={200}
              height={200}
              className="w-full h-auto brightness-75"
            />
          </div>
          <h1 className="text-center text-2xl lg:text-3xl xl:text-5xl tracking-wide">
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
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="w-full  pt-5 mb-10 p-2 md:px-12 lg:px-24 xl:px-48 place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-center">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-950 rounded-lg border border-border w-full flex flex-col justify-between"
          >
            <div className="relative">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
                alt={movie.title}
                className="object-fill w-full rounded-t-lg xl:rounded-l-lg xl:rounded-r-none"
              />
              <div className="absolute top-2 right-2 flex items-center justify-center gap-2 text-lg px-4 py-2 bg-zinc-950 rounded-full">
                <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                {movie.vote_average.toFixed(1)}
              </div>
            
            <div>
            <p className="text-xl text-center tracking-wide pt-4">
              {movie.title}
            </p>
            <span className="w-full flex items-center justify-center gap-1 text-zinc-400">
              Ano de lançamento:
              <span>
                {new Date(movie.release_date).toLocaleDateString("pt-BR", {
                  year: "numeric",
                })}
              </span>
            </span>
            </div>
            </div>
            <div className="w-full px-4 py-5 space-y-2">
              <Button
                variant="action"
                className="w-full px-4 cursor-pointer text-lg tracking-wide"
              >
                Já assisti
              </Button>
              <Button
                variant="destructive"
                className="w-full px-4 cursor-pointer text-lg tracking-wide"
                onClick={() => handleRemoveFavoriteMovie(movie.id)}
              >
                Remover dos favoritos
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
