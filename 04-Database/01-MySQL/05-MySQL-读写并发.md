# InnoDB如何控制读写并发

![](03-MySQL并发读写.png)

InnoDB方案：<font color="#de7802">锁 + MVCC</font>

InnoDB通过实现各种类型、粒度的锁，来控制写并发；
- 根据不同的场景，由不同的锁类型；
- 不同的锁类型，粒度不同，会影响并发性能；

MVCC(多版本并发控制)
- 目的：通过版本号机制，减少锁的使用，提升并发性能；
- 需要解决的2个场景：<font color="#de7802">当前读</font>、<font color="#de7802">一致性读</font>；
- <font color="#de7802">当前读</font>：有些事务需要读取最新数据，比如<u>需要根据最新数据，进行计算、再写入计算结果</u>；如果无法获取最新数据，就会造成数据错误；
- <font color="#de7802">一致性读</font>：有些事务仅读取当前数据，不依赖数据做计算或写操作；

# InnoDB锁

InnoDB的锁按照粒度分为：
- 全局锁；
- 表锁；
    - MDL锁；
    - 意向锁；
    - 自增锁；
- 行锁
    - 记录锁；
    - 间隙锁；
    - Next-Key Lock

行锁又可以分为：读写锁、排他锁（悲观锁）；
- 读写锁：允许多个读操作获取共享锁，阻止任意一个写操作/获取排他锁；
```sql
select ... from ... lock in share mode;
select ... from ... for share;
```
- 排他锁：仅一个事务能够获取排他锁，阻止其他事物任意的读写操作；
```sql
insert ...
update ...
delete ...
select ... from ... for update;
```

乐观锁：业务上通过版本号或CAS自行实现；

## 什么情况触发锁

1. 读操作显式执行：`FOR UPDATE`
	- 当SQL走索引时，触发<font color="#de7802">行锁</font>；
	- 当SQL没有索引，触发<font color="#de7802">表锁</font>；
2. 执行操作：`INSERT`、`UPDATE`、`DELETE`：
	- 走索引：获取行级写锁；
	- 不走索引：锁表；
3. 执行：`LOCK TABLES [table] read/write`：锁表；
	- 读锁锁表：其他事务可读，不可写；
	- 写锁锁表：其他事物不可读，不可写；
	- 解锁：`UNLOCK TABLES;`

## 避免触发锁表

什么情况下会锁表：
1. DDL重建表、重新构建索引，触发锁表；
2. 大事务：占用过多资源，执行大量`INSERT`、`UPDATE`操作；
	- 批量更新，最好分批；
3. 不走索引的`UPDATE`；

避免锁表：
1. 事务中，减少insert、update、delete等执行到commit之间的时间，只有发生当前读才会加锁；
2. 减少大事务，尽可能延迟事务开启时间；缩短开启、提交之间的耗时；


 
## 行锁

行锁：**锁的是索引**，即必须走索引，才能锁行，否则表锁；

- 同一条记录，使用索引A生成的行锁，不会阻塞使用索引B进行操作；
- 如果使用的索引A涉及到回表，那么A索引和主键索引都会被锁；
- 行锁不会影响其他数据行的操作；粒度小；
- `WHERE`条件索引失效，行锁变表锁；

## 1. Record Lock

当SQL通过索引，执行了<font color="#de7802">当前读</font>，就会对其加上记录锁；(锁行)

不走索引的当前读，就会全表扫描，先对全表加上记录锁，再逐步过滤，释放那些不满足WHERE条件的记录的锁；(先锁表，后锁行)

**因此：update操作请务必走索引；**

## 2. Gap Lock 间隙锁（仅RR）

当执行<font color="#de7802">当前读</font>对一个或多个记录加行锁时，会自动对记录的间隙进行加锁；防止插入操作；

- 降低了并发度；
- 提高了数据一致性；
- 仅存在于【RR隔离级别及以上】，目的是解决幻读；
```sql
UPDATE t SET name = 'Lucy' WHERE id = 30;
```
![](03-MySQL-GapLock.png)

