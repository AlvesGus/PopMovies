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
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
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

export default function CategoryPage() {
  const { GetGenreMovies, genres, GetMoviesWithGenreId, moviesId, isLoading } =
    useMovies();
    const {data: session} = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  

  useEffect(() => {
    GetGenreMovies();
  }, []);

  const handleGenreChange = (value: string) => {
    setSelectedGenreId(value);
  };

  const handleRecommendationClick = async () => {
    if (selectedGenreId) {
      await GetMoviesWithGenreId(selectedGenreId);
    } else {
      toast.warn("Por favor, selecione um gênero antes de pedir uma recomendação."),{
        style:{
           maxWidth: '200px'
        }
      };
    }
  };

  const handleInfoMovies = (movieId: string) => {
    const movie = moviesId;
    redirect(`/movies/${movieId}?from=categories`);;
  };
  

  const handleFavoriteMovie = (movie: MoviesProps): boolean => {
    if(!session) {
      toast.error('Você precisa estar logado para favoritar um filme');
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


  return (
    <>
    <ToastContainer autoClose={3000} theme="dark" />
      <main className="pt-10 w-96  md:w-full mx-auto flex flex-col items-center justify-center gap-8 p-2 mb-10 md:px-12 lg:px-24 xl:px-48">
       <h1 className="text-4xl tracking-wide mb-10">Selecione o gênero desejado para receber recomendações</h1>
        <div className="w-full  flex flex-col items-center justify-center gap-4">
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
           <div className="border border-border rounded-md">
              {moviesId.map((movie) => (
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
                        onClick={() => selectedGenreId && GetMoviesWithGenreId(selectedGenreId)}                        className="w-full cursor-pointer px-4 text-lg tracking-wide mb-5"
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
              ))}            </div>
        )}
      </main>
    </>
  );
}
