import '../../../packages/webtransport-polyfill/dist/index';
import React from 'react';
import type { AppProps } from 'next/app';
import { ChannelProvider, id } from '../libs/presence.config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChannelProvider id="test-channel" initialState={{ id, name: '' }}>
      <Component {...pageProps} />
    </ChannelProvider>
  );
}

export default MyApp;
