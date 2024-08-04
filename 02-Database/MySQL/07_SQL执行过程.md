
<div align="center">
<img src="../../images/innodb.png" alt="concurrency" align="middle" style="zoom: 80%;" />
</div>

## UPDATE语句
1、客户端发送SQL到Server层，由连接器检查权限，由解析器完成语法分析，优化器选择最优执行计划；由执行器调用Innodb执行SQL；

2、Innodb先到`BufferPool`中查询update语句的数据；如果没有则从磁盘文件中加载到`BufferPool`中；

3、将要修改的记录写入`undolog`中；

4、执行update语句，修改数据，并标记修改数据所在页为脏页；

5、执行commit时，将数据的修改存入redolog buffer；并在某个时机写入redolog磁盘文件；取决于配置：`innodb_flush_log_at_trx_commit`
- `innodb_flush_log_at_trx_commit = 0`：写入buffer，每秒异步写入磁盘；(**性能高，宕机可能丢数据**)
- `innodb_flush_log_at_trx_commit = 1`：写入buffer，同步写入磁盘；(**默认值；可靠性高，保证不丢失已提交数据**)
- `innodb_flush_log_at_trx_commit = 2`：写入buffer，由操作系统异步落盘；(性能高)

6、将数据修改写入`bin log`；

7、将BufferPool的脏页写入Flush链，由异步线程刷入磁盘；


## SELECT语句

1、客户端发送SQL到Server层，由连接器检查权限，由解析器完成语法分析，优化器选择最优执行计划；由执行器调用Innodb执行SQL；

2、如果开启了自适应哈希索引，并且是等值查询，则计算哈希值；

3、如果哈希命中BufferPool数据，则直接返回；

4、如果未命中，则查询BufferPool中数据，如果有则直接返回；

5、如果没有，则从磁盘中加载对应的页，返回；