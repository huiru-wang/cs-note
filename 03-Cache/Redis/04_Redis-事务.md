- [Redis事务](#redis事务)
- [执行过程](#执行过程)
- [事务执行场景](#事务执行场景)
- [Lua脚本](#lua脚本)

# Redis事务

Redis事务本质是一系列命令的集合；

一个事务的所有命令都会序列化，事务执行过程中，会串行化执行命令；

1、Redis事务不遵循原子性；运行前的命令错误会不执行，运行期间的错误不会回滚；

2、保证一致性；命令正确可以保证；

3、遵循隔离性，因为只有一个线程，同时只有一个事务执行；

4、不保证持久性，由持久化策略保证；

**建议使用Lua脚本，能够达到事务的效果，并且自定义程度高；**

**但是执行过程中如果出错，仍然不会回滚；**

# 执行过程

1. 开始事务：multi
2. 命令入队多条命令
3. 放弃事务：discard
4. 执行事务：exec

# 事务执行场景

1、命令全部正确，则执行成功

2、命令在入队时，出现**语法错误**(命令不存在)，则全部命令不执行；

```shell
> multi
OK
> set k2 v2
QUEUED
> setget # 错误命令，报错
(error) ERR unknown command 'setget'
> exec # 全部命令不会执行
(error) EXECABORT Transaction discarded because of previous errors.
```

3、命令都成功入队，但是执行时，有**命令执行失败(运行时错误)**，则继续执行，不会回滚；

```shell
> multi
OK
> set name kit
QUEUED
> incr name
QUEUED
-------------------命令全部入队成功-------------------
> exec
1) OK
2) (error) ERR value is not an integer or out of range
-------事务执行完毕，其中incr name命令执行失败，其他命令正常执行----------

> get name    # 事务依然成功
"kit"
```

4、直到最终遇到：DISCARD，事务结束；

# Lua脚本

Lua脚本如果保证命令正确的前提下，可以保证是一个事务；
