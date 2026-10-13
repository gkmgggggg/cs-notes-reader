---
noteId: "algorithms-offer-question-17"
title: "17. 打印从 1 到最大的 n 位数"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-17"
sourcePath: "notes/17. 打印从 1 到最大的 n 位数.md"
order: 69
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/17.%20%E6%89%93%E5%8D%B0%E4%BB%8E%201%20%E5%88%B0%E6%9C%80%E5%A4%A7%E7%9A%84%20n%20%E4%BD%8D%E6%95%B0.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目描述

输入数字 n，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数即 999。

## 解题思路

由于 n 可能会非常大，因此不能直接用 int 表示数字，而是用 char 数组进行存储。

使用回溯法得到所有的数。

```java
public void print1ToMaxOfNDigits(int n) {
    if (n <= 0)
        return;
    char[] number = new char[n];
    print1ToMaxOfNDigits(number, 0);
}

private void print1ToMaxOfNDigits(char[] number, int digit) {
    if (digit == number.length) {
        printNumber(number);
        return;
    }
    for (int i = 0; i < 10; i++) {
        number[digit] = (char) (i + '0');
        print1ToMaxOfNDigits(number, digit + 1);
    }
}

private void printNumber(char[] number) {
    int index = 0;
    while (index < number.length && number[index] == '0')
        index++;
    while (index < number.length)
        System.out.print(number[index++]);
    System.out.println();
}
```
