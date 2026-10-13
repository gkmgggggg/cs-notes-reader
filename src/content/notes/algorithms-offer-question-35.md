---
noteId: "algorithms-offer-question-35"
title: "35. 复杂链表的复制"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-35"
sourcePath: "notes/35. 复杂链表的复制.md"
order: 25
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/35.%20%E5%A4%8D%E6%9D%82%E9%93%BE%E8%A1%A8%E7%9A%84%E5%A4%8D%E5%88%B6.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[NowCoder](https://www.nowcoder.com/practice/f836b2c43afc4b35ad6adc41ec941dba?tpId=13\&tqId=11178\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针指向任意一个节点），返回结果为复制后复杂链表的 head。

```java
public class RandomListNode {
    int label;
    RandomListNode next = null;
    RandomListNode random = null;

    RandomListNode(int label) {
        this.label = label;
    }
}
```

<div align="center"> <img src="/cs-notes/content-assets/363e7a28c72c-66a01953-5303-43b1-8646-0c77b825e980.png" width="300"/> </div><br>

## 解题思路

第一步，在每个节点的后面插入复制的节点。

<div align="center"> <img src="/cs-notes/content-assets/286e5c0e744c-dfd5d3f8-673c-486b-8ecf-d2082107b67b.png" width="600"/> </div><br>

第二步，对复制节点的 random 链接进行赋值。

<div align="center"> <img src="/cs-notes/content-assets/c2f88b1801c6-cafbfeb8-7dfe-4c0a-a3c9-750eeb824068.png" width="600"/> </div><br>

第三步，拆分。

<div align="center"> <img src="/cs-notes/content-assets/4f3061e56b5a-e151b5df-5390-4365-b66e-b130cd253c12.png" width="600"/> </div><br>

```java
public RandomListNode Clone(RandomListNode pHead) {
    if (pHead == null)
        return null;
    // 插入新节点
    RandomListNode cur = pHead;
    while (cur != null) {
        RandomListNode clone = new RandomListNode(cur.label);
        clone.next = cur.next;
        cur.next = clone;
        cur = clone.next;
    }
    // 建立 random 链接
    cur = pHead;
    while (cur != null) {
        RandomListNode clone = cur.next;
        if (cur.random != null)
            clone.random = cur.random.next;
        cur = clone.next;
    }
    // 拆分
    cur = pHead;
    RandomListNode pCloneHead = pHead.next;
    while (cur.next != null) {
        RandomListNode next = cur.next;
        cur.next = next.next;
        cur = next;
    }
    return pCloneHead;
}
```
