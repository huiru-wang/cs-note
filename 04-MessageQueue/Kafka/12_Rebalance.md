- [消费分配策略](#消费分配策略)
- [Rebalance](#rebalance)
  - [触发Rebalance的条件](#触发rebalance的条件)
  - [相关概念](#相关概念)
  - [Rebalance过程](#rebalance过程)

# 消费分配策略
- RangeAssignor：partitions/consumers 按照范围分配；
  - 按照字母顺序，依次分配；
  - 如果不是正好平均，就会数据倾斜；
  - 触发再平衡，则重新计算；
- RoundRobin：依次轮流分配；
  - 触发再平衡，则重新计算；
- Cooperative Sticy：粘性分配；
  - 尽量均匀的分配；
  - 消费者变动时，尽量保留现有的分配方式减少重新分配的Partition数量；
  
由参数：`partition.assignment.strategy`决定，value配置对应的消费分配策略实现：
```
org.apache.kafka.clients.consumer.RangeAssignor
org.apache.kafka.clients.consumer.RoundRobinAssignor
org.apache.kafka.clients.consumer.StickyAssignor
org.apache.kafka.clients.consumer.CooperativeStickyAssignor
```

# Rebalance

Rebalance会触发STW；

## 触发Rebalance的条件

1、消费者组内成员发生变化；
- 新的消费者加入；
- 消费者下线；
- 消费者心跳超时；

2、Topic的分区数发生变化；

## 相关概念
**GroupCoordinator**：每个Broker都有一个GroupCoordinator，负责消费者组内消费者的分区分配工作；
- 负责处理`JoinGroupRequest`和`SyncGroupRequest`；
- 记录ConsumerGroup的相关信息：订阅的Topic、消费者已经提交的offset；
- 通过心跳检查消费者的状态

**ConsumerGroup**：由`group.id`标识的订阅同一个Topic的一组消费者；

## Rebalance过程
每个Kafka的broker都有一个`GroupCoordinator组协调者`，管理多个消费者组的offset、发起rebalance；

1、不同情况下，触发Rebalance：
- 当消费者下线：`GroupCoordinator组协调者`感知下线，提出消费者组，发起Rebalance；
- 当消费者上线：会先向Kafka的`GroupCoordinator组协调者`发送`SyncGroupRequest`，GroupCoordinator发起Rebalance；
- 当分区数发生变化：手动对分区进行扩容、缩容等操作触发；

2、`GroupCoordinator`向组内已有分区的消费者发送需要rebalance的请求，请求各个消费者正在消费的分区详情、以及分区策略；

3、`GroupCoordinator`获取各个消费者的分区后，根据分区消费策略，进行rebalance：
- Range轮询策略：全部分区一起重新计算，按照分区序号重新依次分配分区；**触发STW**；
- RoundRobin轮询策略：重新计算，**触发STW**；
- Sticky粘性分区策略：尽可能保留消费单个分区的消费者的分区，让多分区消费的消费者让出额外的分区，给新加入的消费者；rebalance过程中，仅有被让出的分区，暂停消费；

4、分配完成，继续消费；