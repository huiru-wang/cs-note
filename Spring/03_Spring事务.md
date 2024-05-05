- [三大基础设施](#三大基础设施)
	- [1. PlatformTransactionManager](#1-platformtransactionmanager)
	- [2. TransactionDefinition](#2-transactiondefinition)
	- [3. TransactionStatus](#3-transactionstatus)
- [Spring七种事务传播](#spring七种事务传播)
- [长/大事务](#长大事务)
	- [事务大小](#事务大小)
	- [大事务处理方式](#大事务处理方式)
- [事务失效场景](#事务失效场景)
	- [声明式、编程式](#声明式编程式)
- [Spring五大隔离级别](#spring五大隔离级别)
- [Spring事务如何回滚](#spring事务如何回滚)


Spring事务的传播机制：解决业务层面方法之间互相调用下的事务处理问题；
- 多个方法共用一个事务，还是新建事务，还是不使用事务？；
- 事务嵌套时，是挂起父事务，还是终止执行抛出异常？

# 三大基础设施
## 1. PlatformTransactionManager

最顶层事务接口：约束了最基础的事务方法：
- `getTransaction`
- `commit`
- `rollback`

具体实现，由不同的数据库接口实现：
![](../images/transactionManager.png)


## 2. TransactionDefinition
TransactionDefinition定义Spring事务属性：

一般用于编程式事务，相当于配置声明式事务注解中的参数

- **事务的传播特性**
- **事务的隔离性**
- **事务的回滚规则**：并不是所有异常都回滚；
- **事务超时时间**
- **事务是否只读**：对于RR隔离级别，即使是读操作，也需要避免不可重复读问题，有可能存在多次读取数据不一致现象，因此即使是读操作，也需要加上事务，而使用只读事务，可以进一步提高事务性能；
  - 如果是单个查询，不需要加事务；
  - 存在多查询，并且存在关联，需要数据一致，需要加事务；

## 3. TransactionStatus

可以通过TransactionStatus查看事务状态信息；

编程式事务，进行回滚、提交时需要此对象；

# Spring七种事务传播

事务的传播行为：**不同的方法嵌套调用时，事务如何处理**

总体分为三类行为：
- 支持事务；
- 不支持事务；
- 嵌套事务；

**PROPAGATION_REQUIRED**：共用一个事务，如果没有事务，就开启一个新的；

**PROPAGATION_REQUIRES_NEW**：用于子事务

- 子事务新建一个事务，并把父事务挂起，当前事务单独执行，执行结束不受父事务回滚影响
- 子事务的异常也不会影响到父事务

**PROPAGATION_NESTED**：放在父事务上，向下嵌套
- 父事务回滚，子事务一起回滚
- 子事务回滚，父事务不受影响；但是子事务的异常，会影响父事务，父事务可能需要catch

PROPAGATION_SUPPORTS：放在子事务上
- 父事务存在，就用事务
- 不存在，就不用事务

PROPAGATION_NOT_SUPPORTED：放在子事务上
- 无论怎么样都不使用事务，如果存在父事务，挂起父事务
- 但是子方法抛出异常，会影响父事务

PROPAGATION_MANDATORY：MANDATORY(强制性的)放在父事务，向下嵌套
- 存在父事务，并且是MANDATORY的，如果没有子事务，就抛出异常

PROPAGATION_NEVER：用于子事务
- 不使用事务，如果存在父事务，就抛出异常

# 长/大事务

长/大事务：事务从开始到结束时间很长；
- 长时间占用数据库连接；
- 事务涉及的数据库资源范围大，数据被锁，阻塞其他线程；
- 如果回滚了，也会需要很长时间；

## 事务大小



## 大事务处理方式

1、首先确定事务内，真正需要用到事务的地方有哪些，尽量缩小事务范围；

2、竞争激烈的锁，尽量后置；

2、注解方式粒度为方法级别，要改动小，可以尝试编程事务，较灵活；



可能的原因：
- 事务内耗时任务：远程调用、耗时计算等；
- 并发量大，事务执行过程中需要竞争锁；

Spring中配置超时时间

Spring中仅在执行SQL时，判断是否超时，如果执行完SQL了，同一个方法内，后续部分超时，不会回滚

# 事务失效场景
失效的本质：**没有使用代理对象，或代理对象无法感知到指定异常，或数据库不支持事务；**

1、异常被捕获，没有抛出，代理对象无法感知
```java
@Transactional(rollbackFor = Exception.class)
public void insertWithTransaction(Order order) {
    try{
        // ...
        orderMapper.insert(order);
    }catch(Exception e){
        // ..
    }
}
```

2、this方法调用，且注解在this方法上，主要看能不能使用代理对象执行事务方法；this无法使用代理对象来执行；
```java
// @Transactional 加在这里事务不会失效！
public void failCondition1() {
    Order order = OrderUtils.getOrder();
    orderMapper.insert(order);
    this.insertOrderWithThisTransaction(order);

}
// 这里事务会失效，不可AOP，两条数据都会插入
@Transactional(rollbackFor = Exception.class)
public void insertOrderWithThisTransaction(Order order) {
    orderMapper.insert(order);
    throw new RuntimeException();
}
```
3、private、final、static修饰的方法

4、数据库不支持事务

## 声明式、编程式

声明式简洁易用，虽然看起来粒度是整个方法，但是只有第一个写操作，才会真正开启事务
因此不存在编程式事务粒度更细这一说；


# Spring五大隔离级别



# Spring事务如何回滚

Spring事务是由AOP实现的；

