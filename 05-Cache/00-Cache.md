# Why Cache

<font color="#de7802">目的</font>：尽可能缩短网络请求的链路；降低响应时延；减轻服务压力；

<font color="#de7802">副作用</font>：需要额外处理缓存一致性问题；

<font color="#de7802">使用原则</font>：多读少写场景；多写场景不适合缓存；


![](../images/09-SystemDesign-Cache.png)

# Why Cache

Benefit:
- Reduced Latency
- Lowered Server Load
- Improved UX (User Experience)

Disadvantage:
- Data Inconsistent. 
- High server and storage costs. The cache components require more memory, disk, compute resources.

# When to use Cache

1. An application or a functionality needs to frequently read the same data, besides the data is rarely updated.
2. Application scenarios that require low latency and fast response.

# How to use Cache
##  1. Browser Cache

#DOTO


## 2. CDN
Benefits:
- Reduced Latency
- High Availability
- Improved Security
- DDoS Protection

Use CDN when:
- <font color="#de7802">Delivering static assets</font> like images, CSS files, JavaScript files, video content.
- Need high availability and performance for <font color="#de7802">user across different geographical locations</font>.
- Reducing the load on the original server is a priority.
Use Original Server when:
- Serving dynamic content that changes frequently.
- Personalized for individual users.
- Handling tasks that require <font color="#de7802">real-time processing</font> or access to up-to-date data.
- Requires complex server-side logic that cannot be replicated or cached by a CDN.

>何时使用CND服务：
- 传输图片、CSS、JavaScript文件、视频内容等静态文件
- 需要为不同地理位置的用户提供高可用高性能服务
- 优先考虑减轻原始服务器的负载

>使用原始服务器：
- 提供动态内容
- 针对不同用户进行个性化设置
- 处理实时任务或获取最新数据
- 需要复杂的服务端计算逻辑


## 3. Server Cache

#TODO 





