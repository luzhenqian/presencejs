import { createPresence } from '@yomo/presence';
import GroupHug from '@yomo/group-hug-react';
import { useEffect, useState } from 'react';
import '@yomo/group-hug-react/dist/style.css';

const id = Math.random().toString();
const avatar = `https://robohash.org/${id}`;

export default function Home() {
  const [presence, setPresence] = useState<any>();

  useEffect(() => {
    const presence = createPresence({
      url: 'https://prscd2.allegro.earth/v1',
      publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
      id,
      appId: 'lzq',
    });
    setPresence(presence);
  }, []);
  return (
    <div>
      {presence ? (
        <GroupHug presence={presence} id={id} avatar={avatar} />
      ) : null}
    </div>
  );
}
