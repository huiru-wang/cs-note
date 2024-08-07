- [HashMap](#hashmap)
  - [HashMap基本结构](#hashmap基本结构)
  - [哈希冲突](#哈希冲突)
  - [查找一个key的过程](#查找一个key的过程)
  - [数组长度为$2^n$](#数组长度为2n)
  - [负载因子作用](#负载因子作用)
  - [HashMap存在的问题](#hashmap存在的问题)
    - [并发修改可能触发异常](#并发修改可能触发异常)
    - [并发put死循环](#并发put死循环)
- [ConcurrentHashMap](#concurrenthashmap)

# Deque

[ ArrayDeque / LinkedList 解析](https://leetcode.cn/circle/article/bXc4tx/)

|         | Throws exception | Special value | Throws exception | Special value |
| ------- | ---------------- | ------------- | ---------------- | ------------- |
| Insert  | addFirst(e)      | offerFirst(e) | addLast(e)       | offerLast(e)  |
| Remove  | removeFirst()    | pollFirst()   | removeLast()     | pollLast()    |
| Examine | getFirst()       | peekFirst()   | getLast()        | peekLast()    |

对比ArrayDeque 和 LinkedList

| 集合类型   | 数据结构 | 初始化及扩容          | 插入/删除时间复杂度 | 查询时间复杂度 | 是否是线程安全 |
| ---------- | -------- | --------------------- | ------------------- | -------------- | -------------- |
| ArrqyDeque | 循环数组 | 初始化：16 扩容：2 倍 | 0(n)                | (1)            | 否             |
| LinkedList | 双向链表 | 无                    | 0(1)                | 0(n)           | 否             |

## ArrayDeque


## LinkedList


# HashMap
## HashMap基本结构

<div align="center">
<img src="../../../images/hashmap.jpeg" alt="concurrency" align="middle" style="zoom: 70%;" />
</div>
<br/>

**数组 + 链表/红黑树**：当链表长度大于7，触发转换成红黑树；因为节点数大于7时，使用红黑树才有性价比；
- 使用链表：在节点数量较低，使用链表和红黑树的效率相当，代价更低；
- 使用红黑树：在节点数量较多时，使用红黑树，可以大幅提高查询效率；红黑树：自平衡 + 二分查找；

**Capacity**：哈希桶的个数；即数组的长度；构造时，设置为`2^n`个；每次扩容`* 2`
- 保持$2^n$的桶的个数，目的：可以使用**位与运算**计算key所在桶的索引；效率高于取模运算；

**Size**：HashMap中所有元素的个数；

**LoadFactor**：默认0.75f

**Threshold**：当超过阈值，触发扩容；`Threshold = Capability * LoadFactor`

**哈希算法**：计算key的哈希值；
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

## 哈希冲突
通常有以下几种解决方法：

1、开放定址法：当出现哈希冲突，以特定的方式不断尝试找到空闲区域；
- 线性探测：冲突后，顺序向后寻找空闲区域；
- 平方探测；
  
2、再哈希法：出现冲突，使用其他的哈希函数再次哈希，依次类推；

3、链地址法(拉链法)：当出现哈希冲突，在同一个哈希桶下，以链表或红黑树的结构存放冲突的key；
- 链表；
- 红黑树；

**HashMpa使用链地址法：**

![](../../../images/hashmap.png)

## 查找一个key的过程

1、计算key的哈希函数：`hash(Object key)`；

2、计算key所在数组位置：`(length-1) & hash值`

3、桶为空则不存在key；

4、不为空则遍历链表/红黑树，使用对象的`equals`方法，逐步判断是否相等，直到找到 或 遍历结束；

- 复杂度：最优O(1)，最坏O(n)；


## 数组长度为$2^n$

为了加速HashMap的计算key所在桶的索引：**位与运算 效率高于 取模运算**

原本：计算元素放在哪个桶，是用Hash值对length取模得到的。但是效率太低。

现在：因为length总是2的n次方，那么 ` hash值 & (length-1)` 就可以直接得到桶的索引。提高了计算效率。

> 假设length是8（2^3）
> ` hash / 8` = ` hash / 2^3 ` = ` hash >> 3 `，同时右移挤掉的低三位，就是余数；
> ` hash & (length-1) `相当于取hash值的(length-1)个低位bit；相当于直接取余数；

## 负载因子作用

默认的负载因子=0.75，是一个经验值；**负载因子决定了扩容的阈值**；

**负载因子较低**：则阈值会远小于容量，很容易触发扩容，会使得HashMap处于比较空的状态，哈希冲突的概率会小，占用更多的空间；

**负载因子较低**：阈值会比较接近容量，不容易触发扩容；会使得HashMap处于很满的状态，容易哈希冲突，占用内存较少；

## HashMap存在的问题

### 并发修改可能触发异常

```java
// 每次操作HashMap，modCount都会自增
transient int modCount;

// 当发现操作HashMap后，操作次数不符合预期，则说明存在并发问题
int mc = modCount;
for (Node<K,V> e : tab) {
    for (; e != null; e = e.next)
        action.accept(e.key);
}
if (modCount != mc)
    throw new ConcurrentModificationException();
```

### 并发put死循环



# ConcurrentHashMap

结合Synchronize和CAS一起来保证安全，锁粒度较低，效率高；

1、Put操作：先通过`hash算法`定位桶，使用`Synchronize`加锁，找到要插入位置后，使用`CAS`进行节点的插入；**锁粒度为单个桶；而非Hashtable的整个哈希表**；

2、节点的value和next指针，都由`volatile`修饰，保证并发的可见性和有序性；

3、其余操作与HashMap类似；