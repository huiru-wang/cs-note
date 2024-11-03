# Why MQ

1. <font color="#de7802">异步化</font>：将异步的资源消耗交给MQ中间件，而不是系统；
2. <font color="#de7802">功能解耦</font>：系统间非强依赖的功能模块，通过消息队列进行解耦，降低系统复杂度；
3. <font color="#de7802">流量削峰</font>：系统承载不了过多的流量，或者不需要过多的流量，通过消息队列进行缓冲，保证系统可用的情况下，处理业务；
5. <font color="#de7802">水平扩展业务</font>：数据重复使用：一份数据往往需要多处使用，分发消费的过程可以交给消息队列；

# 消息队列的模型

1. 生产者：同步、异步向消息队列发送消息；
2. 消息队列：提供对消息进行存储(内存、磁盘)、扩展(副本)、过滤、路由(topic)等功能
3. 消费者：消息通信通常都有两种方式：
	- push：实时性强，但是消费端不可控；(追求实时性的特殊场景可用，但不适用于大多数场景)
	- pull：消费端可控制消费速率、可重试、控制消费位置等；

# 消息的存储

存储介质速度: 内存顺序IO > 内存随机IO > 磁盘顺序IO > 磁盘随机IO
容量: 磁盘 > 内存

磁盘IO访问时间 = 磁头寻道时间(最耗时) + 盘片旋转时间 + 传输时间

顺序IO降低寻道时间，大幅提升磁盘IO性能

# MQ带来的新问题

## 1. 幂等问题

幂等问题：重复生产/重复消费

生产端幂等：
1. 使用唯一ID保证消息幂等；
2. 业务自己保证发送幂等，每次发送消息都检查消息是否已经发送/或使用事务保证；

消费端：
1. 结合DB的幂等性；使用覆盖代替计算；
2. 业务上进行判重等操作来保证；

## 2. 消息丢失问题

要保证消息可靠传输，要从消息链路每个地方保证：
1. 生产者发送消息到消息队列时丢失；
2. 消息队列未能持久化消息，宕机丢失；
3. 消息消费时，未能消费成功，MQ清除消息或者宕机丢失；

三个方面去考虑：
1. 保证生产端可靠投递（<font color="#de7802">同步投递</font>）
	- 采用同步方式发送消息，确保收到MQ的成功响应，保证投递成功；
2. 保证MQ端的消息副本同步、持久化；（<font color="#de7802">TP模式</font>）
	- MQ在收到消息后，保证消息同步到各个MQ副本上，再响应生产端；副本同步成功已经可以保证消息不丢失了；
	- 如果要完全保证，还需要持久化消息，但是会拉低性能；
3. 消费端保证消费完成，从MQ中Commit指定消息（<font color="#de7802">同步Commit</font>）
	- 当消费端，消费完成，应当响应MQ，去进行对应消息的消费Commit；
## 3. 消息积压问题

没办法，要消费，就只能提高消费端的消费能力；
1. 增加消费者线程、进程；
2. 优化业务消费逻辑；

## 4. 消费乱序问题

1. <font color="#de7802">单线程消费</font>：将所有消息都由同一个线程来消费，这样就可以保证消息的顺序性。但是这样会影响系统的吞吐量和并发性能。
2. <font color="#de7802">按分区消费</font>：将不同分区的消息分配给不同的消费者线程来处理，每个消费者只处理自己分区的消息。这样可以保证每个分区内的消息顺序消费；
   但是不同分区之间的消息仍然有可能出现乱序。
4. 结合业务特点，保证处理消息的顺序性；比如先入库，再顺序消费数据库消息；


# 常见MQ实现

1. kafka
2. Pulsar
3. RocketMQ（MetaQ）
4. RabbitMQ
5. Redis






