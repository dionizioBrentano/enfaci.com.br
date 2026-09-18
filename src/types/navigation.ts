export interface NavNode {
  label: string;
  href: string;
  submenu?: NavNode[];
  desc?: string;
  icon?: string;
}

export interface TrailItem {
  label: string;
  path: number[];
  href: string;
  isCurrent: boolean;
}

export interface OtherBranchItem {
  label: string;
  path: number[];
  count?: number;
}

export interface HeaderContext {
  parent?: string;
  label: string;
}
