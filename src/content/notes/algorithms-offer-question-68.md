---
noteId: "algorithms-offer-question-68"
title: "68. 树中两个节点的最低公共祖先"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-68"
sourcePath: "notes/68. 树中两个节点的最低公共祖先.md"
order: 42
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/68.%20%E6%A0%91%E4%B8%AD%E4%B8%A4%E4%B8%AA%E8%8A%82%E7%82%B9%E7%9A%84%E6%9C%80%E4%BD%8E%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 68.1 二叉查找树

### 题目链接

[Leetcode : 235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)

### 解题思路

在二叉查找树中，两个节点 p, q 的公共祖先 root 满足 root.val >= p.val && root.val <= q.val。

<div align="center"> <img src="/cs-notes/content-assets/9def84d32ed4-047faac4-a368-4565-8331-2b66253080d3.jpg" width="250"/> </div><br>

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null)
        return root;
    if (root.val > p.val && root.val > q.val)
        return lowestCommonAncestor(root.left, p, q);
    if (root.val < p.val && root.val < q.val)
        return lowestCommonAncestor(root.right, p, q);
    return root;
}
```

## 68.2 普通二叉树

### 题目链接

[Leetcode : 236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/)

### 解题思路

在左右子树中查找是否存在 p 或者 q，如果 p 和 q 分别在两个子树中，那么就说明根节点就是最低公共祖先。

<div align="center"> <img src="/cs-notes/content-assets/1ba12a449dfd-d27c99f0-7881-4f2d-9675-c75cbdee3acd.jpg" width="250"/> </div><br>

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q)
        return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    return left == null ? right : right == null ? left : root;
}
```
