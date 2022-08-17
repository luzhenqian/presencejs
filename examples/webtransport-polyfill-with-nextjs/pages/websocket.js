import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  let [ws, setWs] = useState(null);
  useEffect(() => {
    if (ws === null) {
      const _ws = new WebSocket('ws://localhost:8080/');
      setWs(_ws);
      try {
        _ws.addEventListener('message', function(event) {
          console.log('Message from server: ', event.data);
        });
        _ws.addEventListener('open', function(event) {
          _ws.send('222');
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [ws]);
  return (
    <div className={styles.container}>
      <Head>
        <title>WebTransport Polyfill Test</title>
        <meta name="description" content="WebTransport Polyfill Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>123</main>
    </div>
  );
}
