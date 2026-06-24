import { HierarchyObject, BfhlSummary, BfhlResponse } from "../types";

export interface NestedTree {
  [key: string]: NestedTree;
}

export function processGraph(data: string[]): BfhlResponse {
  const invalid_entries: string[] = [];
  const duplicate_edges_set = new Set<string>();
  const seen_valid_edges = new Set<string>();
  const childToParent = new Map<string, string>();
  const keptEdges: { parent: string; child: string }[] = [];
  const nodeFirstSeenIndex = new Map<string, number>();
  let nodeSeenCounter = 0;

  for (const rawEntry of data) {
    const trimmed = rawEntry.trim();

    // 1. Validate empty string
    if (trimmed === "") {
      invalid_entries.push(trimmed);
      continue;
    }

    // 2. Validate structure X->Y
    const match = trimmed.match(/^([A-Z])->([A-Z])$/);
    if (!match) {
      invalid_entries.push(trimmed);
      continue;
    }

    const parent = match[1];
    const child = match[2];

    // 3. Validate self-loops
    if (parent === child) {
      invalid_entries.push(trimmed);
      continue;
    }

    if (!nodeFirstSeenIndex.has(parent)) {
      nodeFirstSeenIndex.set(parent, nodeSeenCounter++);
    }
    if (!nodeFirstSeenIndex.has(child)) {
      nodeFirstSeenIndex.set(child, nodeSeenCounter++);
    }

    const edgeKey = `${parent}->${child}`;

    // 4. Duplicate Edge Handling
    if (seen_valid_edges.has(edgeKey)) {
      duplicate_edges_set.add(edgeKey);
      continue; // Discard duplicate occurrences
    }
    seen_valid_edges.add(edgeKey);

    // 5. Multi-parent Rule
    if (childToParent.has(child)) {
      continue;
    }

    childToParent.set(child, parent);
    keptEdges.push({ parent, child });
  }

  // 6. Connected Component Analysis
  const allNodes = new Set<string>();
  const undirectedAdj = new Map<string, string[]>();

  for (const edge of keptEdges) {
    allNodes.add(edge.parent);
    allNodes.add(edge.child);

    if (!undirectedAdj.has(edge.parent)) undirectedAdj.set(edge.parent, []);
    if (!undirectedAdj.has(edge.child)) undirectedAdj.set(edge.child, []);

    undirectedAdj.get(edge.parent)!.push(edge.child);
    undirectedAdj.get(edge.child)!.push(edge.parent);
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const node of allNodes) {
    if (!visited.has(node)) {
      const component: string[] = [];
      const queue = [node];
      visited.add(node);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        component.push(curr);

        const neighbors = undirectedAdj.get(curr) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(component);
    }
  }

  const dirAdj = new Map<string, string[]>();
  for (const edge of keptEdges) {
    if (!dirAdj.has(edge.parent)) {
      dirAdj.set(edge.parent, []);
    }
    dirAdj.get(edge.parent)!.push(edge.child);
  }

  const hierarchies: HierarchyObject[] = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largestTreeDepth = 0;
  let largest_tree_root = "";

  const buildTree = (currNode: string): NestedTree => {
    const children = dirAdj.get(currNode) || [];
    const sortedChildren = [...children].sort();
    const sub: NestedTree = {};
    for (const ch of sortedChildren) {
      sub[ch] = buildTree(ch);
    }
    return sub;
  };

  const calculateDepth = (currNode: string): number => {
    const children = dirAdj.get(currNode) || [];
    if (children.length === 0) {
      return 1;
    }
    let maxChildDepth = 0;
    for (const ch of children) {
      maxChildDepth = Math.max(maxChildDepth, calculateDepth(ch));
    }
    return 1 + maxChildDepth;
  };

  for (const comp of components) {
    const compSet = new Set(comp);

    const rootsInComp = comp.filter((node) => !childToParent.has(node));

    if (rootsInComp.length === 1) {
      const root = rootsInComp[0];
      const treeObj: Record<string, any> = {
        [root]: buildTree(root),
      };
      const depth = calculateDepth(root);

      hierarchies.push({
        root,
        tree: treeObj,
        depth,
      });

      total_trees++;

      if (depth > largestTreeDepth) {
        largestTreeDepth = depth;
        largest_tree_root = root;
      } else if (depth === largestTreeDepth) {
        if (!largest_tree_root || root < largest_tree_root) {
          largest_tree_root = root;
        }
      }
    }
    else {
      const sortedComp = [...comp].sort();
      const root = sortedComp[0];

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });

      total_cycles++;
    }
  }

  hierarchies.sort((a, b) => {
    const indexA = nodeFirstSeenIndex.get(a.root) ?? Number.MAX_SAFE_INTEGER;
    const indexB = nodeFirstSeenIndex.get(b.root) ?? Number.MAX_SAFE_INTEGER;
    return indexA - indexB;
  });

  const summary: BfhlSummary = {
    total_trees,
    total_cycles,
    largest_tree_root,
  };

  return {
    user_id: "prabhnoorsingh_25102005",
    email_id: "prabhnoor2493.be23@chitkara.edu.in",
    college_roll_number: "2310992493",
    hierarchies,
    invalid_entries,
    duplicate_edges: Array.from(duplicate_edges_set),
    summary,
  };
}
