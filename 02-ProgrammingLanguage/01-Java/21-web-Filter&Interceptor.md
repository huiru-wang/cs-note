
# 实现方式

## Filter

在SpringBoot应用中实现Filter不需要`web.xml`
1. 实现`javax.servlet.Filter`接口；并增加@WebFilter注解；
2. 在SpringBoot中，增加：`@ServletComponentScan`注解扫描所有的@WebFilter；
3. 如果需要对Filter排序，则实现`Ordered`接口

```java
@WebFilter(filterName = "logFilter", urlPatterns = "/*")  
public class LogFilter implements Filter, Ordered {
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) {

	// 前置逻辑

	// 执行其他filter
	filterChain.doFilter(servletRequest, servletResponse);  

	// 后置逻辑
	
	}

	@Override  
	public int getOrder() {  
	    return 5;  
	}
}
```

Servlet在初始化时，根据path是否匹配，加载并排序所有的可用的Filter，并在Servlet处理请求之前，执行Filter链；
`org.apache.catalina.core.ApplicationFilterChain#internalDoFilter`




## Interceptor

主要作用于基于 Spring MVC 的 Web 应用程序，对 Spring 管理的控制器方法的请求进行拦截。一般不对静态资源进行拦截。

实现`org.springframework.web.servlet.HandlerInterceptor`接口，并在 Spring 的配置文件中进行配置。
```java
@Configuration  
public class InterceptorConfig implements WebMvcConfigurer {  
    
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        registry
	        .addInterceptor(new LogInterceptor())
	        .addPathPatterns("/**");  
    }  
}
```



# 何时使用
## Filter

1. 当需要对<font color="#de7802">所有</font>进入应用程序的请求进行通用处理，且<font color="#de7802">不依赖Spring框架特定功能</font>时；
2. 当需要对<font color="#de7802">静态资源</font>进行处理，如静态资源的权限控制；

## Interceptor

1. 当需要在Spring MVC中实现特定的<font color="#de7802">业务逻辑</font>的请求拦截时；使用Interceptor更好；
2. 需要依赖<font color="#de7802">Spring的特定功能</font>（AOP、事务管理）时，优先考虑Interceptor；

