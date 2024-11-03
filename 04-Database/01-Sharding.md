
# Sharding Strategy

## 1. Range-based Sharding

Range-based sharding divides data according to a certain range of data.
For example, in a database that stores user order information, range sharding can be done according to the order date. Orders within a certain date range are stored in a shard.

> 范围分片根据数据特定的范围进行分片
> 比如，一个存储用户订单的数据库，可以根据订单日期进行范围分片，在一个特定范围内的订单存储在特定的分区

## 2. Hash Sharding

Hash sharding determines the shard where the data is stored by performing a hash operation on a certain key attribute of the data (such as user id, order id, etc.)

Hash sharding can make the data distribution relatively even and reduce the problem of hot-spot data, because hash function tries to ensure that the amount of data received by each shard is similar.

> 哈希分片通过对一个特定的属性进行hash操作，确定数据所处的分片
> 哈希算法可以使数据分布均匀，减少热点问题，因为hash函数可以尽量保证每个分片的数据相近

## 3. Directory-based Sharding

There is a independent service to provide metadata information of data storage location or sharding rules.
When data needs to be accessed, request the service to get the shard, and then get data from the corresponding shard.

>通常使用一个独立的服务存储数据分片、分片规则的元数据信息
>当数据需要被访问，首先请求这个服务获取分片，然后从对应的分配获取数据

# Sharding Proxy

Sharding proxy is a kind of middleware software located between applications and database cluster.
1. It intercepts and processes the SQL
2. Routes these requests to the appropriate database shards based on the pre-configured sharding rules.
3. Aggregates and processes the results
4. Return the results to the applications.




