
Reference: [https://github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

## Step1. Outline use cases, constraints, and assumptions

Gather requirements and scope the problem. Ask questions to clarify use cases and constraints
> 收集、确定需求或用例场景，并明确要解决的问题范围，可以提出一些问题，确定用例和约束

what does the system do?
> 这个系统需要完成什么功能

who is going to use it?
> 面向的用户是谁

how many users are there?
> 用户量是多少, 用户量在1天内分布均匀吗?

how much data do we expect to handle?
> 根据用户量, 功能场景, 估算每日的数据量 (可能是存储, 带宽等)

how many requests per second do we expect?
> 根据用户量, 使用场景, 估算QPS或者QPM

## Step2. Create a high level design

Outline a high level design with all important components
> 首先从从高纬度整体设计一下，包含主要的组件。暂时可以不讨论细节。

## Step3. Design core components

Dive into details for each core component.
> 开始对每一个核心组件进行详细的设计。比如：每个组件该如何使用，组件间是如何交互的，数据库表如何设计等等


## Step4. Scale the design

Identify and resolve bottlenecks within given constraints.
>在给定的业务场景下，识别出系统的瓶颈、问题，并尝试去解决它。

For example, does the design need to consider the following issues?

- Load Balancer: Ensure optimal performance with dynamic scaling.
- Caching: For lower response latency.
- Database Sharding: Ensure the performance in the face of increasing data volumes.

  

If the system needs to handle 10<sup>6</sup>  requests per second, and a single server can only handle 10<sup>5</sup> requests, then you can easily think that the system needs a load balancer.

>如果系统需要每秒处理100w个请求，而单机服务器只能处理10w个请求，那么你很容易想到该系统需要一个负载均衡器


Discuss potential solutions and trade-offs. Everything is a trade-off.

> 针对系统的不同瓶颈，讨论不同的可能采用的方案，每一种方案都有利有弊，要看具体的使用场景。

## Step5. Rough calculation

你需要粗略计算出系统的一些关键指标

在粗略计算之前

1. 应该对一些常见的组件的性能指标比较敏感：

如：MySQL的单机QPS、MySQL单表存储阈值、Redis的单机QPS、Redis内存

2. 应该对当前系统的使用场景指标有一些假设：

如：dau是多少？峰值流量是何时？平均流量是多少？系统提供的每个功能中用户使用比例是多少？例如微博用户中只有15%左右的用户会写微博，如此可以推断出每个功能点的流量；存储量是多少？

3. 有了上面的数据后，就可以判断当前的系统设计是否合理，是否可以支撑服务。有哪些需要改进的地方。
