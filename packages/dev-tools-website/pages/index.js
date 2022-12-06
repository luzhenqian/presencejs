import Head from 'next/head';
import Image from 'next/image';
import { Window } from '../components/window';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col w-screen h-screen">
        <div className="h-[40px] p-2 text-slate-200 bg-slate-900 border-b">
          tools bar
        </div>
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-[1px]">
          <Window /> <Window /> <Window /> <Window />
        </div>
      </div>
    </div>
  );
}
