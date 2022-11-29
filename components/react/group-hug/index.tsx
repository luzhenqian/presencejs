import React, { useEffect, useState } from 'react';
import { IChannel } from '@yomo/presence';
import { GroupHugDefaultProps, GroupHugProps, User } from './types';

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

const sizes = {
  md: 30,
};

export default function GroupHug(props: GroupHugProps) {
  const { id, avatar } = props;
  let { avatarBorderColor, name } = props;
  const size = sizes[props.size!];
  if (!avatarBorderColor) {
    let idx = Math.floor(Math.random() * colors.length);
    avatarBorderColor = colors[idx];
  }
  const [myState, setMyState] = useState<User>({
    id,
    avatar,
    state: 'online',
    avatarBorderColor,
    name,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let channel: IChannel | null = null;
    props.presence.then((yomo) => {
      channel = yomo.joinChannel('group-hug', myState);

      channel.subscribePeers((peers) => {
        setUsers([myState, ...(peers as User[])]);
      });

      setUsers([myState]);
      setConnected(true);
    });

    const visibilitychangeCb = () => {
      if (document.hidden) {
        const newState: User = { ...myState, state: 'away' };
        channel?.updateMetadata(newState);
        setMyState(newState);
      } else {
        const newState: User = { ...myState, state: 'online' };
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

  return (
    <div
      className="relative flex"
      style={{
        marginRight: `${14 - Math.min(users.length, 6) * 2}px`,
      }}
    >
      {users.slice(0, 6).map((user, i) => {
        if (i < 5) {
          return (
            <Avatar
              key={user.id}
              size={size}
              style={{
                transform: `translateX(${i * -4}px)`,
                zIndex: `${i}`,
              }}
              user={user}
            />
          );
        }
      })}
      {users.length > 5 && <Others size={size} users={users} />}
    </div>
  );
}

function ImageAvatar({ size, user }) {
  return (
    <>
      <img
        style={{
          minWidth: `${size}px`,
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          // opacity: `${user.state === 'away' ? '0.5' : '1'}`,
          border: `2px solid ${user.avatarBorderColor}`,
        }}
        src={user.avatar}
        alt={user.id}
        className="box-content relative bg-white rounded-full"
      />
      {user.state === 'away' && <Mask />}
    </>
  );
}

function TextAvatar({ size, user }) {
  if (!!!user.name) return null;
  return (
    <>
      <div
        style={{
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          width: `${size}px`,
          height: `${size}px`,
          lineHeight: `${size}px`,
          background: `${user.avatarBorderColor}`,
          border: `2px solid ${user.avatarBorderColor}`,
          fontSize: '14px',
        }}
        className="box-content text-center text-black bg-white rounded-full"
      >
        {user.name.charAt(0)}
      </div>

      {user.state === 'away' && <Mask />}
    </>
  );
}

function Others({ size, users }) {
  const [display, setDisplay] = useState('none');

  return (
    <div
      style={{
        transform: `translateX(${5 * -4}px)`,
        minWidth: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: display === 'none' ? 'white' : '#EAEAEA',
      }}
      className="box-content relative text-[#666666] text-[12px] font-[500]
      border-[#999999] border-2
      rounded-full z-10
      hover:border-[#000000]
      hover:text-[#000000]"
    >
      <span
        className="absolute inline-flex items-center justify-center w-full h-full rounded-full "
        onClick={() => setDisplay(display === 'none' ? 'block' : 'none')}
      >
        +{users.length - 5}
      </span>

      <span
        className="p-[10px] absolute text-[14px] p-2 rounded-[6px] whitespace-nowrap shadow-md"
        style={{
          top: `${size + 8}px`,
          display: display,
          right: `0`,
        }}
      >
        {users.slice(5, users.length).map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 p-[10px] hover:bg-[#F5F5F5]
          rounded-[6px]"
          >
            <Avatar size={size} user={user} />
            <span>{user.name}</span>
          </div>
        ))}
      </span>
    </div>
  );
}

function Tip({ size, display, name }) {
  return (
    <span
      className="absolute text-[14px] p-2 rounded-[6px] whitespace-nowrap shadow-md"
      style={{
        top: `${size + 8}px`,
        display: display,
        transform: `translateX(calc(-50% + ${size / 2}px))`,
      }}
    >
      {name}
    </span>
  );
}

function Avatar({ style = {}, user, size }) {
  const [display, setDisplay] = useState('none');
  return (
    <div
      style={style}
      className="relative "
      onMouseEnter={() => {
        setDisplay('block');
      }}
      onMouseLeave={() => {
        setDisplay('none');
      }}
    >
      {user.avatar ? (
        <ImageAvatar size={size} user={user} />
      ) : (
        <TextAvatar size={size} user={user} />
      )}
      <Tip size={size} display={display} name={user.name} />
    </div>
  );
}

function Mask() {
  return (
    <span
      className="absolute top-[0px] left-[0px] bg-white opacity-60 rounded-full"
      style={{
        width: `calc(100%)`,
        height: `calc(100%)`,
      }}
    ></span>
  );
}

GroupHug.defaultProps = GroupHugDefaultProps;
