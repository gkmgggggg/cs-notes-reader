---
noteId: "object-oriented-design-patterns-topic-0713b26e18"
title: "设计模式 · 命令"
categoryId: "object-oriented"
category: "面向对象"
route: "object-oriented/design-patterns/topic-0713b26e18"
sourcePath: "notes/设计模式 - 命令.md"
order: 144
groupId: "object-oriented-design-patterns"
parentId: "object-oriented-design-patterns"
pageType: "article"
archived: false
sourceUrl: "https://github.com/CyC2018/CS-Notes/blob/b70121d377cb6005eb65f12b098cd5decd905669/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20%E5%91%BD%E4%BB%A4.md"
sourceCommit: "b70121d377cb6005eb65f12b098cd5decd905669"
---

## 2. 命令（Command）

### Intent

将命令封装成对象中，具有以下作用：

* 使用命令来参数化其它对象
* 将命令放入队列中进行排队
* 将命令的操作记录到日志中
* 支持可撤销的操作

### Class Diagram

* Command：命令
* Receiver：命令接收者，也就是命令真正的执行者
* Invoker：通过它来调用命令
* Client：可以设置命令与命令的接收者

<div align="center"> <img src="/cs-notes/content-assets/fa26ec5fc08d-c44a0342-f405-4f17-b750-e27cf4aadde2.png"/> </div><br>

### Implementation

设计一个遥控器，可以控制电灯开关。

<div align="center"> <img src="/cs-notes/content-assets/c4b7cc0a8667-e6bded8e-41a0-489a-88a6-638e88ab7666.jpg"/> </div><br>

```java
public interface Command {
    void execute();
}
```

```java
public class LightOnCommand implements Command {
    Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.on();
    }
}
```

```java
public class LightOffCommand implements Command {
    Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.off();
    }
}
```

```java
public class Light {

    public void on() {
        System.out.println("Light is on!");
    }

    public void off() {
        System.out.println("Light is off!");
    }
}
```

```java
/**
 * 遥控器
 */
public class Invoker {
    private Command[] onCommands;
    private Command[] offCommands;
    private final int slotNum = 7;

    public Invoker() {
        this.onCommands = new Command[slotNum];
        this.offCommands = new Command[slotNum];
    }

    public void setOnCommand(Command command, int slot) {
        onCommands[slot] = command;
    }

    public void setOffCommand(Command command, int slot) {
        offCommands[slot] = command;
    }

    public void onButtonWasPushed(int slot) {
        onCommands[slot].execute();
    }

    public void offButtonWasPushed(int slot) {
        offCommands[slot].execute();
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        Invoker invoker = new Invoker();
        Light light = new Light();
        Command lightOnCommand = new LightOnCommand(light);
        Command lightOffCommand = new LightOffCommand(light);
        invoker.setOnCommand(lightOnCommand, 0);
        invoker.setOffCommand(lightOffCommand, 0);
        invoker.onButtonWasPushed(0);
        invoker.offButtonWasPushed(0);
    }
}
```

### JDK

* [java.lang.Runnable](http://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html)
* [Netflix Hystrix](https://github.com/Netflix/Hystrix/wiki)
* [javax.swing.Action](http://docs.oracle.com/javase/8/docs/api/javax/swing/Action.html)
