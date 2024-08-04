- [Spring家族](#spring家族)
  - [SpringBoot](#springboot)
- [主流解决方案](#主流解决方案)
- [通信组件：Dubbo](#通信组件dubbo)
  - [特点](#特点)
- [注册中心：Nacos](#注册中心nacos)

# Spring家族
**Spring**：是一个轻量级的Web框架；提供了Web开发所需要的各种模块：SpringMVC、SpringJDBC、Transaction事务管理、AOP等；本质是一个IOC容器。

**SpringBoot**：在Spring框架基础上，简化Spring的配置和部署相关功能；

1、消除了繁琐的XML配置、可以完全不配置XML；通过引用各种starter简化配置，并提供默认配置及自动装配；
- starter：**基于约定大于配置思想**，使用spi机制及自动装配原理，可以将一些通用的功能能够封装成一个独立组件并很方便的集成到不同的项目里面，简化开发，提升代码复用能力
  
2、提供嵌入式的web容器；高效部署；使用java命令直接运行jar包启动；

**SpringCloud**：微服务解决方案的一种，包含多种组件；在SpringBoot基础上整合配置管理、注册中心、服务发现、服务间调用、服务降级与熔断等组件；

**Spring Cloud Alibaba**：是阿里和Spring cloud的合作项目；将阿里的一些微服务组件整合在一起了；

**Dubbo**：微服务框架，突出一个RPC优势；兼容多种协议：grpc；


## SpringBoot

springboot starter 如何被加载进IOC？

通过类似于SPI的机制，使用META-INF/spring.factories文件，此文件会声明需要加载进IOC中的类的全类名；

springboot启动时，通过：@EnableAutoConfiguration这个注解，他会先加载一个AutoConfigurationImportSelector类，这个类中会执行：

SpringFactoriesLoader获取META-INF/spring.factories文件内声明的类，从而将starter的核心配置加载到IOC容器里；

# 主流解决方案

Spring Cloud Alibaba + Dubbo(RPC、客户端负载均衡、重试机制) + Nacos(注册中心) + Sentinel(限流组件) + RocketMQ(消息总线)

# 通信组件：Dubbo
阿里巴巴开源的高性能 RPC 分布式服务框架，底层使用Netty通信框架；

## 特点
1、多协议支持
- 多种RPC协议，同时支持HTTP协议；
- 对同一个发布的服务，可用同时支持多个协议；

2、负载均衡策略
- RANDOM
- ROUND_ROBIN
- LEAST_ACTIVE：最小活跃数(最小并发)，活跃数相同随机选取；
  - 每个provider服务会存在一个计数器；请求接收计数器+1，请求结束计数器-1；
  - 计数器越大说明负载越重，活跃数越高；
- SHORTEST_RESPONSE：最小响应，在最小并发基础上 选择最小响应的provider；
- CONSISTENT_HASH：一致性hash 同样的请求参数路由到同一个provider，默认根据第一个参数做一致性hash
- ADAPTIVE：


# 注册中心：Nacos
基于Raft协议的统一配置管理、提供服务注册、服务发现的中间件；

- 作为注册中心是CP架构，作为配置中心
- 动态修改配置；通过客户端**长轮询**，保持连接不关闭，直到超时30s或有数据可用，来拉取Nacos服务端的配置变化；