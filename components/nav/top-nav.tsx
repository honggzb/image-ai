'use client';

import React from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

const TopNav = () => {

  const { isSignedIn, user } = useUser();

  return (
    <nav className='flex justify-between items-center p-5 shadow'>
      <Link href='/'>IMAGES</Link>
      <div className='flex items-center'>
        {isSignedIn && <Link href='/' className='mr-3'>{`${user.fullName}'s Dashboard`}</Link>}
        <SignedIn> <UserButton /> </SignedIn>
        <SignedOut> <SignInButton /> </SignedOut>
        <div className='ml-2'><ThemeToggle /></div>
      </div>
    </nav>
  )
}

export default TopNav