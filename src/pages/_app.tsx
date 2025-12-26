// pages/_app.tsx
import type { AppProps } from 'next/app'
import '../app/globals.css'
import Navbar from '../app/styled_components/Navbar' 
import Head from 'next/head'
import { ClerkProvider } from '@clerk/nextjs'
import { UserStoreProvider, AuthServiceInitializer } from '@/store'
import { useRouter } from 'next/router'


export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAuthPage = router.pathname.startsWith('/auth/')
  
  return (
    <>
      < Head>
        <link rel="icon" href="/resume.ai.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/resume.ai-dark.svg" media="(prefers-color-scheme: dark)" />
        <title>Resume.ai | Online PDF optimizing AI Tool</title>
      </Head>
      <ClerkProvider {...pageProps}>
        <AuthServiceInitializer>
          <UserStoreProvider>
            {!isAuthPage && <Navbar />}
            <Component {...pageProps} />
          </UserStoreProvider>
        </AuthServiceInitializer>
      </ClerkProvider>
    </>
  )
}

