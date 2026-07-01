import {
  type Icon,
  WalletIcon,
  HandCoinsIcon,
  GiftIcon,
  ForkKnifeIcon,
  BusIcon,
  HouseIcon,
  HeartbeatIcon,
  GameControllerIcon,
  QuestionIcon,
  HamburgerIcon,
  UserIcon,
  CreditCardIcon,
  MoneyIcon,
  ShoppingBagIcon,
  CheersIcon,
  ScrollIcon,
  PiggyBankIcon,
  BankIcon,
  CoinsIcon,
} from '@phosphor-icons/react';

const iconMap: Record<string, Icon> = {
  Wallet: WalletIcon,
  HandCoins: HandCoinsIcon,
  Gift: GiftIcon,
  ForkKnife: ForkKnifeIcon,
  Bus: BusIcon,
  House: HouseIcon,
  Heartbeat: HeartbeatIcon,
  GameController: GameControllerIcon,
  Hamburger: HamburgerIcon,
  User: UserIcon,
  CreditCard: CreditCardIcon,
  Money: MoneyIcon,
  ShoppingBag: ShoppingBagIcon,
  Cheers: CheersIcon,
  Scroll: ScrollIcon,
  PiggyBank: PiggyBankIcon,
  Bank: BankIcon,
  Coins: CoinsIcon,
};

export function getIcon(name: string): Icon {
  return iconMap[name] ?? QuestionIcon;
}
