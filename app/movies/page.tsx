import dynamic from "next/dynamic";

const MoviePageClient = dynamic(() => import("./[movieId]/dinamyc"), {
  ssr: false, // impede renderização do lado do servidor
});

export default function Page() {
  return < MoviePageClient params={{
      movieId: ""
  }}/>;
}