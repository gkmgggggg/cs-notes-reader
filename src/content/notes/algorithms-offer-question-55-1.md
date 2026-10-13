---
noteId: "algorithms-offer-question-55-1"
title: "55.1 二叉树的深度"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-55-1"
sourcePath: "notes/55.1 二叉树的深度.md"
order: 40
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/55.1%20%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%B7%B1%E5%BA%A6.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/435fb86331474282a3499955f0a41e8b?tpId=13\&tqId=11191\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

从根结点到叶结点依次经过的结点（含根、叶结点）形成树的一条路径，最长路径的长度为树的深度。

<div align="center"> <img src="/cs-notes/content-assets/61601d03317d-ba355101-4a93-4c71-94fb-1da83639727b.jpg" width="350px"/> </div><br>

## 解题思路

```java
public int TreeDepth(TreeNode root) {
    return root == null ? 0 : 1 + Math.max(TreeDepth(root.left), TreeDepth(root.right));
}
```
