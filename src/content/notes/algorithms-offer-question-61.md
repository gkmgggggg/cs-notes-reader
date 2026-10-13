---
noteId: "algorithms-offer-question-61"
title: "61. 扑克牌顺子"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-61"
sourcePath: "notes/61. 扑克牌顺子.md"
order: 74
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/61.%20%E6%89%91%E5%85%8B%E7%89%8C%E9%A1%BA%E5%AD%90.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[NowCoder](https://www.nowcoder.com/practice/762836f4d43d43ca9deb273b3de8e1f4?tpId=13\&tqId=11198\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

五张牌，其中大小鬼为癞子，牌面为 0。判断这五张牌是否能组成顺子。

<div align="center"> <img src="/cs-notes/content-assets/2ca86b8472c1-eaa506b6-0747-4bee-81f8-3cda795d8154.png" width="350px"> </div><br>

## 解题思路

```java
public boolean isContinuous(int[] nums) {

    if (nums.length < 5)
        return false;

    Arrays.sort(nums);

    // 统计癞子数量
    int cnt = 0;
    for (int num : nums)
        if (num == 0)
            cnt++;

    // 使用癞子去补全不连续的顺子
    for (int i = cnt; i < nums.length - 1; i++) {
        if (nums[i + 1] == nums[i])
            return false;
        cnt -= nums[i + 1] - nums[i] - 1;
    }

    return cnt >= 0;
}
```
