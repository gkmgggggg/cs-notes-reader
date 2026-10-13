---
noteId: "algorithms-offer-question-57-2"
title: "57.2 和为 S 的连续正数序列"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-57-2"
sourcePath: "notes/57.2 和为 S 的连续正数序列.md"
order: 15
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/57.2%20%E5%92%8C%E4%B8%BA%20S%20%E7%9A%84%E8%BF%9E%E7%BB%AD%E6%AD%A3%E6%95%B0%E5%BA%8F%E5%88%97.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目描述

[牛客网](https://www.nowcoder.com/practice/c451a3fd84b64cb19485dad758a55ebe?tpId=13\&tqId=11194\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

输出所有和为 S 的连续正数序列。例如和为 100 的连续序列有：

```
[9, 10, 11, 12, 13, 14, 15, 16]
[18, 19, 20, 21, 22]。
```

## 解题思路

```java
public ArrayList<ArrayList<Integer>> FindContinuousSequence(int sum) {
    ArrayList<ArrayList<Integer>> ret = new ArrayList<>();
    int start = 1, end = 2;
    int curSum = 3;
    while (end < sum) {
        if (curSum > sum) {
            curSum -= start;
            start++;
        } else if (curSum < sum) {
            end++;
            curSum += end;
        } else {
            ArrayList<Integer> list = new ArrayList<>();
            for (int i = start; i <= end; i++)
                list.add(i);
            ret.add(list);
            curSum -= start;
            start++;
            end++;
            curSum += end;
        }
    }
    return ret;
}
```
