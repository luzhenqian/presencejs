import { IPresence } from '@yomo/presence';

export type GroupHugProps = {
  presence: Promise<IPresence>;
  avatar?: string;
  avatarBorderColor?: string;
  id: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  grouped?: boolean;
};
