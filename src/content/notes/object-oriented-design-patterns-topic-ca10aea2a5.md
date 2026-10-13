---
noteId: "object-oriented-design-patterns-topic-ca10aea2a5"
title: "设计模式 · 空对象"
categoryId: "object-oriented"
category: "面向对象"
route: "object-oriented/design-patterns/topic-ca10aea2a5"
sourcePath: "notes/设计模式 - 空对象.md"
order: 154
groupId: "object-oriented-design-patterns"
parentId: "object-oriented-design-patterns"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20%E7%A9%BA%E5%AF%B9%E8%B1%A1.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 空对象（Null）

### Intent

使用什么都不做

的空对象来代替 NULL。

一个方法返回 NULL，意味着方法的调用端需要去检查返回值是否是 NULL，这么做会导致非常多的冗余的检查代码。并且如果某一个调用端忘记了做这个检查返回值，而直接使用返回的对象，那么就有可能抛出空指针异常。

### Class Diagram

<div align="center"> <img src="/cs-notes/content-assets/3747c51edd6e-22870bbe-898f-4c17-a31a-d7c5ee5d1c10.png"/> </div><br>

### Implementation

```java
public abstract class AbstractOperation {
    abstract void request();
}
```

```java
public class RealOperation extends AbstractOperation {
    @Override
    void request() {
        System.out.println("do something");
    }
}
```

```java
public class NullOperation extends AbstractOperation{
    @Override
    void request() {
        // do nothing
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        AbstractOperation abstractOperation = func(-1);
        abstractOperation.request();
    }

    public static AbstractOperation func(int para) {
        if (para < 0) {
            return new NullOperation();
        }
        return new RealOperation();
    }
}
```
