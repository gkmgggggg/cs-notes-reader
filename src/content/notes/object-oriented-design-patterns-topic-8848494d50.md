---
noteId: "object-oriented-design-patterns-topic-8848494d50"
title: "设计模式 · 享元"
categoryId: "object-oriented"
category: "面向对象"
route: "object-oriented/design-patterns/topic-8848494d50"
sourcePath: "notes/设计模式 - 享元.md"
order: 160
groupId: "object-oriented-design-patterns"
parentId: "object-oriented-design-patterns"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20%E4%BA%AB%E5%85%83.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 享元（Flyweight）

### Intent

利用共享的方式来支持大量细粒度的对象，这些对象一部分内部状态是相同的。

### Class Diagram

* Flyweight：享元对象
* IntrinsicState：内部状态，享元对象共享内部状态
* ExtrinsicState：外部状态，每个享元对象的外部状态不同

<div align="center"> <img src="/cs-notes/content-assets/4619ebc0aca5-5f5c22d5-9c0e-49e1-b5b0-6cc7032724d4.png"/> </div><br>

### Implementation

```java
public interface Flyweight {
    void doOperation(String extrinsicState);
}
```

```java
public class ConcreteFlyweight implements Flyweight {

    private String intrinsicState;

    public ConcreteFlyweight(String intrinsicState) {
        this.intrinsicState = intrinsicState;
    }

    @Override
    public void doOperation(String extrinsicState) {
        System.out.println("Object address: " + System.identityHashCode(this));
        System.out.println("IntrinsicState: " + intrinsicState);
        System.out.println("ExtrinsicState: " + extrinsicState);
    }
}
```

```java
public class FlyweightFactory {

    private HashMap<String, Flyweight> flyweights = new HashMap<>();

    Flyweight getFlyweight(String intrinsicState) {
        if (!flyweights.containsKey(intrinsicState)) {
            Flyweight flyweight = new ConcreteFlyweight(intrinsicState);
            flyweights.put(intrinsicState, flyweight);
        }
        return flyweights.get(intrinsicState);
    }
}
```

```java
public class Client {

    public static void main(String[] args) {
        FlyweightFactory factory = new FlyweightFactory();
        Flyweight flyweight1 = factory.getFlyweight("aa");
        Flyweight flyweight2 = factory.getFlyweight("aa");
        flyweight1.doOperation("x");
        flyweight2.doOperation("y");
    }
}
```

```html
Object address: 1163157884
IntrinsicState: aa
ExtrinsicState: x
Object address: 1163157884
IntrinsicState: aa
ExtrinsicState: y
```

### JDK

Java 利用缓存来加速大量小对象的访问时间。

* java.lang.Integer#valueOf(int)
* java.lang.Boolean#valueOf(boolean)
* java.lang.Byte#valueOf(byte)
* java.lang.Character#valueOf(char)
