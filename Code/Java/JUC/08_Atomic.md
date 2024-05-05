
# 原子类

`java.util.concurrent.atomic`下提供多种数据类型的原子类：
- AtomicInteger：原子更新int
- AtomicLong：原子更新long
- AtomicBoolean：原子更新boolean

原子类：顾名思义，保证了一些操作的原子性；

实现：volatile修饰值，CAS操作代替锁；(一条CPU的原子指令)

```java
private volatile int value;

public final int getAndAddInt(Object o, long offset, int delta) { 
    int v;
    do {
        
        // ...compareAndSwapInt成功，则完成+1

    } while (!compareAndSwapInt(o, offset, v, v + delta));
    return v;
}
```

# ABA问题

CAS机制只保证比较并替换，并不能识别比较的值，是不是中间被修改过，又改回来了；

要解决这个问题，必须对每个值，增加版本号标识；

JUC提供了带版本号的引用原子类型；

```java
//在构造时需要指定初始值和对应的版本号
AtomicStampedReference<String> reference = new AtomicStampedReference<>(a, 1);  
reference.attemptStamp(a, 2);
```

# 性能问题

并发比较大时，使用Atomic进行计数，存在性能问题；

频繁失效CPU内存，加载主内存更新，不断重试，耗费CPU；
