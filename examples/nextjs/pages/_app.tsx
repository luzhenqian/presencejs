import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Provider} from '../../../packages/presence-react/dist/index'

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider host="https://prsc.yomo.dev" auth={{type:'token', endpoint:'/api/presence-auth'}}><Component {...pageProps} /></Provider>
}

export default MyApp
