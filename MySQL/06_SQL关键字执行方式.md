# SQL执行顺序

1、**FROM**：确定主表；

2、**JOIN ON**：连接子表，并通过ON条件，将子表关联的数据，插入主表；

3、**WHERE**：根据查询条件，对数据过滤；

4、**GROUP BY**：对过滤后的结果集，进行分组；

5、**HAVING**：对分组后的数据，执行聚合函数，再次过滤；

6、**SELECT**：从结果中查询指定的列；

7、**DISTINCT**：如果有，再对查询的结果按列去重；

8、**ORDER BY**：对最终的结果，排序；

9、**LIMIT**


# JOIN是如何工作的
```sql
SELECT <column...> 
FROM <table_1> t1
JOIN <table_2> t2 ON <join_condition>
JOIN <table_3> t3 ON <join_condition>
WHERE <where_condition>
```
- 无论多少JOIN，都又一个表驱动，具体看JOIN方式；


## JOIN优化

1、确定驱动表：

0、INNER JOIN中ON是没有用的，同`where`效果一样；是先连接


# WHERE
where条件按照从左到右的顺序执行；

1、区分度高的列，尽量靠前；计算区分度：`count(distinct col) / count(*)`


# GROUP BY如何工作

`group by`的本质是排序，只有使用了索引的情况下，才有可能不借助临时表就能完成group操作；否则需要在内存中完成group，并且如果数据量过大，还可能要借助磁盘文件；
- `group by`的列必须是同一个表的，且必须在同一个索引内，才有可能走索引；具体还需要看具体的聚合函数；
- `group by`不走索引，则会使用临时表，但是数据量过大，仍然需要借助磁盘文件，由：`tmp_table_size` 决定；


`group by`两种执行方式：
- 松索引扫描
- 紧索引扫描


# ORDER BY如何工作

1、初始化`sort_buffer`，根据查询的结果集，将`select`的列放入buffer中；(`order by`一般在sql最后执行)

2、有以下两种情况时，在将数据放入buffer中时，就已经排好序了：
- **使用了单列索引，并且`where`和`order by`使用同一单列索引；where走了索引天然有序，但是如果用另一个字段排序，则需要重新排序**；
- **使用了联合索引，且`order by`的是索引的最后一列**；

3、如果explain出现：`using filesort`，一般是以下情况：
- 没走索引进行排序，需要额外进行一次快速排序；
- 即使使用了索引，如果数据量过大，也可能需要使用临时的磁盘文件进行排序；由：`sort_buffer_size`决定；


# in / exist

in执行流程：查询子查询的表且内外表有关联时，先执行内层表的子查询，然后将内表和外表做一个笛卡尔积，然后按照条件进行筛选，得到结果集。
- 所以相对内表比较小的时候，in的速度较快

exists执行流程：指定一个子查询，检测行的存在。遍历循环外表，然后看外表中的记录有没有和内表的数据一样的，匹配上就将结果放入结果集中

因此：
- 遵循小表驱动大表；
- `exists`是以外层表为驱动表，`in`是先执行内层表的；
- 如果子查询得出的结果集记录较少，主查询中的表较大且又有索引时应该用`in`；
- 如果外层的主查询记录较少，子查询中的表大且又有索引时使用`exists`

## not in / not exists

`not in`使用的是全表扫描没有用到索引；

`not exists`在子查询依然能用到表上的索引；

- 建议使用`not exists`代替`not in`