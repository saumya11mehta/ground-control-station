import '@/styles/globals.css'
import 'tailwindcss/tailwind.css'
import 'ol/ol.css'
import type { AppProps } from 'next/app'
import { Provider } from 'jotai';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
