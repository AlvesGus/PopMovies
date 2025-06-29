"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { UserDropdown } from "./dropdown-menu";
import { redirect } from "next/dist/server/api-utils";

const NavItem = [
  {
    label: "Em alta",
    href: "/trending",
  },
  {
    label: "Me surpreenda",
    href: "/recommendations",
  },
  {
    label: "Por categoria",
    href: "/categories",
  },
  {
    label: "Favoritos",
    href: "/favorites",
  },
];

const redirectTrending = () => {
  window.location.href = "/trending";
};

export const Navbar = () => {
  const { data: session } = useSession();
  const [pathname, setPathname] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <div className="h-14 flex items-center p-4 md:px-12 lg:px-24 xl:px-48 justify-between border-b shadow-sm">
      <div>
        <h1 className="text-xl font-bold tracking-wide">
          <a href="/">PopMovies</a>
        </h1>
      </div>
      {!session ? (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={redirectTrending}>
            Em alta
          </Button>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/trending" })}
            className="cursor-pointer"
            variant='action'
          >
            Entrar
          </Button>
        </div>
      ) : (
        <>
          <div className="lg:flex gap-3 hidden">
            {NavItem.map((item) => (
              <Button
                key={item.label}
                className={`${
                  pathname === item.href ? "bg-zinc-800" : ""
                } cursor-pointer text-lg`}
                variant="ghost"
                asChild
              >
                <a className="text-sm lg:text-base" href={item.href}>
                  {item.label}
                </a>
              </Button>
            ))}
            <div className="relative">
              <Button onClick={() => setIsOpen(!isOpen)} asChild>
                <Avatar className="w-[200px]">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt="profile picture"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{session?.user?.name}</span>
                </Avatar>
              </Button>
              {isOpen && (
                <div className="w-[200px] absolute top-14 right-0 flex flex-col gap-2 bg-zinc-800 py-4 px-2 rounded-md">
                  <Button
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer flex justify-start"
                  >
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-lg">PopMovies</SheetTitle>
                </SheetHeader>
                <div className="w-full flex flex-col gap-5">
                  {NavItem.map((item) => (
                    <div className="px-4" key={item.label}>
                      <Button className="w-full cursor-pointer text-sm" asChild>
                        <a href={item.href}>{item.label}</a>
                      </Button>
                    </div>
                  ))}
                </div>
                <SheetFooter className="mb-5">
                  <SheetClose asChild className="bg-zinc-50">
                    <UserDropdown />
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )}
    </div>
  );
};
