export type NavSection = 'work' | 'about' | 'contact';

export interface NoticeState {
  isOpen: boolean;
  title: string;
  message: string;
}
