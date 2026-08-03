import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setBottomNavSlot } from '@/app/store/slices/uiSlice';
import { navItems, type NavItem } from './navConfig';

export function useBottomNav() {
  const paths = useSelector((s: RootState) => s.ui.bottomNav);
  const dispatch = useDispatch();

  const items: NavItem[] = paths
    .map(p => navItems.find(n => n.path === p))
    .filter((n): n is NavItem => n !== undefined);

  const setSlot = useCallback(
    (slot: number, path: string) => dispatch(setBottomNavSlot({ slot, path })),
    [dispatch],
  );

  return { items, setSlot };
}