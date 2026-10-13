---
noteId: "algorithms-offer-question-30"
title: "30. 包含 min 函数的栈"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-30"
sourcePath: "notes/30. 包含 min 函数的栈.md"
order: 8
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/30.%20%E5%8C%85%E5%90%AB%20min%20%E5%87%BD%E6%95%B0%E7%9A%84%E6%A0%88.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[牛客网](https://www.nowcoder.com/practice/4c776177d2c04c2494f2555c9fcc1e49?tpId=13\&tqId=11173\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

实现一个包含 min() 函数的栈，该方法返回当前栈中最小的值。

## 解题思路

使用一个额外的 minStack，栈顶元素为当前栈中最小的值。在对栈进行 push 入栈和 pop 出栈操作时，同样需要对 minStack 进行入栈出栈操作，从而使 minStack 栈顶元素一直为当前栈中最小的值。在进行 push 操作时，需要比较入栈元素和当前栈中最小值，将值较小的元素 push 到 minStack 中。

<div align="center"> <img src="/cs-notes/content-assets/44cca445bf8e-image-20201104013936126.png" width="350px"> </div><br>

```java
private Stack<Integer> dataStack = new Stack<>();
private Stack<Integer> minStack = new Stack<>();

public void push(int node) {
    dataStack.push(node);
    minStack.push(minStack.isEmpty() ? node : Math.min(minStack.peek(), node));
}

public void pop() {
    dataStack.pop();
    minStack.pop();
}

public int top() {
    return dataStack.peek();
}

public int min() {
    return minStack.peek();
}
```
