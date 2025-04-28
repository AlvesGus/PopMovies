'use client' 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, SquareUser } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export const UserDropdown = () => {
  const {data: session} = useSession()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full gap-2 justify-start px-2">
          <Avatar className="block w-7 h-7">
            <AvatarImage src={session?.user?.image || undefined} />
          </Avatar>
          <p>{session?.user?.name}</p>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[var(--radix-dropdown-menu-trigger-width)] "
      >
        <Link passHref href="/dashboard/account">
          <DropdownMenuItem className="gap-2 hover:bg-zinc-800 mb-2">
            Configurações de conta
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut({callbackUrl:'/'})} className="gap-2 cursor-pointer hover:bg-zinc-800">
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}