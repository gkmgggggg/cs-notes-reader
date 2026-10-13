---
noteId: "algorithms-offer-question-54"
title: "54. 二叉查找树的第 K 个结点"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-54"
sourcePath: "notes/54. 二叉查找树的第 K 个结点.md"
order: 39
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/54.%20%E4%BA%8C%E5%8F%89%E6%9F%A5%E6%89%BE%E6%A0%91%E7%9A%84%E7%AC%AC%20K%20%E4%B8%AA%E7%BB%93%E7%82%B9.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/ef068f602dde4d28aab2b210e859150a?tpId=13\&tqId=11215\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 解题思路

利用二叉查找树中序遍历有序的特点。

```java
private TreeNode ret;
private int cnt = 0;

public TreeNode KthNode(TreeNode pRoot, int k) {
    inOrder(pRoot, k);
    return ret;
}

private void inOrder(TreeNode root, int k) {
    if (root == null || cnt >= k)
        return;
    inOrder(root.left, k);
    cnt++;
    if (cnt == k)
        ret = root;
    inOrder(root.right, k);
}
```
