# Why

The LB is located between the users and the actual backend servers.

Load balance make sure that users' requests are evenly distributed across multiple servers, and prevent overloading of any single resource.
## 1. Reverse Proxy

It can filter requests, identify and intercept malicious requests.
It also can manage SSL encryption.

## 2. Balancing Load

it can evenly distribute user requests to multiple backend servers and balance the load of each server which ensuring no single server becomes overwhelmed.

## 3. Scalability

It plays a crucial role in the scalability of a distributed system.
When it is necessary to increase the processing capacity of servers, new servers can be simply added to the distributed system.

## 4. Health Checks & Failover

Health checking is an essential feature of load balancers.
It can ensure traffic is only directed to servers that are online and responsive.

Once a failure is detected, Load Balancer switch the the workload to other health services.

>健康检查是一个重要功能
>它保证流量总是路由到在线的健康节点
>一旦故障被检测到，LoadBalancer就会将负载转移到别的节点


# Load Balance Algorithms
## 1. Round Robin

The round-robin algorithm is one of the simplest load-balancing routing algorithms. Requests are assigned to backend servers in sequence. 
When the last server is reached, it loops back to the first one.

This type works well for servers with similar specifications.

> 轮询算法是最简单的负载均衡算法，请求会按顺序依次分配给后端服务.
> 当达到最后一个服务器时，它会循环到第一个服务器
> 这种类型适用于具有相似规格的服务器

## 2. Weight Round Robin

The Weight Round Robin assigns a weight to each server on the basis of Round Robin.
Servers with stronger performance can be assigned a higher weight. 
The higher the weight, the more chances of being assigned requests.

This is effective when the servers in the pool have different capabilities.

>加权轮询算法在轮询的基础上为每个服务器分配一个权重
>性能越强的服务器被分配的权重越高
>权重越高，被分配请求的机会就越多

## 3.  Least Connection

Load balancer directs traffic to the server with the fewest active connections.
It is ideal when the server load is not evenly distributed.

>负载均衡器会将流量引导到具有最少活动链接的服务器
>非常适合服务器负载不均衡的情况
## 4. IP Hash

IP Hash algorithm performs a hash calculation based on the source IP address of the request and then assign the request to a fixed backend server.
Request with the same source IP will always be assigned to the same server.

It is useful for the scenarios that session states need to be maintained.

>IP Hash算法通过计算源IP地址将其路由到一个固定的后端服务上
>相同IP地址的请求总是被路由到相同的服务器
>这对需要保持session会话的应用很有用


## 5. Consistent Hashing




