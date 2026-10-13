---
noteId: "algorithms-offer-question-48"
title: "48. 最长不含重复字符的子字符串"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-48"
sourcePath: "notes/48. 最长不含重复字符的子字符串.md"
order: 60
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/48.%20%E6%9C%80%E9%95%BF%E4%B8%8D%E5%90%AB%E9%87%8D%E5%A4%8D%E5%AD%97%E7%AC%A6%E7%9A%84%E5%AD%90%E5%AD%97%E7%AC%A6%E4%B8%B2.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目描述

输入一个字符串（只包含 a\~z 的字符），求其最长不含重复字符的子字符串的长度。例如对于 arabcacfr，最长不含重复字符的子字符串为 acfr，长度为 4。

## 解题思路

```java
public int longestSubStringWithoutDuplication(String str) {
    int curLen = 0;
    int maxLen = 0;
    int[] preIndexs = new int[26];
    Arrays.fill(preIndexs, -1);
    for (int curI = 0; curI < str.length(); curI++) {
        int c = str.charAt(curI) - 'a';
        int preI = preIndexs[c];
        if (preI == -1 || curI - preI > curLen) {
            curLen++;
        } else {
            maxLen = Math.max(maxLen, curLen);
            curLen = curI - preI;
        }
        preIndexs[c] = curI;
    }
    maxLen = Math.max(maxLen, curLen);
    return maxLen;
}
```
