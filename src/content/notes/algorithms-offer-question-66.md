---
noteId: "algorithms-offer-question-66"
title: "66. 构建乘积数组"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-66"
sourcePath: "notes/66. 构建乘积数组.md"
order: 63
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/66.%20%E6%9E%84%E5%BB%BA%E4%B9%98%E7%A7%AF%E6%95%B0%E7%BB%84.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[NowCoder](https://www.nowcoder.com/practice/94a4d381a68b47b7a8bed86f2975db46?tpId=13\&tqId=11204\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

给定一个数组 A\[0, 1,..., n-1]，请构建一个数组 B\[0, 1,..., n-1]，其中 B 中的元素 B\[i]=A\[0]\*A\[1]\*...\*A\[i-1]\*A\[i+1]\*...\*A\[n-1]。要求不能使用除法。

<div align="center"> <img src="/cs-notes/content-assets/b1bff9421371-4240a69f-4d51-4d16-b797-2dfe110f30bd.png" width="250px"> </div><br>

## 解题思路

```java
public int[] multiply(int[] A) {
    int n = A.length;
    int[] B = new int[n];
    for (int i = 0, product = 1; i < n; product *= A[i], i++)       /* 从左往右累乘 */
        B[i] = product;
    for (int i = n - 1, product = 1; i >= 0; product *= A[i], i--)  /* 从右往左累乘 */
        B[i] *= product;
    return B;
}
```
