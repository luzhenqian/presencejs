import { IPresence } from '@yomo/presence';

export type GroupHugProps = {
  presence: Promise<IPresence>;
  avatar?: string;
  id: string;
};
