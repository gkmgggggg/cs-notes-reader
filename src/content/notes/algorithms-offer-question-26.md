---
noteId: "algorithms-offer-question-26"
title: "26. 树的子结构"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-26"
sourcePath: "notes/26. 树的子结构.md"
order: 29
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/26.%20%E6%A0%91%E7%9A%84%E5%AD%90%E7%BB%93%E6%9E%84.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[牛客网](https://www.nowcoder.com/practice/6e196c44c7004d15b1610b9afca8bd88?tpId=13\&tqId=11170\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

<div align="center"> <img src="/cs-notes/content-assets/c09a755dce43-84a5b15a-86c5-4d8e-9439-d9fd5a4699a1.jpg" width="450"/> </div><br>

## 解题思路

```java
public boolean HasSubtree(TreeNode root1, TreeNode root2) {
    if (root1 == null || root2 == null)
        return false;
    return isSubtreeWithRoot(root1, root2) || HasSubtree(root1.left, root2) || HasSubtree(root1.right, root2);
}

private boolean isSubtreeWithRoot(TreeNode root1, TreeNode root2) {
    if (root2 == null)
        return true;
    if (root1 == null)
        return false;
    if (root1.val != root2.val)
        return false;
    return isSubtreeWithRoot(root1.left, root2.left) && isSubtreeWithRoot(root1.right, root2.right);
}
```
