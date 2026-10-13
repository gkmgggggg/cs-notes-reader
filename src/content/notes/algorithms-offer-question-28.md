---
noteId: "algorithms-offer-question-28"
title: "28. 对称的二叉树"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-28"
sourcePath: "notes/28. 对称的二叉树.md"
order: 31
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/28.%20%E5%AF%B9%E7%A7%B0%E7%9A%84%E4%BA%8C%E5%8F%89%E6%A0%91.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/ff05d44dfdb04e1d83bdbdab320efbcb?tpId=13\&tqId=11211\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

<div align="center"> <img src="/cs-notes/content-assets/d776c53d5e60-0c12221f-729e-4c22-b0ba-0dfc909f8adf.jpg" width="300"/> </div><br>

## 解题思路

```java
boolean isSymmetrical(TreeNode pRoot) {
    if (pRoot == null)
        return true;
    return isSymmetrical(pRoot.left, pRoot.right);
}

boolean isSymmetrical(TreeNode t1, TreeNode t2) {
    if (t1 == null && t2 == null)
        return true;
    if (t1 == null || t2 == null)
        return false;
    if (t1.val != t2.val)
        return false;
    return isSymmetrical(t1.left, t2.right) && isSymmetrical(t1.right, t2.left);
}
```
