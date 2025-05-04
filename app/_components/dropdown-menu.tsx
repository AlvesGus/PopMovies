'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, SquareUser } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export const UserDropdown = () => {
   const {data: session} = useSession()
   const [isOpen, setIsOpen] = useState(false)

  return (
      <>
        <div className='w-full relative'>
        <Button onClick={() => setIsOpen(!isOpen)} className='cursor-pointer flex justify-start' asChild>
          <Avatar className='w-full'>
            <AvatarImage src={session?.user?.image || ''} alt='profile picture' className='h-6 w-6 rounded-full' />
            <span>{session?.user?.name}</span>
          </Avatar>
        </Button>
        {isOpen && (
          <div className='absolute bottom-14 flex flex-col gap-2 w-full bg-zinc-800 py-4 px-2 rounded-md'>
            <Button className='cursor-pointer flex justify-start'>Configuração da conta</Button>
            <Button variant='destructive' onClick={() => signOut({callbackUrl: '/'})} className='cursor-pointer flex justify-start'>Sair</Button>
          </div>
        )}
        </div>
      </>
  )
}
