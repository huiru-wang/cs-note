# Dubbo
阿里巴巴开源的高性能 RPC 分布式服务框架，底层使用Netty通信框架；

# 多协议支持

1、对多种RPC协议，同时支持HTTP协议；

2、对同一个发布的服务，可用同时支持多个协议；

dubbo：单一长连接和 NIO 异步通讯，传输协议：TCP；序列化：Hessian 

grpc：http2.0 + protobuff

rmi：

thrift

# 可用的注册中心

zookeeper、nacos

# Dubbo核心组件

Provider：

Consumer：

Registry：

QOS：Quality of Service；用于动态的对服务进行查询和控制
- 对服务进行动态的上下线
- 动态的调整和控制某些端口的权重，优先的保障运行在这些端口上的服务质量；

Monitor：

Container：

# LoadBalance负载均衡策略

```java
public interface LoadbalanceRules {

    String EMPTY = "";

    // 随机
    String RANDOM = "random";

    // 轮询
    String ROUND_ROBIN = "roundrobin";

    /**
     * 最小活跃数(最小并发)，活跃数相同随机选取
     * 每个provider服务会存在一个计数器；请求接收计数器+1，请求结束计数器-1；
     * 计数器越大说明负载越重，活跃数越高；
     **/
    String LEAST_ACTIVE = "leastactive";

    /**
     * 最小响应，在最小并发基础上 选择最小响应的provider
     *  Filter the number of invokers with the shortest response time of success calls and count the weights and quantities of these invokers.
     **/
    String SHORTEST_RESPONSE = "shortestresponse";

    /**
     * 一致性hash 同样的请求参数路由到同一个provider，默认根据第一个参数做一致性hash
     *  Consistent Hash, requests with the same parameters are always sent to the same provider.
     **/
    String CONSISTENT_HASH = "consistenthash";

    /**
     * 自适应
     *  adaptive load balance.
     **/
    String ADAPTIVE = "adaptive";
}
```