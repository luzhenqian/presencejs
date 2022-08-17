import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import WebTransport from '@yomo/webtransport-polyfill';
import styles from '../styles/Home.module.css';

export default function Home() {
  let [wt, setWt] = useState(null);
  useEffect(() => {
    async function f() {
      if (wt === null) {
        const transport = new WebTransport('ws://localhost:8080/');
        setWt(transport);

        transport.closed
          .then(() => {
            console.log('连接优雅关闭');
          })
          .catch(error => {
            console.log('连接关闭失败');
          });

        await transport.ready;
        // 连接准备就绪

        // 向服务端发送两个数据报
        const writer = transport.datagrams.writable.getWriter();
        // ABC
        const data1 = new Uint8Array([65, 66, 67]);
        // DEF
        const data2 = new Uint8Array([68, 69, 70]);
        writer.write(data1);
        writer.write(data2);

        // 从服务端读取数据报
        const reader = transport.datagrams.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          console.log('服务端返回的数据报：', value);
        }
      }
    }
    f();
  }, [wt]);
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
