# JIT

JIT：just in time；动态将字节码编译成机器码，加快执行效率；

## 为什么不直接全部编译

真正程序运行，并不会执行全部的代码，大部分情况是20%的代码执行80%的请求；有些代码仅仅执行一次，就没必要编译；全部编译的代价大，内存占用高；

**JIT通过热点检测，仅编译热点代码，可以权衡执行速度、内存占用、启动速度等方面**；

## 利用JIT预热

JIT的热点检测需要时间来识别出热点代码，再进行JIT编译优化；

可以利用这一特点，针对已知的热点请求，提前进行预热；让JIT感知热点代码，对其进行编译优化；

JIT预热只是底层的一个点，真正系统预热，涉及连接池初始化、线程启动等等；Sentinal的预热就是利用这些，当系统处于冷状态一段时间，大流量突然到来，应当缓慢放行；

## 逃逸分析

目的：通过算法，减少Java程序中内存分配到堆上；

判断是否逃逸：

- 当一个对象在方法内定义，且只在方法内部使用，此时对象没有逃逸；

- 当一个对象在方法内定义，又被外部方法引用，则认为发生逃逸，

JIT通过逃逸分析，优化代码：

1、当对象没有逃逸：JIT编译器就可能将其分配在栈上，而不是堆上；线程结束，栈内存回收，则回收此类对象；(栈内存速度更快，降低堆内存压力)

2、同步省略：当对象没有逃逸，只会被当前线程访问，那么在并发场景下，就会取消对此对象的同步，也叫锁消除；

举例：

```java
// StringBuffer对象逃逸，分配到堆区
public static StringBuffer getStringBuffer(String s1, String s2) {
   StringBuffer sb = new StringBuffer();
   sb.append(s1);
   sb.append(s2);
   return sb;
}
// 不会发生逃逸，直接使用String的字面量，不分配内存到堆区；
public static String getString(String s1, String s2) {
   StringBuffer sb = new StringBuffer();
   sb.append(s1);
   sb.append(s2);
   return sb.toString();
}
```