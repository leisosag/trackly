import {
  WalletIcon,
  LaptopIcon,
  GiftIcon,
  ForkKnifeIcon,
  BusIcon,
  HouseIcon,
  HeartbeatIcon,
  GameControllerIcon,
  QuestionIcon,
  type Icon,
} from '@phosphor-icons/react';

const iconMap: Record<string, Icon> = {
  Wallet: WalletIcon,
  Laptop: LaptopIcon,
  Gift: GiftIcon,
  ForkKnife: ForkKnifeIcon,
  Bus: BusIcon,
  House: HouseIcon,
  Heartbeat: HeartbeatIcon,
  GameController: GameControllerIcon,
};

export function getIcon(name: string): Icon {
  return iconMap[name] ?? QuestionIcon;
}
