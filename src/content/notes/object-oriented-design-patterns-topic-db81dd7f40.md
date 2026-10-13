---
noteId: "object-oriented-design-patterns-topic-db81dd7f40"
title: "设计模式 · 原型模式"
categoryId: "object-oriented"
category: "面向对象"
route: "object-oriented/design-patterns/topic-db81dd7f40"
sourcePath: "notes/设计模式 - 原型模式.md"
order: 142
groupId: "object-oriented-design-patterns"
parentId: "object-oriented-design-patterns"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 6. 原型模式（Prototype）

### Intent

使用原型实例指定要创建对象的类型，通过复制这个原型来创建新对象。

### Class Diagram

<div align="center"> <img src="/cs-notes/content-assets/eb8dbc33600a-b8922f8c-95e6-4187-be85-572a509afb71.png"/> </div><br>

### Implementation

```java
public abstract class Prototype {
    abstract Prototype myClone();
}
```

```java
public class ConcretePrototype extends Prototype {

    private String filed;

    public ConcretePrototype(String filed) {
        this.filed = filed;
    }

    @Override
    Prototype myClone() {
        return new ConcretePrototype(filed);
    }

    @Override
    public String toString() {
        return filed;
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        Prototype prototype = new ConcretePrototype("abc");
        Prototype clone = prototype.myClone();
        System.out.println(clone.toString());
    }
}
```

```html
abc
```

### JDK

* [java.lang.Object#clone()](http://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#clone%28%29)
