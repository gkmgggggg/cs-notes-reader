---
noteId: "algorithms-offer-question-60"
title: "60. n 个骰子的点数"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-60"
sourcePath: "notes/60. n 个骰子的点数.md"
order: 62
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/60.%20n%20%E4%B8%AA%E9%AA%B0%E5%AD%90%E7%9A%84%E7%82%B9%E6%95%B0.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[Lintcode](https://www.lintcode.com/en/problem/dices-sum/)

## 题目描述

把 n 个骰子扔在地上，求点数和为 s 的概率。

<div align="center"> <img src="/cs-notes/content-assets/7af217de0313-195f8693-5ec4-4987-8560-f25e365879dd.png" width="300px"> </div><br>

## 解题思路

### 动态规划

使用一个二维数组 dp 存储点数出现的次数，其中 dp\[i]\[j] 表示前 i 个骰子产生点数 j 的次数。

空间复杂度：O(N<sup>2</sup>)

```java
public List<Map.Entry<Integer, Double>> dicesSum(int n) {
    final int face = 6;
    final int pointNum = face * n;
    long[][] dp = new long[n + 1][pointNum + 1];

    for (int i = 1; i <= face; i++)
        dp[1][i] = 1;

    for (int i = 2; i <= n; i++)
        for (int j = i; j <= pointNum; j++)     /* 使用 i 个骰子最小点数为 i */
            for (int k = 1; k <= face && k <= j; k++)
                dp[i][j] += dp[i - 1][j - k];

    final double totalNum = Math.pow(6, n);
    List<Map.Entry<Integer, Double>> ret = new ArrayList<>();
    for (int i = n; i <= pointNum; i++)
        ret.add(new AbstractMap.SimpleEntry<>(i, dp[n][i] / totalNum));

    return ret;
}
```

### 动态规划 + 旋转数组

空间复杂度：O(N)

```java
public List<Map.Entry<Integer, Double>> dicesSum(int n) {
    final int face = 6;
    final int pointNum = face * n;
    long[][] dp = new long[2][pointNum + 1];

    for (int i = 1; i <= face; i++)
        dp[0][i] = 1;

    int flag = 1;                                     /* 旋转标记 */
    for (int i = 2; i <= n; i++, flag = 1 - flag) {
        for (int j = 0; j <= pointNum; j++)
            dp[flag][j] = 0;                          /* 旋转数组清零 */

        for (int j = i; j <= pointNum; j++)
            for (int k = 1; k <= face && k <= j; k++)
                dp[flag][j] += dp[1 - flag][j - k];
    }

    final double totalNum = Math.pow(6, n);
    List<Map.Entry<Integer, Double>> ret = new ArrayList<>();
    for (int i = n; i <= pointNum; i++)
        ret.add(new AbstractMap.SimpleEntry<>(i, dp[1 - flag][i] / totalNum));

    return ret;
}
```
