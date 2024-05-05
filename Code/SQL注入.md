## 数据库客户端SQL处理的两种方式

1、拼接完成，直接发送给MySQL服务器进行编译、执行；

2、SQL和参数分开，发送SQL进行编译，再发送参数，替换编译后的SQL中的占位符，再执行；

## 防止SQL注入

防止注入，主要是通过对参数进行校验；

预编译能够防范SQL注入主要是通过对每个参数设置类型，在传入参数时，对类型进行校验；

比如：`SELECT password FROM t_user WHERE username = ? AND password = ?`

### 注入场景：

如果通过直接拼接的方式，传入：`xx OR 1 = 1 --`，`xxxx`可以拼接成：

`SELECT password FROM t_user WHERE username = xx OR 1 = 1 -- AND password = xxxx`

**传入带有关键字、注释符号的字符串，拼接完成后，整体进行编译，就会发生注入**；

### 预编译防止注入

但是，如果**确定好参数个数和类型，提前编译好，再传入参数**，就会将`xx OR 1 = 1 --`，`xxxx`整体作为字符串传入，变成：

`SELECT password FROM t_user WHERE username = 'xx OR 1 = 1 --' AND password = 'xxxx'`

这样就可以防止SQL注入；