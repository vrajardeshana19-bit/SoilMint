export interface NavigationItem {
  label: string;
  to: string;
}

export const navigation: NavigationItem[] = [
  { label: 'Platform', to: '/' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'About', to: '/about' },
];
