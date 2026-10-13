---
noteId: "algorithms-offer-question-18-2"
title: "18.2 删除链表中重复的结点"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-18-2"
sourcePath: "notes/18.2 删除链表中重复的结点.md"
order: 20
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/18.2%20%E5%88%A0%E9%99%A4%E9%93%BE%E8%A1%A8%E4%B8%AD%E9%87%8D%E5%A4%8D%E7%9A%84%E7%BB%93%E7%82%B9.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[牛客网](https://www.nowcoder.com/practice/fc533c45b73a41b0b44ccba763f866ef?tpId=13\&tqId=11209\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

<div align="center"> <img src="/cs-notes/content-assets/579c827f5534-17e301df-52e8-4886-b593-841a16d13e44.png" width="450"/> </div><br>

## 解题描述

```java
public ListNode deleteDuplication(ListNode pHead) {
    if (pHead == null || pHead.next == null)
        return pHead;
    ListNode next = pHead.next;
    if (pHead.val == next.val) {
        while (next != null && pHead.val == next.val)
            next = next.next;
        return deleteDuplication(next);
    } else {
        pHead.next = deleteDuplication(pHead.next);
        return pHead;
    }
}
```
