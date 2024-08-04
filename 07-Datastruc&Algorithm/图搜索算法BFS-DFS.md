

# 图搜索算法
用于解决最短路径、所有路径、是否连通等问题；

图搜索算法需要考虑的情况：
1、根据是否存在权重，选择计算最短的指标；
2、如果存在环，需要增加==访问记录==，以此跳过访问过的节点；

## DFS和BFS的选择
DFS适用于：
- 求解所有路径；
- 找到一条路径；(某两个顶点是否连通)
BFS适用于：
- 求解所有路径；
- 找到一条路径；(某两个顶点是否连通)
- ==搜索最短路径==；
- ==构建最小生成树==；

# DFS
优势：
1、占用内存空间少；只需要存储当前路径节点；
2、不适合最短路径问题；
3、可以进行回溯；

适用问题：
1、求解所有路径、找到一条路径(某两个顶点是否连通)；

模板：
1、通常使用递归的方式；(如果是二叉树可以前序遍历)
```java
public void DFS(TreeNode root) {
    if (root == null)
        return;

    //在这里处理遍历到的TreeNode节点
    DFS(root.left);
    DFS(root.right);
}
```

2、栈实现；
```java
public void DFSWithStack(TreeNode root) {
     if (root != null)
         return;
     Stack<TreeNode> stack = new Stack<>();
     stack.push(root);

     while (!stack.isEmpty()) {
         TreeNode treeNode = stack.pop();

         //在这里处理遍历到的TreeNode

         if (treeNode.right != null)
             stack.push(treeNode.right);
         if (treeNode.left != null)
             stack.push(treeNode.left);
     }
}
```

3、二维数组DFS(岛屿问题)
```java
private int[] dx = new int[]{0, 1, -1, 0};
private int[] dy = new int[]{1, 0, 0, -1};

private void dfs(char[][] grid, int x, int y) {
    // 边界
    if (x >= grid.length || y >= grid[0].length || x < 0 || y < 0) {
        return;
    }
    
    // 需要处理的逻辑

    for (int j = 0; j < 4; j++) {
        // 分别探索四个方向
        dfs(grid, x + dx[j], y + dy[j]);
    }
}
```


# BFS
特点：
1、能够找到最近的节点，DFS不擅长；
2、占用空间更大，需要存储整个图；

适用问题：
1、求解所有路径、找到一条路径(某两个顶点是否连通)；
2、==最短路径问题==；
- 如果无权图，则可以找到第一个路径就停止；
- 如果有权图，则需要==优先队列==，队列内保持权重排序，每次优先寻找最小权重节点；但是仍然需要遍历能够到达终点的所有可能情况，选择最短的路径；

模板：
1、通常需要一个队列，保存将要访问的节点；

```java
public void BFSWithQueue(TreeNode root) { 
	Deque<TreeNode> queue = new ArrayDeque<>(); 
	
	if (root != null) 
		queue.add(root); 
		
	while (!queue.isEmpty()) {
		TreeNode treeNode = queue.poll(); 
		
		//在这里处理遍历到的TreeNode节点 
		
		if (treeNode.left != null) 
			queue.add(treeNode.left); 
		if (treeNode.right != null) 
			queue.add(treeNode.right); 
	} 
}
```