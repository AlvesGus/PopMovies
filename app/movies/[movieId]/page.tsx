import MoviePageClient from "./MoviePageClient";

export default function Page({ params }: { params: { movieId: string } }) {
  return <MoviePageClient params={{
      movieId: params.movieId
  }} />;
}