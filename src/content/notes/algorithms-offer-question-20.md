---
noteId: "algorithms-offer-question-20"
title: "20. 表示数值的字符串"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-20"
sourcePath: "notes/20. 表示数值的字符串.md"
order: 71
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/20.%20%E8%A1%A8%E7%A4%BA%E6%95%B0%E5%80%BC%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[牛客网](https://www.nowcoder.com/practice/e69148f8528c4039ad89bb2546fd4ff8?tpId=13\&tqId=11206\&tab=answerKey\&from=cyc_github)

## 题目描述

```
true

"+100"
"5e2"
"-123"
"3.1416"
"-1E-16"
```

```
false

"12e"
"1a3.14"
"1.2.3"
"+-5"
"12e+4.3"
```

## 解题思路

使用正则表达式进行匹配。

```html
[]  ： 字符集合
()  ： 分组
?   ： 重复 0 ~ 1 次
+   ： 重复 1 ~ n 次
*   ： 重复 0 ~ n 次
.   ： 任意字符
\\. ： 转义后的 .
\\d ： 数字
```

```java
public boolean isNumeric (String str) {
    if (str == null || str.length() == 0)
        return false;
    return new String(str).matches("[+-]?\\d*(\\.\\d+)?([eE][+-]?\\d+)?");
}
```
