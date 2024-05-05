通过EXPLAIN可以显示SQL的执行计划，查看查询执行计划可以了解MySQL会如何执行某个查询，包括哪些表会被使用、使用了哪些索引以及执行顺序等信息
>重点关注：type、extra

- **id**: 标识每一步的执行顺序；越小越优先执行；
- select_type: 查询类型
	- 简单查询：SIMPLE
	- 联合查询：UNION
	- 子查询：SUBQUERY
	- 派生表：DERIVED，表示在FROM子句中使用了子查询；
- **table**: 查询涉及的表名。
- partitions: 匹配的分区列表。
- **type**: 访问表的方式，可以判断是否用了索引(效率从高到低)
	- const：指定主键等值查询`SELECT .. WHERE id = 1`；
		- system是const的特殊情况，只有MyISAM存在；
	- eq_ref：关联查询中使用主键、唯一索引关联；
	- ref：使用了二级索引；
	- range：使用了索引的范围查找；`BETWEEN、IN、< > <= >=`
	- index：全表扫描；数据可以直接从B+树中获取；
		`SELECT id`
	- all：全表扫描；数据需要从全表获取；`SELECT *`
- possible_keys: 可能使用的索引列表。
- **key**: 实际使用的索引，如果是联合索引，需要结合key_len来看使用了几个索引字段；
- **key_len**: 使用的索引长度；==通过使用的索引长度，可以看出联合索引中，有几个字段使用到了索引==；当字段允许为null时，索引需要额外多占用1个字节；
- ref: 列与索引之间的匹配条件。
- rows: MySQL估计需要读取多少行来执行查询。
- filtered: 过滤的行数占总行数的百分比。
  - 如通过索引锁定了100行，根据其他WHERE条件最终返回10行，filtered=10
- **Extra**: 确定type后，一般通过此字段进一步优化；
	- ==using index==：走了覆盖索引；
	- using index condition：索引下推；**InnoDB层执行过滤操作**；
	- using where：**Server层执行了过滤操作**；效率偏低；可能需要优化；
	- using temporary：使用了临时表，需要临时存储结果集；性能低；需要优化；一般出现在：`GROUP BY、DISTINCT、UNION`；
	- using filesort：排序没有走索引；查询出数据后，单独再进行一次`ORDER BY`排序时出现；有可能在内存排序，也有可能在磁盘排序，由：`sort_buffer_size`决定；如果数据过大，内存放不下，则会使用临时的磁盘文件进行排序；
	- Backward index scan：当使用DESC排序时，索引会倒序扫描；无伤大雅；

# 官方解读

using filesort：[order-by-optimization](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)

using temporary：[explain-output](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)