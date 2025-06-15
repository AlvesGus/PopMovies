import MoviePageClient from "./[movieId]/dinamyc";

export default function Page() {
  return <MoviePageClient params={{
      movieId: ""
  }} />;
}