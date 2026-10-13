---
noteId: "algorithms-offer-question-63"
title: "63. 股票的最大利润"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-63"
sourcePath: "notes/63. 股票的最大利润.md"
order: 44
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/63.%20%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%A9%E6%B6%A6.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[Leetcode：121. Best Time to Buy and Sell Stock ](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/)

## 题目描述

可以有一次买入和一次卖出，买入必须在前。求最大收益。

<div align="center"> <img src="/cs-notes/content-assets/a722721f0745-42661013-750f-420b-b3c1-437e9a11fb65.png" width="220px"> </div><br>

## 解题思路

使用贪心策略，假设第 i 轮进行卖出操作，买入操作价格应该在 i 之前并且价格最低。因此在遍历数组时记录当前最低的买入价格，并且尝试将每个位置都作为卖出价格，取收益最大的即可。

```java
public int maxProfit(int[] prices) {
    if (prices == null || prices.length == 0)
        return 0;
    int soFarMin = prices[0];
    int maxProfit = 0;
    for (int i = 1; i < prices.length; i++) {
        soFarMin = Math.min(soFarMin, prices[i]);
        maxProfit = Math.max(maxProfit, prices[i] - soFarMin);
    }
    return maxProfit;
}
```
