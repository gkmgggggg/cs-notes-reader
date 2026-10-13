---
noteId: "algorithms-offer-question-55-2"
title: "55.2 平衡二叉树"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-55-2"
sourcePath: "notes/55.2 平衡二叉树.md"
order: 41
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/55.2%20%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/8b3b95850edb4115918ecebdf1b4d222?tpId=13\&tqId=11192\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

平衡二叉树左右子树高度差不超过 1。

<div align="center"> <img src="/cs-notes/content-assets/f5a49aa28cea-af1d1166-63af-47b6-9aa3-2bf2bd37bd03.jpg" width="250px"/> </div><br>

## 解题思路

```java
private boolean isBalanced = true;

public boolean IsBalanced_Solution(TreeNode root) {
    height(root);
    return isBalanced;
}

private int height(TreeNode root) {
    if (root == null || !isBalanced)
        return 0;
    int left = height(root.left);
    int right = height(root.right);
    if (Math.abs(left - right) > 1)
        isBalanced = false;
    return 1 + Math.max(left, right);
}
```
