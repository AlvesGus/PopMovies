"use client";
import { useSession } from "next-auth/react";
import { useMovies } from "../providers/movies";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const { GetTrendingMoviesWithWeek, isLoading, trending } = useMovies();

  useEffect(() => {
    GetTrendingMoviesWithWeek();
  }, []);

  const handleInfoMovies = (movieId: string) => {
    const movie = trending.find((movie) => movie.id === movieId);
    redirect(`/movies/${movieId}`);
  };
  return (
    <main className="px-5 lg:px-24 xl:px-48 mt-10 pb-10">
        <h1 className="text-4xl tracking-wide mb-10">Veja os melhores da semana</h1>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {trending.map((movies) => (
          <div
            key={movies.id}
            className="cursor-pointer border border-border rounded-md"
            onClick={() => handleInfoMovies(movies.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`}
              alt={movies.title}
              className="rounded-t-md "
            />
            <div className="w-full flex items-center justify-center my-4 text-center text-xl">
              <span>{movies.title}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
