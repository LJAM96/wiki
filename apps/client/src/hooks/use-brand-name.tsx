import { useAtom } from 'jotai';
import { workspaceAtom } from '@/features/user/atoms/current-user-atom.ts';

export function useBrandName() {
  const [workspace] = useAtom(workspaceAtom);
  
  return workspace?.brandName || 'Docmost';
}

export function useBrandedText(text: string) {
  const brandName = useBrandName();
  
  // Replace "Docmost" with the custom brand name
  return text.replace(/Docmost/g, brandName);
}
