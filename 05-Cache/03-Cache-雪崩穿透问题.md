
缓存穿透：由于缓存失效，导致压力来到数据库上；特指大数据量下的缓存失效，导致数据库压力过大的问题；

# 缓存雪崩

同一时间大面积key失效，大量请求打到数据库上；
措施：
1. key失效时间增加随机值；
2. 热点key永不失效；
3. 定时任务定期检查缓存失效时间，刷新快失效的缓存；

# 缓存穿透

缓存穿透：针对缓存不存在、数据库也不存在数据，存在大量请求或恶意攻击；

1. 不存在的key，也进行缓存，给个空值；失效时间短一点（2s）；
2. 布隆过滤器；

# 缓存击穿

热点key失效时，流量涌入服务中、数据库中；
措施：
1. 热点key永不失效；
2. 缓存失效后，<font color="#de7802">加锁、查缓存、查库</font>，刷新缓存；


