import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';
import { AppHeader } from './AppHeader';
import { MenuPanel } from './MenuPanel';
import type { NavNode } from '../types/navigation';
import { findPathByPathname, getHeaderContext } from '../utils/navigation';
import rawNavData from '../data/nav-principal.json';

const navTree = rawNavData as NavNode[];

export { AppHeader } from './AppHeader';
export { MenuPanel } from './MenuPanel';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>(() =>
    findPathByPathname(navTree, location.pathname)
  );
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const authed = isAuthenticated();

  // Sincroniza o caminho na árvore quando a rota muda
  useEffect(() => {
    setCurrentPath(findPathByPathname(navTree, location.pathname));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignora erro no logout para garantir limpeza local
    } finally {
      setIsMenuOpen(false);
      navigate('/login');
    }
  };

  const headerContext = getHeaderContext(navTree, currentPath);

  return (
    <>
      <AppHeader
        onOpenMenu={() => setIsMenuOpen(true)}
        isMenuOpen={isMenuOpen}
        hamburgerRef={hamburgerRef}
        context={headerContext}
        authed={authed}
      />
      <MenuPanel
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        tree={navTree}
        currentPath={currentPath}
        onNavigateContext={(newPath) => setCurrentPath(newPath)}
        onSelectRoute={(route) => navigate(route)}
        triggerRef={hamburgerRef}
        authed={authed}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
