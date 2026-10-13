---
noteId: "object-oriented-design-patterns-topic-c724773d79"
title: "设计模式 · 外观"
categoryId: "object-oriented"
category: "面向对象"
route: "object-oriented/design-patterns/topic-c724773d79"
sourcePath: "notes/设计模式 - 外观.md"
order: 159
groupId: "object-oriented-design-patterns"
parentId: "object-oriented-design-patterns"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20%E5%A4%96%E8%A7%82.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 外观（Facade）

### Intent

提供了一个统一的接口，用来访问子系统中的一群接口，从而让子系统更容易使用。

### Class Diagram

<div align="center"> <img src="/cs-notes/content-assets/1d4560a3a7df-f9978fa6-9f49-4a0f-8540-02d269ac448f.png"/> </div><br>

### Implementation

观看电影需要操作很多电器，使用外观模式实现一键看电影功能。

```java
public class SubSystem {
    public void turnOnTV() {
        System.out.println("turnOnTV()");
    }

    public void setCD(String cd) {
        System.out.println("setCD( " + cd + " )");
    }

    public void startWatching(){
        System.out.println("startWatching()");
    }
}
```

```java
public class Facade {
    private SubSystem subSystem = new SubSystem();

    public void watchMovie() {
        subSystem.turnOnTV();
        subSystem.setCD("a movie");
        subSystem.startWatching();
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.watchMovie();
    }
}
```

### 设计原则

最少知识原则：只和你的密友谈话。也就是说客户对象所需要交互的对象应当尽可能少。
