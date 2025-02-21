// 'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export const metadata = {
    title: 'Page not found'
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full space-y-6">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Page Not Found
        </h1>
        <Image
            className='m-20 rounded-xl'
            src='/images/404-error-page.jpg'
            width={300}
            height={300}
            sizes='300px'
            alt='page not found'
            priority={true}
            title='page not found'
        />
        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}