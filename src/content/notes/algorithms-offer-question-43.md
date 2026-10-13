---
noteId: "algorithms-offer-question-43"
title: "43. 从 1 到 n 整数中 1 出现的次数"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-43"
sourcePath: "notes/43. 从 1 到 n 整数中 1 出现的次数.md"
order: 66
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/43.%20%E4%BB%8E%201%20%E5%88%B0%20n%20%E6%95%B4%E6%95%B0%E4%B8%AD%201%20%E5%87%BA%E7%8E%B0%E7%9A%84%E6%AC%A1%E6%95%B0.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/bd7f978302044eee894445e244c7eee6?tpId=13\&tqId=11184\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 解题思路

```java
public int NumberOf1Between1AndN_Solution(int n) {
    int cnt = 0;
    for (int m = 1; m <= n; m *= 10) {
        int a = n / m, b = n % m;
        cnt += (a + 8) / 10 * m + (a % 10 == 1 ? b + 1 : 0);
    }
    return cnt;
}
```

> [Leetcode : 233. Number of Digit One](https://leetcode.com/problems/number-of-digit-one/discuss/64381/4+-lines-O\(log-n\)-C++JavaPython)