## 3. Next-key Locks临键锁(仅RR)

`Next-key Locks = Record Lock + Gap Lock`，是一个<font color="#de7802">左开右闭区间</font>；

- RC级别：当通过WHERE过滤数据时，只锁满足条件的；(不存在间隙锁)
- RR级别：当通过WHERE过滤数据时，锁住期间扫过的所有行；(间隙锁)
![](03-MySQL-NextkeyLock.png)

触发条件：
- 在RR隔离级别下，只考虑Next-key锁，不再考虑记录锁；**一切锁都为区间**；再根据条件考虑退化；
- 根据查询条件和使用的索引类别，Next-key可能降级为记录锁或间隙锁；
- 等值查询时：
    - 使用唯一索引，不会锁间隙，退化为记录锁；
    - 使用普通索引，会锁两边间隙；
- 范围查询时，终点值不等于最近的一条记录时：
    - <font color="#de7802">如果使用主键索引</font>：Next-key退化为间隙锁；因为不等于就不需要右闭了；【例子2】
    - <font color="#de7802">如果使用唯一索引</font>：不会退化，仍然锁住右侧的值，即使没有在查询条件内；【例子3】
- 范围查询时，终点值正好是一条记录，Next-key退化为行锁；【例子2、3】

示例：
有`t_stock`表，主键为`id`，唯一索引为`user_id`，普通索引：`order_id`；
```sql
CREATE TABLE `t_stock` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `stock` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

mysql> select * from t_stock;
+----+---------+----------+-------+
| id | user_id | order_id | stock |
+----+---------+----------+-------+
|  1 |       1 |        1 |  1000 |
|  5 |       5 |        5 |  1000 |
| 30 |      30 |       30 |  1000 |
| 35 |      35 |       30 |  1000 |
| 40 |      40 |       40 |  1000 |
+----+---------+----------+-------+
```

1、**主键索引，范围终点非记录，退化间隙锁**
```sql
SELECT * FROM t_stock WHERE id >= 5 AND id < 29 FOR UPDATE
```
- 可以锁的区间有：(-∞, 5]、(5, 30]，因为终点值5是一条记录，退化行锁，29不到30，退化间隙锁；
- `id`为主键索引：锁[5, 30)

2、**普通索引，范围终点非记录，膨胀到最近的记录**
```sql
SELECT * FROM t_stock WHERE order_id >= 5 AND order_id < 29 FOR UPDAT
```
- `order_id`为普通索引，无论回表与否：锁[5, 30] 
- 但是不影响使用唯一索引`user_id = 30`进行`UPDATE`；

3、唯一索引的特殊情况，不合理
```sql
SELECT * FROM t_stock WHERE user_id >= 5 AND user_id < 29 FOR UPDATE
```
- `user_id`为唯一索引：**锁[5, 30]**

4、**普通索引DELETE场景**
```sql
-- SESSION-1 先执行DELETE
DELETE FROM t_stock WHERE order_id = 30;

-- SESSION-2 执行插入：阻塞；
INSERT INTO t_stock VALUES (25, 25, 25, 1000);

-- SESSION-3 执行插入：阻塞；
INSERT INTO t_stock VALUES (31, 31, 31, 1000);

-- SESSION-4 执行更新：正常执行；
UPDATE t_stock SET stock = 20 WHERE order_id = 40;
```
- 锁：(5, 30], (30, 40)

5、**唯一索引DELETE场景**
```sql
-- SESSION-1 先执行DELETE
DELETE FROM t_stock WHERE user_id = 30;

-- SESSION-2 执行插入：阻塞；
INSERT INTO t_stock VALUES (25, 25, 25, 1000);

-- SESSION-3 执行插入：阻塞；
INSERT INTO t_stock VALUES (31, 31, 31, 1000);

-- SESSION-4 执行更新：正常执行；
UPDATE t_stock SET stock = 20 WHERE user_id = 40;
```
- 退化为记录锁：30，因为唯一索引，不会存在多条记录，不需要锁范围；


