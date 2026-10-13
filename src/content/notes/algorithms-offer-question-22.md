---
noteId: "algorithms-offer-question-22"
title: "22. 链表中倒数第 K 个结点"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-22"
sourcePath: "notes/22. 链表中倒数第 K 个结点.md"
order: 21
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/22.%20%E9%93%BE%E8%A1%A8%E4%B8%AD%E5%80%92%E6%95%B0%E7%AC%AC%20K%20%E4%B8%AA%E7%BB%93%E7%82%B9.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

[牛客网](https://www.nowcoder.com/practice/886370fe658f41b498d40fb34ae76ff9?tpId=13\&tqId=11167\&tab=answerKey\&from=cyc_github)

## 解题思路

设链表的长度为 N。设置两个指针 P1 和 P2，先让 P1 移动 K 个节点，则还有 N - K 个节点可以移动。此时让 P1 和 P2 同时移动，可以知道当 P1 移动到链表结尾时，P2 移动到第 N - K 个节点处，该位置就是倒数第 K 个节点。

<div align="center"> <img src="/cs-notes/content-assets/dfab09485796-6b504f1f-bf76-4aab-a146-a9c7a58c2029.png" width="500"/> </div><br>

```java
public ListNode FindKthToTail(ListNode head, int k) {
    if (head == null)
        return null;
    ListNode P1 = head;
    while (P1 != null && k-- > 0)
        P1 = P1.next;
    if (k > 0)
        return null;
    ListNode P2 = head;
    while (P1 != null) {
        P1 = P1.next;
        P2 = P2.next;
    }
    return P2;
}
```
