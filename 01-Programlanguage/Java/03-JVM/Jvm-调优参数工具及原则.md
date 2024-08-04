
# 常用Jvm参数
```shell


```

# Heap 相关参数

## stack

1、栈内存大小：

- `-Xss`：默认 1MB,决定了栈的调用深度；

## Heap

![](../images/heap.png?msec=1676139896889)

> JVM 调优主要调整 Heap 区域的参数配置
> 大部分的默认值都是经验值，需要根据具体场景，进行配置

默认：新生代：老年代 = 1：2

默认：Eden：From：To = 8：1：1

| 参数                               | 作用                                         |
| ---------------------------------- | -------------------------------------------- |
| -Xms600m                           | 堆的起始内存                                 |
| -Xmx600m                           | 堆的最大内存                                 |
| -Xmn200m                           | 新生代大小                                   |
| -XX:SurvivorRation=8               | Eden占新生代的8/10，剩余2/10,From/To 平分    |
| -XX:NewRation=2                    | 老年代/新生代比例大小                        |
| -XX:+UseAdaptiveSizePolicy         | 动态调整 JVM 各区大小以及 gc 年龄阈值        |
| -XX:MaxTenuringThreshold=15        | 晋升阈值：默认15，超出此阈值，对象移入老年代 |
| -XX:TargetSurvivorRatio=90         | Survivor 区占用达到 90%，再将对象移入老年代  |
| -XX:PretenureSizeThreshold=3145728 | 如果对象大小超过这个值，将直接分配在老年代   |
| -XX:+PrintGCDetails                | GC详情                                       |
| -XX:+ScavengeBeforeFullGC          | FullGC前执行一次MinorGC                      |

1、Heap 大小：
- `-Xms600m`：堆的起始内存
- `-Xmx600m`：堆的最大内存

  (超出触发 MajorGC，无法回收则抛：OutOfMemoryError)

2、自适应策略(JDK1.7)

- `-XX:+UseAdaptiveSizePolicy`：动态调整 JVM 各区大小以及 gc 年龄阈值；
- 默认初始：老/新 = 2，Eden/Survivor = 8：2，默认年龄阈值 15；
- 每次 GC 后，动态计算大小 Eden/Survivor 的内存分配；
- 默认开启，且推荐不要关闭，除非一定要使用特定的 JVM 分区大小；

以下 2 个参数开启前提：关闭自适应策略

3、新生代老年代比例：

- `-XX:NewRation=2`：老年代/新生代比例大小

4、新生代内分区比例：

- `-XX:SurvivorRation=8`：Eden占新生代的比例，剩余 From/To 平分
- `-XX:InitialSurvivorRatio=8 -XX:+UseAdaptiveSizePolocy`： 初始化比例为8，并动态调整新生代比例
  - 一些垃圾收集器，直接默认动态调整；

5、控制对象进入老年代的参数：

- `-XX:MaxTenuringThreshold=15`：默认 15，超出此阈值，对象移入老年代；
- `-XX:TargetSurvivorRatio=90`：Survivor 区占用达到 90%，再将对象移入老年代

  通常是占用达到 50%，按照年龄排序后，超出 50%的大年龄对象，会在 MinorGC 时移入老年代；

- `-XX:PretenureSizeThreshold=3145728`：如果对象大小超过这个值，将直接分配在老年代

## MetaSpace

1、元空间大小：

- -XX:MetaspaceSize：设置元空间内存大小；默认 20.75MB
- -XX:MaxMetaspaceSize：默认-1，无限大；

## Collector


## G1


## 其他
1、输出 JVM 默认参数配置：

- `java -XX:+PrintCommandLineFlags -version`


# JVM 调优工具

## 常用命令
### jps
查看Java进程

- `jps`：获取 Java 进程的 PID

### jmap

仅能查询某一时刻的内存占用情况

- `jmap -heap [pid]`：获取详细的对象内存占用情况
```
using thread-local object allocation.
Parallel GC with 10 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 4269801472 (4072.0MB)
   NewSize                  = 89128960 (85.0MB)
   MaxNewSize               = 1422917632 (1357.0MB)
   OldSize                  = 179306496 (171.0MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 67108864 (64.0MB)
   used     = 34945608 (33.32672882080078MB)
   free     = 32163256 (30.67327117919922MB)
   52.07301378250122% used
From Space:
   capacity = 11010048 (10.5MB)
   used     = 0 (0.0MB)
   free     = 11010048 (10.5MB)
   0.0% used
To Space:
   capacity = 11010048 (10.5MB)
   used     = 0 (0.0MB)
   free     = 11010048 (10.5MB)
   0.0% used
PS Old Generation
   capacity = 179306496 (171.0MB)
   used     = 0 (0.0MB)
   free     = 179306496 (171.0MB)
   0.0% used
```

- `jmap -histo [pid] > jvm.txt`：获取详细的对象内存占用情况

```shell
 num  #instances   #bytes  class name
----------------------------------------------
351:      10        160   com.snippet.xxx.Task
370:       3        144   org.j.p.e.s.h.NodeTestTask                           
474:       3         72   org.j.p.e.s.h.NodeTestTask$DefaultDynamicTestExecutor
577:       3         48   org.j.p.e.s.h.NodeTestTask$$Lambda$212/825658265     
```
可以观察所有对象的实例数量、内存占用、类名

### jconsole
一个应用程序，可视化动态展示：堆内存、活动线程数、类、CPU占用等信息

![](../images/jconsole.png)

## 开发工具

VisualVM：可视化内存状态

arthas：开源的 Java 诊断工具

