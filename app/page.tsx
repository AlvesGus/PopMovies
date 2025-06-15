"use client";
import { Play, PlaySquareIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMovies } from "./providers/movies";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/trending");
  }

  return (
    <>
      <main className="w-full mt-10 p-5 md:px-12 lg:px-24 xl:px-48">
        <div className="px-5 py-10">
          <h1 className="text-4xl md:text-4xl lg:text-6xl text-center lg:text-start">
            Descubra seu próximo filme favorito
          </h1>
          <p className="pt-5 text-xl text-zinc-400 text-center lg:text-start">
            Receba recomendações de filmes com base no seu gênero favorito e
            descubra novas aventuras e personagens inesquecíveis.
          </p>
          <div className="w-full flex mt-10 justify-center items-center">
            <Play className="border border-border w-[150px] h-[150px] stroke-1 rounded-md" />
          </div>
          <div className="w-full flex mt-10 justify-center items-center">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/trending" })}
              className="cursor-pointer w-[350px] text-lg"
              variant="action"
            >
              Entrar
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
