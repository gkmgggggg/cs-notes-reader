---
noteId: "algorithms-offer-question-15"
title: "15. 二进制中 1 的个数"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-15"
sourcePath: "notes/15. 二进制中 1 的个数.md"
order: 67
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/15.%20%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%B8%AD%201%20%E7%9A%84%E4%B8%AA%E6%95%B0.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[牛客网](https://www.nowcoder.com/practice/8ee967e43c2c4ec193b040ea7fbb10b8?tpId=13\&tqId=11164\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

输入一个整数，输出该数二进制表示中 1 的个数。

### 解题思路

n&(n-1) 位运算可以将 n 的位级表示中最低的那一位 1 设置为 0。不断将 1 设置为 0，直到 n 为 0。时间复杂度：O(M)，其中 M 表示 1 的个数。

<div align="center"> <img src="/cs-notes/content-assets/94983696112a-image-20201105004127554.png" width="500px"> </div><br>

```java
public int NumberOf1(int n) {
    int cnt = 0;
    while (n != 0) {
        cnt++;
        n &= (n - 1);
    }
    return cnt;
}
```
