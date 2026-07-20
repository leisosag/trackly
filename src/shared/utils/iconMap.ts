import type { CategoryColorScheme } from '@/features/categories';
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
  CashRegisterIcon,
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
  CashRegister: CashRegisterIcon,
};

export function getIcon(name: string): Icon {
  return iconMap[name] ?? QuestionIcon;
}

type CategoryColors = {
  circle: string;
  icon: string;
  border: string;
  active: string;
};

const categoryPalette: Record<CategoryColorScheme, CategoryColors> = {
  income: {
    circle: 'bg-emerald-400/20',
    active: 'bg-emerald-400/80',
    icon: 'text-emerald-300',
    border: 'border-emerald-400/20 hover:border-emerald-400',
  },
  consumption: {
    circle: 'bg-amber-400/20',
    active: 'bg-amber-400/80',
    icon: 'text-amber-300',
    border: 'border-amber-400/20 hover:border-amber-400',
  },
  essential: {
    circle: 'bg-sky-400/20',
    active: 'bg-sky-400/80',
    icon: 'text-sky-300',
    border: 'border-sky-400/20 hover:border-sky-400',
  },
  financial: {
    circle: 'bg-violet-400/20',
    active: 'bg-violet-400/80',
    icon: 'text-violet-300',
    border: 'border-violet-400/20 hover:border-violet-400',
  },
  special: {
    circle: 'bg-pink-400/20',
    active: 'bg-pink-400/80',
    icon: 'text-pink-300',
    border: 'border-pink-400/20 hover:border-pink-400',
  },
  neutral: {
    circle: 'bg-mauve-400/20',
    active: 'bg-mauve-400/80',
    icon: 'text-mauve-900',
    border: 'border-mauve-400/20 hover:border-mauve-400',
  },
};

export function getCategoryColors(
  scheme?: CategoryColorScheme,
): CategoryColors {
  return categoryPalette[scheme ?? 'neutral'];
}
