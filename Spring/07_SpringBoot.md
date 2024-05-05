

# SpringBoot处理请求流程

1、Tomcat接收请求，由`ApplicationFilterChain`执行所有的Filter；

3、Filter全部执行完成，执行`servlet.service()`调用Spring的DispatcherServlet，预处理并封装请求；
- Spring的DispatcherServlet继承自Java的HttpServlet；
- HttpServlet是Java的Http框架，负责封装Http请求响应；
- 请求封装为：HttpServletRequest，提供获取Http请求信息的方法、上下文等；

4、DispatcherServlet会调用：doDispatch(request, response)来对请求进行处理；

5、前置处理：`applyPreHandle`：在这里判断并执行`interceptor.preHandle()`；

6、通过`RequestMappingHandlerAdapter`，获取映射到的Controller方法，获取对应的Bean，反射调用，执行业务代码；

7、对处理结果进行处理，

8、后置处理：`applyPostHandle`：在这里判断并执行`interceptor.postHandle()`；

9、回到Filter，最终响应；