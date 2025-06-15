import MoviePageClient from "./dinamyc";

export default function Page() {
  return <MoviePageClient params={{
      movieId: ""
  }} />;
}