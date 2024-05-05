# 代理

本质是：创建新的对象，替换原有的对象，在执行原对象方法的前后，对其进行增强；

## 代理原理

```java
class A {
    B b;
    void function(){
        b.func();
    }
}
```

原始对象A，调用对象B的方法，如何能够不动原来的代码，用另一个`代理对象C`来替换掉`b对象`呢？

- 继承：`C继承B`，就能够把B对象替换成C对象，原来的代码不需要改；

- 接口：B是一个接口，`c`和`b`都实现了B接口，c可以通过多态替换掉b；

## 代理方式

- 静态代理：AspectJ静态代理框架；编译器修改`.class`文件，完成替换；

- 动态代理：`.class`文件不改变，进行对象创建时，完成替换；

  - JDK动态代理：JDk原生代理方式；需要被代理类实现接口；因为JDK创建代理类需要继承Proxy，因为Java单继承继承的位置已经被占了，所以要求必须要被代理类实现接口；

  - Cglib动态代理；第三方代理；只需要类是可继承的，需要创建子类完成替换；

## 代理效率

静态代理：性能高，功能强，复杂度高；运行时不需要额外处理；

动态代理：性能差，但是简单易用；

# AOP理解

在开发过程中，经常存在**通用功能**，可以单独实现，在业务逻辑中调用，但是通常这些通用功能与业务无关，对业务带有侵入性；

可以使用SpringAOP实现通过切面，单独实现通用功能，再通过注解的方式，无侵入地对方法进行增强；

SpringAOP使用动态代理的方式，在将Bean添加到IOC容器时，创建代理对象，替换掉原来的对象，来实现；

AOP就是基于这种行为，从另一个角度实现代理，可以进一步简化代理的开发复杂度，降低代码的耦合度；

# AOP执行过程

1、在IOC容器创建Bean的过程中，执行到Bean的后置处理部分，如果bean是需要进行代理的，在其beanPostProcessor中，会存在`AbstractAutoProxyCreator`对象；

2、`AbstractAutoProxyCreator`是自动代理的抽象类，有多种实现，用来处理不同的代理方式；

- 其中`AnnotationAwareAspectJAutoProxyCreator`完成使用注解代理的对象的创建；

```java
// AbstractAutoProxyCreator通过此方法完成代理创建
public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
    if (bean != null) {
        Object cacheKey = getCacheKey(bean.getClass(), beanName);
        if (this.earlyProxyReferences.remove(cacheKey) != bean) {
            // 创建代理对象
            return wrapIfNecessary(bean, beanName, cacheKey);
        }
    }
    return bean;
}

protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
    // 获取bean的所有Advisor
    Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
    
    if (specificInterceptors != DO_NOT_PROXY) {
        // Advisor存在，则创建代理，返回代理对象，替换原对象；
        this.advisedBeans.put(cacheKey, Boolean.TRUE);
        Object proxy = createProxy(
                bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
        this.proxyTypes.put(cacheKey, proxy.getClass());
        return proxy;
    }

    // 如果Advisor都为null，则不需要代理，返回原bean
    this.advisedBeans.put(cacheKey, Boolean.FALSE);
    return bean;
}
```

3、创建代理对象的过程，是先生成一个`ProxyFactory`代理创建工厂，代理工厂会选择一个`AopProxy`实现，来完成代理的创建；

```java
public interface AopProxy {

    Object getProxy();

    Object getProxy(@Nullable ClassLoader classLoader);
}
```

`AopProxy`是AOP的顶层接口，有两个实现：

- `CglibAopProxy`：如果是Cglib动态代理，则调用：`CglibAopProxy.getProxy()`

- `JdkDynamicAopProxy`：如果是JDK动态代理，则调用：`JdkDynamicAopProxy.getProxy()`

4、选择动态代理：

**SpringBoot2.x之后默认使用Cglib动态代理**，除非实现接口，并且明确`@EnableAspectJAutoProxy(proxyTargetClass = false)`；才会使用JDK动态代理；**原因就是Cglib可以使用所有场景的代理，JDK必须要实现接口；**

`ProxyFactory`调用`createAopProxy`来选择动态代理：

```java
// ProxyFactory调用createAopProxy来选择动态代理；
public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (!NativeDetector.inNativeImage() &&
            (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config))) {
        
        if (targetClass.isInterface() || Proxy.isProxyClass(targetClass) || ClassUtils.isLambdaClass(targetClass)) {
            return new JdkDynamicAopProxy(config);
        }
        // 否则使用Cglib动态代理
        return new ObjenesisCglibAopProxy(config);
    }
    else {
        // 实现了接口，使用JDK动态代理
        return new JdkDynamicAopProxy(config);
    }
}
```

5、选择了动态代理方式后，执行`CglibAopProxy.getProxy()`或者`JdkDynamicAopProxy.getProxy()`完成代理的创建；

6、最后，Bean的后置处理返回一个代理对象，替换掉原来的对象；完成了代理；

# 选择代理方式

1、强制使用Cglib：`@EnableAspectJAutoProxy(proxyTargetClass = true)`

# 多个切面执行顺序

1、切面实现`Ordered接口`，实现`getOrder()`方法，`order值`越小，执行优先级越高；

2、切面使用`@Order(1)` 注解标记；

3、Xml文件中，指定切面的order；