# MVCC

## 当前读和一致性读
  
<font color="#de7802">当前读</font>：一些操作在真正执行前需要读取最新的数据；

以下SQL操作都会执行当前读；当前读在并发环境下，以<font color="#de7802">加锁</font>的方式实现；
```sql
UPDATE ...

INSERT ...

SELECT ... FOR UPDATE;

SELECT ... IN SHARE MODE;

SELECT ... FOR SHARE;
```

<font color="#de7802">一致性读</font>(Consistent read)：读取历史版本数据；当在事务中执行`SELECT`操作，会触发快照读，可能读取到的是非最新数据，但是不用加锁；

```sql
SELECT * FROM t_table WHERE ...;
```


## MVCC工作原理

MVCC根据<font color="#de7802">事务列表</font>、<font color="#de7802">版本链</font>、<font color="#de7802">事务可见性算法分析</font>，来决定当前事务可以读到的数据范围；

1. <font color="#de7802">事务列表</font>：MySQL维护一个活跃事务列表；记录当前正在执行的事务状态；
2. <font color="#de7802">版本链</font>：每个数据行，都维护一个版本链；记录每一个版本由哪个事务进行的数据变更、变更时间等数据；
3. <font color="#de7802">事务的可见性算法分析</font>：当事务需要读取数据时，根据事务列表、版本链，来判断哪些版本数据是对当前事务可见的；

### 事务列表

![](03-MySQL-事务列表.png)
- 每个事务都由一个分配的id；
- 事务列表中的id顺序维护；
- 通过事务列表的活跃事务，可以快速根据min_id、max_id判断当前事务是否活跃；

### 数据版本链

每条数据，会有2个隐藏列：
- <font color="#b8cce4">DB_TRX_ID</font>：最后修改此数据的事务Id；
- <font color="#b8cce4">DB_ROLL_PTR</font>：指向前一个数据版本的指针；
事务修改数据，则顺序生成一个新的版本；

![](03-MySQL-数据版本.png)



## ReadView如何生成

![](03-MySQL-ReadView.png)

当事务进行<font color="#de7802">一致性读</font>操作时：
1. 获取要读取的数据行、版本链信息、版本链中的事务id；
2. 根据数据的版本链中的事务id，根据<font color="#de7802">事务活跃列表</font>判断这些事务是否还活跃；
3. <font color="#d99694">可见性算法分析出可读的数据版本</font>：暂定活跃事务列表中的最小事务id为：min_id，最大事务id为：max_id，当前数据版本的事务id为id，那么：
	1. 如果`id < min_id`，则事务已提交，此数据版本对当前事务可见；
	2. 如果`min_id < id < max_id`，则事务未提交，此数据版本对当前事务不可见；
	3. 如果`max_id < id`，则此数据版本为新事务创建的，此数据版本对当前事务不可见；
4. 如果当前版本数据，不可读取，则根据版本链，找到上一个版本，继续执行第3步；
5. 直到获取所有可读的数据，ReadView完成；

## ReadView的生成时机

RC隔离级别下：
- 事务开启后，<font color="#de7802">每次SELECT</font>都会生成新的<font color="#de7802">READ VIEW</font>；
- 期间其他事务修改记录，当前事务再次读取，生成新的<font color="#de7802">READ VIEW</font>，则会出现重复读取，数据不一致的情况（不可重复度）

RR隔离级别下：
- 事务开启后，<font color="#de7802">首次SELECT</font>生成一次<font color="#de7802">READ VIEW</font>，直到下次触发当前读之前不会再生成；
- 期间其他事务修改记录，不会影响当前事务的<font color="#de7802">READ VIEW</font>，当前事务不会感知到，每次读取都读同一个<font color="#de7802">READ VIEW</font>；也就不存在：不可重复读问题，重复读取数据一致；













