---
noteId: "algorithms-offer-question-27"
title: "27. 二叉树的镜像"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-27"
sourcePath: "notes/27. 二叉树的镜像.md"
order: 30
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/27.%20%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E9%95%9C%E5%83%8F.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[牛客网](https://www.nowcoder.com/practice/a9d0ecbacef9410ca97463e4a5c83be7?tpId=13\&tqId=11171\&tab=answerKey\&from=cyc_github)

## 题目描述

<div align="center"> <img src="/cs-notes/content-assets/d776c53d5e60-0c12221f-729e-4c22-b0ba-0dfc909f8adf.jpg" width="300"/> </div><br>

## 解题思路

```java
public TreeNode Mirror(TreeNode root) {
    if (root == null)
        return root;
    swap(root);
    Mirror(root.left);
    Mirror(root.right);
    return root;
}

private void swap(TreeNode root) {
    TreeNode t = root.left;
    root.left = root.right;
    root.right = t;
}
```
