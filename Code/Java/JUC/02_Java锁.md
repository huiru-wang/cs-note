
# 可重入锁
> 当一个线程获取锁后，再次获取同一把锁，不会阻塞，锁状态累加，解锁时，释放相同的次数；

通常情况下，会存在多种方法对同一个共享资源进行操作，同一个线程也可能进入多个操作方法中，就存在锁需要被获取多次的情况；

synchronized和Lock都是通过计数器实现的可重入锁；

## 为什么需要重入锁，又为什么需要计数器？

1、避免死锁，同一个线程多次进入临界区，重入锁可以防止死锁；但是每次获取锁，只要判断是否为当前线程即可，也同样不会死锁，可以直接重入，可以不需要计数器；

2、解锁时就需要计数器了，根据记录次数进行解锁，如果不记录重入次数，可能发生锁提前释放；

# Lock接口
Synchronized是JVM层面的锁，开发人员的可控性较差，Lock接口规范了JDK层面的锁，提供了更加丰富的锁操作，并且可以实现公平锁、非公平锁、读写锁(ReadWriteLock)

```java
public interface Lock {
    // 获得锁
    void lock();
    // 获得锁
    void unlock();
    // lock非阻塞版本，成功返回true
    boolean tryLock();
    // 添加尝试时间，时间到返回false
    boolean tryLock(long time, TimeUnit unit)
    // 返回一个监视器对象，供线程间同步使用
    Condition newCondition();
}
```

## ReenTrantLock
Lock的实现类，JDK层面的锁；

三个主要的锁抽线内部类：
- Sync（继承AQS）：锁抽象；
- NonfairSync（继承Sync）：非公平锁抽象；
- FairSync（继承Sync）：公平锁抽象；

可实现的锁类型：
1、非公平锁：
```java
// 默认：非公平锁，比较高效
public ReentrantLock() {
    sync = new NonfairSync();
}
```
2、公平锁：
```java
// 公平锁
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```
3、可中断锁：等待锁的过程中可以响应中断；
```java
try{
  lock.lockInterruptibly()
}catch(InterruptedException e){
  // ...
}
```
4、tryLock设置等待时间，超时后返回false，执行其他操作；
```java
tryLock()
tryLock(long time, TimeUnit unit)
```
## ReentrantReadWriteLock
增加ReadLock读写、WriteLock写锁，是在ReentrantLock基础上实现的；

读写状态通过一个32位int值来维护：

`0000 0000 0000 0100 | 0000 0000 0000 0001`
- 高16位记录读状态；
- 低16位记录写状态；

通过位移操作读写改变：
- 获取读状态：将`c`右移16位；
- 获取写状态：和`0000 0000 0000 0000 1111 1111 1111 1111`相与获得

# Synchronized
synchronized关键字加锁是**JVM级别**的**非公平锁**，**自动加锁自动释放**；

1、对象锁：每个对象实例都有一把自己的锁，不同对象间锁不同；

2、类锁：用于static方法，则所有对象共用一把锁；

3、正常执行完毕、抛出异常，都会释放锁；

## Synchronized执行过程

主要借助于：对象头 + Monitor监视器

对象头的Mark Word记录的信息有：
- hash: 对象的哈希码
- age: 对象的分代年龄
- biased_lock: 偏向锁标识位
- lock: 锁状态标识位
- JavaThread: 持有偏向锁的线程ID
- epoch: 偏向时间戳

通过组合**偏向锁标志位** + **锁标志位** 可以表达**锁的不同状态**：

| 锁状态   | 偏向锁标志位 | 锁标志位 |
| -------- | ------------ | -------- |
| 无锁     | 0            | 01       |
| 偏向锁   | 1            | 01       |
| 轻量级锁 | 无           | 00       |
| 重量级锁 | 无           | 10       |


详见：[Jvm-对象内存模型](../jvm/Jvm-%E5%AF%B9%E8%B1%A1%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B.md)

1、方法级别的Synchronized

```java
public synchronized void test(){
  // ...
}
```
在常量池中生成一个`ACC_SYNCHRONIZED`标识符

当线程尝试调用此方法，会在此标志位设置值，如果设置成功，则此线程获取`monitor`监视器

2、Synchronized同步代码块
```java
public void test(){
    // ...
    synchronized(this){
      // ...
    }
}
```
在同步代码块的入口，执行指令：`monitorenter`监视器入口，线程尝试获取锁对象
- 获取成功，计数器加+1；
- 获取不成功，根据当前锁级别，自旋或者阻塞；
  
执行同步代码，结束时，会调用指令`monitorexit`释放锁；
- 计数器减一；当计数器为0，才会释放锁；即可重入；

## Synchronized锁优化
偏向锁 —> 轻量级锁 —> 重量级锁
