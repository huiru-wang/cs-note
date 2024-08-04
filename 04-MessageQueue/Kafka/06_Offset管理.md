- [消费方式](#消费方式)
- [存储和管理](#存储和管理)
- [两种offset](#两种offset)
- [提交方式](#提交方式)
  - [自动提交](#自动提交)
  - [手动提交](#手动提交)


# 消费方式

kafka按照消费者组为单位进行消费；

消费者组启动时，通过配置，选择开始消费位置：
```conf
auto.offset.reset = earliest / latest / none
```
- none：从保存的offset继续消费；如果没有offset(新组)，抛出异常；
- latest：从保存的offset继续消费；如果没有offset(新组)，则只消费上线后的新数据；
- earliest：从保存的offset继续消费；无提交的offset时(新组)，从头开始消费；

# 存储和管理

1、offset保存在 Kafka 一个**内置的topic**中：`__consumer_offsets`；

2、offset由`Group Coordinator`进行管理；

使用key-value方式存储：
- key：`group.id + topic + partition.id`
- value: 消费的offset位置；

# 两种offset

- Current Offset：由客户端管理；表示Consumer希望收到的下一条消息的序号，在poll方法中使用；

- Committed Offset：保存在Broker上，它表示Consumer已经确认消费过的消息的序号；


# 提交方式

## 自动提交
```conf
# 是否自动提交
enable.auto.commit = true
# 自动提交频率
auto.commit.interval.ms = 1000
```

## 手动提交

客户端提供：
- 同步提交：commitSync，可以进行失败重试；
- 异步提交：commitAsync，失败需要自行额外保证；