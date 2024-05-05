# CPU飙高定位

1、`jps`：找到JVM进程；

2、查看进程运行详情：`top`

2、查看进程下的线程详情：
- top：`top -Hp [进程id]`：显示当前进程下所有线程的Id和内存、CPU使用情况；
- ps：输出进程下所有线程及CPU使用情况 `ps H -eo pid, tid, %cpu | grep [进程id]`
  
3、获取线程堆栈详情：`jstack [tid]`

- `jstack -l [PID] >/tmp/log.txt`输出到文件；

输出的线程详情中的nid，通常为十六进制，需要将tid换算成十六进制；
- `printf '%x\n' [pid]`：10进制转16禁止；


# Athas






