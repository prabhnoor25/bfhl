export interface HierarchyObject {
  root: string;
  tree: Record<string, any>;
  depth?: number;
  has_cycle?: true;
}

export interface BfhlSummary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
}

export interface BfhlResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: HierarchyObject[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: BfhlSummary;
}

export interface BfhlRequest {
  data: string[];
}
