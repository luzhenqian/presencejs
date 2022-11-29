import React, { useEffect, useState } from 'react';
import { IChannel } from '@yomo/presence';
import { GroupHugProps } from './types';
import DefaultAvatar from './DefaultAvatar';

// https://tailwindcolor.com/
const colors = [
  '#EF4444', // red500
  '#F97316', // orange500
  '#F97316', // amber500
  '#EAB308', // yellow500
  '#84CC16', // lime500
  '#22C55E', // green500
  '#10B981', // emerald500
  '#14B8A6', // teal500
  '#06B6D4', // cyan500
  '#0EA5E9', // lightBlue500
  '#3B82F6', //blue500
];

export default function GroupHug(props: GroupHugProps) {
  const { id, avatar } = props;
  let { avatarBorderColor } = props;
  if (!avatarBorderColor) {
    let idx = Math.floor(Math.random() * colors.length);
    avatarBorderColor = colors[idx];
  }
  const [myState, setMyState] = useState({
    id,
    avatar,
    state: 'online',
    avatarBorderColor,
  });
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let channel: IChannel | null = null;
    props.presence.then((yomo) => {
      channel = yomo.joinChannel('group-hug', myState);

      channel.subscribePeers((peers) => {
        setUsers([myState, ...peers]);
      });

      setUsers([myState]);
      setConnected(true);
    });

    const visibilitychangeCb = () => {
      if (document.hidden) {
        const newState = { ...myState, state: 'away' };
        channel?.updateMetadata(newState);
        setMyState(newState);
      } else {
        const newState = { ...myState, state: 'online' };
        channel?.updateMetadata(newState);
        setMyState(newState);
      }
    };
    document.addEventListener('visibilitychange', visibilitychangeCb);

    return () => {
      document.removeEventListener('visibilitychange', visibilitychangeCb);
    };
  }, []);

  if (!connected) {
    return <div></div>;
  }

  // FIXME:
  console.log('users:', users);

  return (
    <div className="flex items-center">
      <div
        className="relative flex "
        style={{
          marginRight: `${14 - Math.min(users.length, 6) * 2}px`,
        }}
      >
        {users.slice(0, 6).map((user, i) => {
          if (i < 5) {
            if (user.avatar) {
              return (
                <img
                  key={user.id}
                  style={{
                    transform: `translateX(${i * -4}px)`,
                    zIndex: `${users.length - i}`,
                    width: '20px',
                    height: '20px',
                    objectFit: 'contain',
                    borderRadius: '50%',
                    opacity: `${user.state === 'away' ? '0.5' : '1'}`,
                    border: `1px solid ${user.avatarBorderColor}`,
                  }}
                  src={user.avatar}
                  alt={user.id}
                  className="box-border bg-white"
                />
              );
            }
            return (
              <DefaultAvatar
                key={user.id}
                style={{
                  transform: `translateX(${i * -2}px);z-index:${
                    users.length - i
                  }`,
                  opacity: `${user.state === 'away' ? '0.5' : '1'}`,
                }}
              />
            );
          } else {
            return (
              <div
                key={user.id}
                style={{
                  transform: `translateX(${i * -2}px)`,
                  zIndex: `${users.length - i}`,
                  width: '22px',
                  height: '22px',
                }}
                className="relative text-white text-[12px] font-[500] font-normal box-border"
              >
                <span
                  className="absolute inline-flex items-center justify-center w-full h-full rounded-full"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  +{users.length - 5}
                </span>
                <DefaultAvatar
                  key={user.id}
                  style={{
                    transform: `translateX(${i * -2}px);z-index:${
                      users.length - i
                    }`,
                    opacity: `${user.state === 'away' ? '0.5' : '1'}`,
                  }}
                />
              </div>
            );
          }
        })}
      </div>
      <div
        className="flex rounded-[1rem] py-1 px-2"
        style={{
          background:
            'linear-gradient(115.54deg, #7787FF 30.62%, #E080C9 83.83%)',
        }}
      >
        <span className="font-normal leading-4 text-[0.75rem] text-white mr-[2px]">
          live
        </span>
        <span className="flex justify-center items-center text-[0.75rem] text-[#604CFF] rounded-full w-4 h-4 bg-white">
          {users.length}
        </span>
      </div>
    </div>
  );
}

GroupHug.defaultProps = {
  size: 'md',
  grouped: true,
};
