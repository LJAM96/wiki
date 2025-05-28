import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { workspaceAtom } from '@/features/user/atoms/current-user-atom.ts';

export function useDynamicFavicon() {
  const [workspace] = useAtom(workspaceAtom);

  useEffect(() => {
    if (workspace?.favicon) {
      // Update favicon
      let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      
      faviconLink.href = workspace.favicon;
    }
  }, [workspace?.favicon]);

  useEffect(() => {
    if (workspace?.name) {
      // Update document title
      document.title = workspace.name;
    }
  }, [workspace?.name]);
}
