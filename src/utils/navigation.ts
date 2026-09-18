import type { NavNode, TrailItem, OtherBranchItem, HeaderContext } from '../types/navigation';

/**
 * Converte um href legado do nav-principal.json (.html) na rota do app React.
 */
export function hrefToRoute(href: string): string {
  if (!href) return '/';
  if (href === 'servicos.html') return '/';
  if (href === 'procedimentos.html') return '/';
  const clean = href.replace(/\.html$/, '');
  return `/servicos/${clean}`;
}

/**
 * Recupera um nó da árvore a partir de seu caminho de índices (ex.: [0, 1]).
 */
export function getNodeByPath(tree: NavNode[], path: number[]): NavNode | null {
  if (!path || path.length === 0) return null;
  let currentList = tree;
  let currentNode: NavNode | null = null;

  for (const idx of path) {
    if (!currentList || !currentList[idx]) return null;
    currentNode = currentList[idx];
    currentList = currentNode.submenu || [];
  }

  return currentNode;
}

/**
 * Compõe a descrição de um nó.
 * Se possuir 'desc', usa diretamente.
 * Se tiver filhos e não possuir 'desc', compõe com os 3 primeiros rótulos dos filhos.
 * Se for folha sem 'desc', retorna undefined.
 */
export function getComposedDescription(node: NavNode): string | undefined {
  if (node.desc && node.desc.trim().length > 0) {
    return node.desc;
  }
  if (node.submenu && node.submenu.length > 0) {
    const firstThree = node.submenu.slice(0, 3).map((child) => child.label).join(', ');
    return node.submenu.length > 3 ? `${firstThree}…` : firstThree;
  }
  return undefined;
}

/**
 * Monta a trilha (menu-trail) de onde o paciente está, a partir da raiz até o nó atual.
 */
export function getTrail(tree: NavNode[], path: number[]): TrailItem[] {
  const trail: TrailItem[] = [
    {
      label: 'Início',
      path: [],
      href: '/',
      isCurrent: path.length === 0,
    },
  ];

  for (let i = 0; i < path.length; i++) {
    const subPath = path.slice(0, i + 1);
    const node = getNodeByPath(tree, subPath);
    if (node) {
      trail.push({
        label: node.label,
        path: subPath,
        href: hrefToRoute(node.href),
        isCurrent: i === path.length - 1,
      });
    }
  }

  return trail;
}

/**
 * Calcula o bloco de foco e os outros ramos para o MenuPanel.
 * Se o nó for folha, o foco passa a ser o pai com o irmão atual destacado.
 */
export function getFocusAndOtherBranches(
  tree: NavNode[],
  path: number[]
): {
  effectiveFocusPath: number[];
  focusLabel: string;
  focusItems: NavNode[];
  activeChildIndex: number;
  otherBranches: OtherBranchItem[];
} {
  // Caso 0: Na raiz ([]), foca o primeiro grande ramo (Procedimentos) ou todas as raízes
  if (path.length === 0) {
    return {
      effectiveFocusPath: [],
      focusLabel: 'Navegação',
      focusItems: tree,
      activeChildIndex: -1,
      otherBranches: [],
    };
  }

  const targetNode = getNodeByPath(tree, path);
  const isLeaf = !targetNode?.submenu || targetNode.submenu.length === 0;

  let effectiveFocusPath: number[];
  let activeChildIndex = -1;

  if (isLeaf) {
    if (path.length === 1) {
      // É uma folha na própria raiz (ex.: Contatos)
      effectiveFocusPath = [];
      activeChildIndex = path[0];
    } else {
      // Foco passa a ser o pai, com o irmão atual marcado
      effectiveFocusPath = path.slice(0, -1);
      activeChildIndex = path[path.length - 1];
    }
  } else {
    effectiveFocusPath = path;
    activeChildIndex = -1;
  }

  // Obter itens em foco
  let focusLabel = 'Navegação';
  let focusItems: NavNode[] = tree;

  if (effectiveFocusPath.length > 0) {
    const focusNode = getNodeByPath(tree, effectiveFocusPath);
    if (focusNode) {
      focusLabel = focusNode.label;
      focusItems = focusNode.submenu || [];
    }
  }

  // Obter outros ramos (menu-other)
  const otherBranches: OtherBranchItem[] = [];

  if (effectiveFocusPath.length > 1) {
    // 1. Irmãos do nó em foco (que não estão em foco)
    const parentPath = effectiveFocusPath.slice(0, -1);
    const parentNode = getNodeByPath(tree, parentPath);
    const currentBranchIndex = effectiveFocusPath[effectiveFocusPath.length - 1];

    if (parentNode && parentNode.submenu) {
      parentNode.submenu.forEach((sibling, idx) => {
        if (idx !== currentBranchIndex) {
          otherBranches.push({
            label: sibling.label,
            path: [...parentPath, idx],
            count: sibling.submenu?.length,
          });
        }
      });
    }

    // 2. Outras raízes da árvore
    const rootIndex = effectiveFocusPath[0];
    tree.forEach((rootNode, idx) => {
      if (idx !== rootIndex) {
        otherBranches.push({
          label: rootNode.label,
          path: [idx],
          count: undefined,
        });
      }
    });
  } else if (effectiveFocusPath.length === 1) {
    // Foco está em uma raiz: os outros ramos são as outras raízes
    const rootIndex = effectiveFocusPath[0];
    tree.forEach((rootNode, idx) => {
      if (idx !== rootIndex) {
        otherBranches.push({
          label: rootNode.label,
          path: [idx],
          count: undefined,
        });
      }
    });
  }

  return {
    effectiveFocusPath,
    focusLabel,
    focusItems,
    activeChildIndex,
    otherBranches,
  };
}

/**
 * Encontra o caminho na árvore correspondente à URL/slug atual.
 */
export function findPathByPathname(tree: NavNode[], pathname: string): number[] {
  if (pathname === '/' || !pathname || pathname === '/solicitacoes') {
    return [0]; // Padrão: Procedimentos de Enfermagem
  }

  // Extrair slug de /servicos/:slug
  const match = pathname.match(/^\/servicos\/([^/]+)/);
  const slug = match ? match[1] : '';

  if (!slug) return [0];

  const targetHtml = `${slug}.html`;

  function search(nodes: NavNode[], currentPath: number[]): number[] | null {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const newPath = [...currentPath, i];
      if (node.href === targetHtml) {
        return newPath;
      }
      if (node.submenu && node.submenu.length > 0) {
        const found = search(node.submenu, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  const foundPath = search(tree, []);
  return foundPath || [0];
}

/**
 * Obtém contexto para o cabeçalho fixado a partir do caminho atual.
 */
export function getHeaderContext(tree: NavNode[], path: number[]): HeaderContext | null {
  if (!path || path.length === 0) return null;
  const node = getNodeByPath(tree, path);
  if (!node) return null;

  if (path.length === 1) {
    return {
      parent: undefined,
      label: node.label,
    };
  }

  const parentNode = getNodeByPath(tree, path.slice(0, -1));
  return {
    parent: parentNode?.label,
    label: node.label,
  };
}
