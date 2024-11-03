参考：[MySQL8.0-The CHAR and VARCHAR Types](https://dev.mysql.com/doc/refman/8.0/en/char.html)

# 常用数据结构

| 数据类型       | 字节数               | 特点                                        |
| ---------- | ----------------- | ----------------------------------------- |
| TINYINT    | 1                 |                                           |
| INT        | 4                 | 有符号：-32768~32767 无符号：0~65535              |
| BIGINT     | 8                 |                                           |
| CHAR(N)    | 取决于N和编码           | 固定长度字符串                                   |
| VARCHAR    | 视长度动态分配           | 可变长度字符串                                   |
| TEXT       | 视长度动态分配           | 存储大量文本数据的数据类型                             |
| DATETIME   | 8                 | 日期和时间值，格式：'YYYY-MM-DD HH:MM:SS'           |
| TIMESTAMP  | 4                 | 时间戳，从1970年1月1日至今的秒数                       |
- 具体的存储空间大小还可能受到<font color="#de7802">字符集</font>、<font color="#de7802">排序规则</font>和<font color="#de7802">表行数</font>等因素的影响；
- Innodb的每行最大存储：65535字节；

# 整数

| 整数类型      | 存储       | 有符号数值范围                            | 无符号最大值                         |
| --------- | -------- | ---------------------------------- | ------------------------------ |
| TINYINT   | `1 byte` | `-128` ~ `127`                     | `255`                          |
| SMALLINT  | `2 byte` | `-32768` ~ `32767`                 | `65535`（2<sup>16</sup>-1）      |
| MEDIUMINT | `3 byte` | `-8388608` ~ `8388607`             | `16777215`（2<sup>24</sup>-1）   |
| INT       | `4 byte` | `-12147483648` ~ `2147483647`      | `4294967295`（2<sup>32</sup>-1） |
| BITGINT   | `8 byte` | -2<sup>63</sup> ~ 2<sup>63</sup>-1 | 2<sup>64</sup>-1               |
INT(11)：11并不代表存储大小，仅代表显示宽度
仅当列设置为：`UNSIGNED ZEROFILL`：无符号补零；11才有意义，如果少于11个字符，左侧补零；

# 浮点

| 浮点类型         | 存储     | 精度  |     |
| ------------ | ------ | --- | --- |
| FLOAT(N)     | 4 byte | 7位  |     |
| DOUBLE(M, D) | 8 byte | 15位 |     |



# CHAR / VARCHAR 字符串

CHAR(n) / VARCHAR(n) 中的`n`为声明的最大字符数，非字节数；

| Value         | `CHAR(4)`  | Storage Required  | `VARCHAR(4)` | Storage Required  |
| ------------- | ---------- | ----------------- | ------------ | ----------------- |
| `''`          | `'    '`   | 4 bytes           | `''`         | 1 byte            |
| `'ab'`        | `'ab  '`   | 4 bytes           | `'ab'`       | 3 bytes           |
| `'abcd'`      | `'abcd'`   | 4 bytes           | `'abcd'`     | 5 bytes           |
| `'abcdefgh'`  | `'abcd'`   | 4 bytes           | `'abcd'`     | 5 bytes           |
- `CHAR(N) / VARCHAR(N)` 中的`N`为声明的最大<font color="#4f81bd">字符数</font>，非字节数；
- 长度固定(0-255)，<font color="#de7802">VARCHAR</font>根据存储内容计算空间，但使用`1byte`的额外存储；但MySQL有每行数据65535字节的硬性限制；
	- 当`n <= 255`，额外占用`1 byte`；
	- 当`n > 255`，额外占用`2 byte`；
- 存储的字段，超出CHAR、VARCHAR，会报错或截断（取决于`sql_mode`参数）；
- 具体占用字节数，需要根据字符编码计算：
	- utf8mb4：`10 x 3 = 30 Byte`；（根据具体字符动态计算）utf8mb4为utf8超集
	- GBK：`10 x 2 = 20 byte`；
	- latin1：`10 x 1 = 10 byte`

# TEXT

| TEXT类型     | 字符长度                              |
| ---------- | --------------------------------- |
| TINYTEXT   | 0 ~ 255                           |
| TEXT       | 0 ~ 65535（2<sup>16</sup>-1）最大64kb |
| MEDIUMTEXT | 0 ~ 2<sup>24</sup>-1              |
| LONGTEXT   | 0 ~ 4GB                           |
- 目标：为存储大量文本类型数据；
- TEXT无法作为主键，可以作为索引，也可以指定前N个字符作为索引；
- TEXT存储保留空格，不会`trim`；
- TEXT数据不会放在Innodb的页中，也就<font color="#de7802">不占用行存储空间</font>，行中存放地址，数据单独存储；


# 日期时间类型

| 时间类型      | 存储     | 存储格式                                          | 支持时间  |
| --------- | ------ | --------------------------------------------- | ----- |
| TIME      | 3 byte | HH:MM:SS（仅时间，无日期）                             | 不存日期  |
| DATETIME  | 5 byte | YYYY-MM-DD HH:MM:SS                           | 9999年 |
| TIMESTAMP | 4 byte | `1970-01-01 00:00:01` ~ `2038-01-19 03:14:07` | 2038年 |
- 其中`TIME(3), DATETIME(6)`表示精度位数
	 3位：毫秒级；
	 6位：微秒级；
- TIMESTAMP：可设为插入、更新时，自动更新时间戳；TIME、DATETIME不可以；

