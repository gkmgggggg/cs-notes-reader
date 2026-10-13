---
noteId: "algorithms-offer-question-57-1"
title: "57.1 和为 S 的两个数字"
categoryId: "algorithms"
category: "算法"
route: "algorithms/offer/question-57-1"
sourcePath: "notes/57.1 和为 S 的两个数字.md"
order: 14
groupId: "algorithms-offer"
parentId: "algorithms-offer"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/57.1%20%E5%92%8C%E4%B8%BA%20S%20%E7%9A%84%E4%B8%A4%E4%B8%AA%E6%95%B0%E5%AD%97.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 题目链接

[牛客网](https://www.nowcoder.com/practice/390da4f7a00f44bea7c2f3d19491311b?tpId=13\&tqId=11195\&tPage=1\&rp=1\&ru=/ta/coding-interviews\&qru=/ta/coding-interviews/question-ranking\&from=cyc_github)

## 题目描述

在有序数组中找出两个数，使得和为给定的数 S。如果有多对数字的和等于 S，输出两个数的乘积最小的。

## 解题思路

使用双指针，一个指针指向元素较小的值，一个指针指向元素较大的值。指向较小元素的指针从头向尾遍历，指向较大元素的指针从尾向头遍历。

* 如果两个指针指向元素的和 sum == target，那么这两个元素即为所求。
* 如果 sum > target，移动较大的元素，使 sum 变小一些；
* 如果 sum < target，移动较小的元素，使 sum 变大一些。

```java
public ArrayList<Integer> FindNumbersWithSum(int[] nums, int target) {
    int i = 0, j = nums.length - 1;
    while (i < j) {
        int cur = nums[i] + array[j];
        if (cur == target)
            return new ArrayList<>(Arrays.asList(nums[i], nums[j]));
        if (cur < target)
            i++;
        else
            j--;
    }
    return new ArrayList<>();
}
```
