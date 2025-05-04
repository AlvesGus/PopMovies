"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../_components/navbar";
import { useMovies } from "../providers/movies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star } from "lucide-react";
import { redirect } from "next/navigation";

interface MoviesProps {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export default function CategoryPage() {
  const { GetGenreMovies, genres, GetMoviesWithGenreId, moviesId, isLoading } =
    useMovies();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  

  useEffect(() => {
    GetGenreMovies();
  }, [GetGenreMovies]);

  const handleGenreChange = (value: string) => {
    setSelectedGenreId(value);
    console.log(`ID do gênero selecionado: ${value}`);
  };

  const handleRecommendationClick = async () => {
    if (selectedGenreId) {
      await GetMoviesWithGenreId(selectedGenreId);
    } else {
      alert("Por favor, selecione um gênero antes de pedir uma recomendação.");
    }
  };

  const handleInfoMovies = (movieId: string) => {
    const movie = moviesId;
    redirect(`/movies/${movieId}?from=categories`);;
  };
  

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
      <main className="w-96  md:w-full mx-auto flex flex-col items-center justify-center gap-8 p-2 mb-10 md:px-12 lg:px-24 xl:px-48">
        <div className="w-full px-3 flex flex-col items-center justify-center gap-4 mt-5">
          <Select onValueChange={handleGenreChange}>
            <SelectTrigger className="w-full lg:w-1/2">
              <SelectValue placeholder="Selecione um gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gêneros</SelectLabel>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {moviesId.length === 0 && (
            <Button
              variant="action"
              onClick={handleRecommendationClick}
              className="w-full lg:w-1/2 cursor-pointer"
              disabled={!selectedGenreId}
            >
              Nova recomendação
            </Button>
          )}
        </div>
        {moviesId.length > 0 && (
          <div className="border border-border rounded-md px-4">
            {moviesId.map((movie) => (
               <div key={movie.id}>
               <h2 className="mt-3 text-3xl font-bold tracking-wide px-2 pb-5">
                 {movie.title}
               </h2>
               <div className="relative pt-5 gap-3 flex flex-col items-center justify-center md:flex-row md:items-start md:justify-center md:gap-10">
                 <img
                   src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                   alt={movie.title}
                   className="h-full rounded-md border border-border"
                 />
                 <div className="flex flex-col justify-center gap-10 md:h-[400px] md:w-[500px]">
                   <span className="text-2xl text-white text-start">
                     Sinopse
                   </span>
                   <div>
                     <p className="text-lg text-white text-start line-clamp-6">
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
                   onClick={() => handleRecommendationClick()}
                   className="w-full cursor-pointer px-4 text-lg tracking-wide mb-5"
                 >
                   Nova recomendação
                 </Button>
                 </div>
               </div>
               <div className="flex items-center justify-end gap-2 text-lg px-4 py-5  rounded-full text-zinc-400">
               <Button onClick={() => handleInfoMovies(movie.id)} variant='ghost'>Ver mais <ArrowRight/></Button>
             </div>
             </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
