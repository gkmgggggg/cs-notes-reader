---
noteId: "algorithms-offer-question-9"
title: "9. 用两个栈实现队列"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-9"
sourcePath: "notes/9. 用两个栈实现队列.md"
order: 7
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/9.%20%E7%94%A8%E4%B8%A4%E4%B8%AA%E6%A0%88%E5%AE%9E%E7%8E%B0%E9%98%9F%E5%88%97.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[牛客网](https://www.nowcoder.com/practice/54275ddae22f475981afa2244dd448c6?tpId=13\&tqId=11158\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

用两个栈来实现一个队列，完成队列的 Push 和 Pop 操作。

## 解题思路

in 栈用来处理入栈（push）操作，out 栈用来处理出栈（pop）操作。一个元素进入 in 栈之后，出栈的顺序被反转。当元素要出栈时，需要先进入 out 栈，此时元素出栈顺序再一次被反转，因此出栈顺序就和最开始入栈顺序是相同的，先进入的元素先退出，这就是队列的顺序。

<div align="center"> <img src="/cs-notes/content-assets/c6a7d09b7a95-3ea280b5-be7d-471b-ac76-ff020384357c.gif" width="450"/> </div><br>

```java
Stack<Integer> in = new Stack<Integer>();
Stack<Integer> out = new Stack<Integer>();

public void push(int node) {
    in.push(node);
}

public int pop() throws Exception {
    if (out.isEmpty())
        while (!in.isEmpty())
            out.push(in.pop());

    if (out.isEmpty())
        throw new Exception("queue is empty");

    return out.pop();
}
```
