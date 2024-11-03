
# 慢SQL

可能原因：
1. 索引问题；
	- 确认是引擎层的SQL执行耗时慢、Filter过滤代价高等都可能是索引问题；
	- 确认是否走了索引；
	- 如果走了，再分析
2. Server层问题：网络、服务器链接问题；
	- 首先要排除索引问题；
	- 网络波动、链接数过少，导致链接中断，并发度低，可能引发数据查询慢；
3. 缓存失效；
	- 排除索引问题；
	- 需要根据Buffer Pool的缓存命中率来确认是不是缓存失效的问题；
	- 增加Buffer Pool容量；或者是否是某些大型查询导致缓存频繁被挤占、失效？
4. QPS过大导致CPU升高、负载升高；
	- 需要先排除索引问题；确定是CPU、负载问题；
	- 那么只能在业务上加缓存、分库分表、水平扩容、读写分离等手段来解决；


# 深分页

## 简单分页的问题

```sql
SELECT id, user_id, `status`, type, created_at 
FROM t_order 
ORDER BY created_at 
LIMIT 250000, 10;

----------------------------------------------------------
200w数据耗时：1898ms
----------------------------------------------------------
EXPLAIN
id   select_type    table      type      rows     filtered       Extra
1	   SIMPLE	   t_order		ALL  	1993917	   100.00	    Using filesort
```

- `created_at`有索引，但是数据量过大，直接走ALL全表扫描；
- `LIMITE m, n`：查询m+n条记录，再过滤掉前m条记录；**回表数据量过大**

解决目标：如何快速定位到分页的<font color="#de7802">起始位置</font>；减少查询数据量；


## 子查询

```sql
SELECT t.id, t.user_id, t.status, t.type, t.created_at
FROM t_order t
WHERE t.created_at >= (SELECT o.created_at FROM t_order o ORDER BY o.created_at LIMIT 250000, 1) 
ORDER BY t.created_at LIMIT 10;

----------------------------------------------------------
200w数据耗时：121ms
----------------------------------------------------------

EXPLAIN
id  select_type table type   possible_keys  key    Extra
1   PRIMARY     t     range	 tdx_created_at	tdx_created_at  Using where
2   SUBQUERY    o	index	                tdx_created_at	Using index
```

- 子查询不需要回表，先锁定`created_at`查询条件的最小值，再执行LIMIT；
- 回表的数量就只有LIMIT的个数；并且是全要的，不需要再过滤，所以`filtered`都是100；

## 游标分页

游标的选择：尽可能简单；但是要根据具体的业务决定；

- 游标能够走索引，是一个前提；
- 必须是可排序的，通常是根据业务场景可排序的；
- 使用游标分页，不可跳页；
- 使用游标分页，查询下一页，必须携带上一页的<font color="#de7802">游标id</font>；（这里时时间戳）

```sql
EXPLAIN
SELECT id, user_id, `status`, type, created_at 
FROM t_order 
WHERE created_at >= '2023-04-04 21:45:00' 
ORDER BY created_at LIMIT 10;

----------------------------------------------------------
200w数据耗时：39ms
```

