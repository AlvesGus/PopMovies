import MoviePageClient from "./MoviePageClient";

export default function Page() {
  return <MoviePageClient params={{
    movieId: ""
  }} />;
}