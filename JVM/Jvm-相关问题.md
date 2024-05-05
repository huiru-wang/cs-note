
# JVM相关问题

## 堆相关

1、JVM的内存结构划分

按照线程是否共享进行分别描述；
分别描述每个区域的作用、特点；

2、堆为什么分代？

根因：对象的生命周期长短差异，一起进行GC不合理；

3、年轻代为什么需要两个Survivor

出于性能考虑；作为一个缓冲区，筛选出短声明周期对象，尽可能保证只有长生命的对象进入老年代

4、什么情况会堆内存溢出

5、什么情况下对象会进入老年代

- `-XX:MaxTenuringThreshold`：超出配置的GC年龄阈值；
- `-XX:TargetSurvivorRatio=50`：超出Survivor区内存大小
- `-XX:PretenureSizeThreshold=3145728`：设置了大对象直接进入老年代

## GC相关

1、MinorGC何时触发

- Eden满
- FullGC触发自动触发MinorGC

2、FullGC何时触发

- 老年代空间不足；
- 元空间不足；(一般由于动态加载类)
- 堆空间不固定，如果堆空间发生收缩、扩展，触发FullGC；
- 空间担保机制失败
- System.gc()显示调用

3、介绍常用的垃圾收集算法

4、介绍常用的垃圾收集器

5、CMS、G1工作机制

重点CMS、G1

## 虚拟机栈相关

1、栈溢出场景StackOverFlow

2、栈的内存越大越好吗？

3、垃圾回收是否涉及虚拟机栈

4、方法中的局部变量是否线程安全？

## 元空间

1、介绍下元空间

JDK8之前叫永久代，JDK8之后叫做元空间，两者都是方法区的实现；

元空间不占用JVM堆区内存，用于存放被加载的类信息、常量、静态变量；

元空间是FullGC回收的区域；通常回收不再使用的类的元数据，即如果对应的类加载器已死，其管辖的类的元数据就会被回收；

## 实操相关

1、如何配置JVM参数？

- 首先要确定线上机器的配置：CPU核数、内存大小；

- 根据CPU核数，配置合适的线程池；根据-Xss计算出线程可能占用的内存大小；
  
  比如300线程，默认栈内存1Mb，则需要300Mb

- 根据机器内存大小，配置堆区大小，一般配置机器内存的一半；
  
  `-Xms=4096`、`-Xmx=4096`一般设置一样大；

- 元空间一般512Mb，够用了；
  
  `-XX:MetaspaceSize=512M -XX:MaxMetaspaceSize=512M`

- 根据机器配置、业务场景，选择合适的垃圾收集器；
  
  内存小于8G，使用CMS：`-XX:+UseConcMarkSweepGC -XX:+UseParNewGC`
  
  大于8G可以考虑G1：`-XX:+UseG1GC`

## 对象相关

1、对象的存储结构/布局

2、JVM如何判断是否已死

可达性算法

## 类加载相关

1、类在什么时候触发加载？

HotSpot虚拟机是按需加载，用到此类的时候，才会加载；

2、类的加载过程

3、简述类加载器的作用，有哪些类加载器

4、类加载器间的关系是继承吗？

5、简述双亲委派模型，为什么需要双亲委派模型？

6、`Class.forName()`和`getClassLoader().loadClass()`区别

- `Class.forName()`：触发初始化

- `getClassLoader().loadClass()`：不会触发类的初始化；
  
  ```java
  public class ClassLoaderTest {
    public static void main(String[] args) throws ClassNotFoundException {
        //Class<?> class1 = Class.forName("org.snippet.classLoader.ClassLoaderTest$Father");
        Class<?> class2 = Father.class.getClassLoader().loadClass("org.snippet.classLoader.ClassLoaderTest$Father");
    }
  
    static class Father{
        public static int num = 1;
        public String name = "Father";
  
        static {
            System.out.println("Father Static Field: " + num);
            System.out.println("Father static init block");
        }
  
        {
            System.out.println("Father field: " + name);
            System.out.println("Father init block");
        }
  
        public Father(){
            System.out.println("Father constructor");
        }
    }
  }
  ```
  
  7、继承关系中父子类的初始化顺序

父静态变量/静态代码块 -> 子静态变量/静态代码块 -> 父成员变量/初始化块/构造器 -> 子成员变量/初始化块/构造器

```java
public class ClassLoaderTest {
    public static void main(String[] args) {
        Son son = new Son();
    }

    static class Father{
        public static int num = 1;
        public String name = "Father";

        static {
            System.out.println("Father Static Field: " + num);
            System.out.println("Father static init block");
        }

        {
            System.out.println("Father field: " + name);
            System.out.println("Father init block");
        }

        public Father(){
            System.out.println("Father constructor");
        }
    }

    static class Son extends Father {
        public static int num = 1;
        public String name = "Son";

        static {
            System.out.println("Son Static Field: " + num);
            System.out.println("Son static init block");
        }

        {
            System.out.println("Son field: " + name);
            System.out.println("Son init block");
        }

        public Son(){
            System.out.println("Son constructor");
        }
    }
}

------------------------------------------------
Father Static Field: 1
Father static init block

Son Static Field: 1
Son static init block

Father field: Father
Father init block
Father constructor

Son field: Son
Son init block
Son constructor
```

8、Tomcat为什么破坏双亲委派模型
