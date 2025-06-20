"use client";
import { Play, PlaySquareIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMovies } from "./providers/movies"; // This import seems unused, consider removing if not needed.
import { useEffect } from "react"; // This import seems unused, consider removing if not needed.
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/trending");
  }

  return (
    <>
        <main
        className="w-full h-[calc(100%-60px)] px-2 md:px-12 lg:px-24 xl:px-48 lg:hidden relative"
        style={{
          paddingBottom: "20px",
        }}
      >
        <div
          className="absolute inset-0 bg-[url('/backdrop-home.png')] bg-cover bg-center bg-no-repeat z-[-1] brightness-10"
        ></div>
        <div className="py-5 relative z-10 pt-10 md:pt-20">
          <h1 className="text-4xl md:text-4xl lg:text-6xl text-center lg:text-start">
            Descubra seu próximo filme favorito
          </h1>
          <p className="pt-5 text-xl text-zinc-400 text-center lg:text-start">
            Receba recomendações de filmes com base no seu gênero favorito e
            descubra novas aventuras e personagens inesquecíveis.
          </p>
          <div className="w-full flex mt-20 justify-center items-center">
            <Play className="border border-border w-[150px] h-[150px] stroke-1 rounded-md" />
          </div>
          <div className="w-full flex mt-10 justify-center items-center">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/trending" })}
              className="cursor-pointer w-[350px] text-lg mt-10"
              variant="action"
            >
              Entrar
            </Button>
          </div>
        </div>
      </main>

   <main
        className="w-full h-[calc(100%-60px)] px-2 md:px-12 lg:px-24 xl:px-48 hidden lg:flex relative"
        style={{
          paddingBottom: "20px",
        }}
      >
        <div
          className="absolute inset-0 bg-[url('/backdrop-home.png')] bg-cover bg-center bg-no-repeat z-[-1] brightness-10"
        ></div>
        <div className="w-full py-40 flex gap-10 justify-between">
          <div>
            <h1 className="text-4xl md:text-4xl lg:text-6xl text-center lg:text-start">
              Descubra seu próximo filme favorito
            </h1>
            <p className="pt-5 text-xl text-zinc-400 text-center lg:text-start">
              Receba recomendações de filmes com base no seu gênero favorito e
              descubra novas aventuras e personagens inesquecíveis.
            </p>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/trending" })}
              className="cursor-pointer w-[450px] text-lg mt-20"
              variant="action"
            >
              Entrar
            </Button>
          </div>
          <div className="">
            <Play className="border border-border w-[300px] h-[300px] stroke-1 rounded-md" />
          </div>
        </div>
      </main>
    </>
  );
}
