参考：[MySQL8.0-The CHAR and VARCHAR Types](https://dev.mysql.com/doc/refman/8.0/en/char.html)

| 数据类型  | 字节数           | 特点                                      |
| --------- | ---------------- | ----------------------------------------- |
| TINYINT   | 1                |                                           |
| INT       | 4                | 有符号：-32768~32767 无符号：0~65535      |
| BIGINT    | 8                |                                           |
| CHAR      | 根据定义长度而定 | 固定长度字符串                            |
| VARCHAR   | 0-65535          | 可变长度字符串                            |
| DATETIME  | 8                | 日期和时间值，格式：'YYYY-MM-DD HH:MM:SS' |
| TIMESTAMP | 4                | 时间戳，从1970年1月1日至今的秒数          |


需要注意的是，具体的存储空间大小还可能受到字符集、排序规则和表行数等因素的影响，上表仅作为参考。

# INT 整形
int(11)类型中的数字含义：https://www.cnblogs.com/polk6/p/11595107.html

int中的数字大小，并不影响能够存储的最大长度，而是在unsigned模式下，小于11的位数会补零；

# CHAR/VARCHAR 字符串
char(n) / varchar(n)：n为声明的最大字符数，非字节；

char和varchar存储对比：

| Value        | `CHAR(4)` | Storage Required | `VARCHAR(4)` | Storage Required |
| ------------ | --------- | ---------------- | ------------ | ---------------- |
| `''`         | `'    '`  | 4 bytes          | `''`         | 1 byte           |
| `'ab'`       | `'ab  '`  | 4 bytes          | `'ab'`       | 3 bytes          |
| `'abcd'`     | `'abcd'`  | 4 bytes          | `'abcd'`     | 5 bytes          |
| `'abcdefgh'` | `'abcd'`  | 4 bytes          | `'abcd'`     | 5 bytes          |
- ==CHAR==长度固定(0-255)，==VARCHAR==无限制，但MySQL有每行数据65535字节的硬性限制；
- ==CHAR==定长，无论是否到达长度；==VARCHAR==变长，小于限定长度，则不占用额外空间；
- ==VARCHAR==使用`1byte`的额外存储，用来表示长度
  - 当n <= 255，额外占用1byte；
  - 当n > 255，额外占用2byte；

如VARCHAR(10)，最大10个字符，每个字符使用的字符集不同，占用空间不同：`n x 字符集`
- UTF-8：`10 x 3 = 30字节`
- gbk：`10 x 2 = 20字节`
- latin1：`10 x 1 = 10字节`


# 日期时间类型
DATETIME

# TINYINT 布尔
- 0: false
- 1: true



## Text
不占用MySQL行的字节大小；
