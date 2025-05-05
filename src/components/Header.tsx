import { HomeIcon, File, UsersRound, LogOut } from 'lucide-react'
import Link from 'next/link'

import { NavButton } from '@/components/NavButton'
import { ModeToggle } from '@/components/ModeToggle'
import { NavButtonMenu } from './NavButtonMenu'
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/logout';

export function Header() {
  return (
    // animate-slide
    <header className='animate-in fade-in zoom-in-95 bg-background h-12 p-2 border-b sticky top-0 z-20'>
        <div className="flex h-8 items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <NavButton href='/home' label='Home' icon={HomeIcon} />

                <Link href='/home' className='flex justify-center items-center gap-2 ml-0' title='Home'>
                    <h1 className='hidden sm:block text-xl font-bold m-0 mt-1'>Test Shop</h1>
                </Link>
            </div>
            <div className="flex items-center">
              <NavButton href='/tickets' label='Tickets' icon={File} />

              <NavButtonMenu 
                icon={UsersRound}
                label='Customers Menu'
                choices={[
                  { title: 'Search Customers', href: '/customers'},
                  { title: 'New Customers', href: '/customers/form'},
                ]}
                />
              {/* <NavButton href='/customers' label='customers' icon={UsersRound} /> */}
              <ModeToggle />
              <form action={logout}>
                <Button type="submit" variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
        </div>
    </header>
  )
}

