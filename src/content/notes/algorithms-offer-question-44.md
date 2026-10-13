---
noteId: "algorithms-offer-question-44"
title: "44. 数字序列中的某一位数字"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-44"
sourcePath: "notes/44. 数字序列中的某一位数字.md"
order: 72
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/44.%20%E6%95%B0%E5%AD%97%E5%BA%8F%E5%88%97%E4%B8%AD%E7%9A%84%E6%9F%90%E4%B8%80%E4%BD%8D%E6%95%B0%E5%AD%97.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目描述

数字以 0123456789101112131415... 的格式序列化到一个字符串中，求这个字符串的第 index 位。

## 解题思路

```java
public int getDigitAtIndex(int index) {
    if (index < 0)
        return -1;
    int place = 1;  // 1 表示个位，2 表示 十位...
    while (true) {
        int amount = getAmountOfPlace(place);
        int totalAmount = amount * place;
        if (index < totalAmount)
            return getDigitAtIndex(index, place);
        index -= totalAmount;
        place++;
    }
}

/**
 * place 位数的数字组成的字符串长度
 * 10, 90, 900, ...
 */
private int getAmountOfPlace(int place) {
    if (place == 1)
        return 10;
    return (int) Math.pow(10, place - 1) * 9;
}

/**
 * place 位数的起始数字
 * 0, 10, 100, ...
 */
private int getBeginNumberOfPlace(int place) {
    if (place == 1)
        return 0;
    return (int) Math.pow(10, place - 1);
}

/**
 * 在 place 位数组成的字符串中，第 index 个数
 */
private int getDigitAtIndex(int index, int place) {
    int beginNumber = getBeginNumberOfPlace(place);
    int shiftNumber = index / place;
    String number = (beginNumber + shiftNumber) + "";
    int count = index % place;
    return number.charAt(count) - '0';
}
```
