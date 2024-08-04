- [Bean的生命周期](#bean的生命周期)
  - [1. Bean的声明](#1-bean的声明)
  - [2. Bean的实例化和初始化](#2-bean的实例化和初始化)
    - [实例化](#实例化)
    - [提前暴露](#提前暴露)
    - [属性填充](#属性填充)
    - [初始化Bean](#初始化bean)
      - [前置处理](#前置处理)
      - [初始化](#初始化)
      - [后置处理](#后置处理)
  - [3. Bean的销毁](#3-bean的销毁)
- [IOC注入方式](#ioc注入方式)
- [Bean的三级缓存](#bean的三级缓存)
  - [循环依赖](#循环依赖)
  - [解决循环依赖](#解决循环依赖)
  - [三级缓存的必要性](#三级缓存的必要性)
- [Spring Bean](#spring-bean)
  - [Bean的注入方式](#bean的注入方式)
  - [Spring Bean的作用域](#spring-bean的作用域)
  - [Spring Bean线程安全问题](#spring-bean线程安全问题)
  - [从IOC中获取Bean](#从ioc中获取bean)
- [FactoryBean和BeanFactory](#factorybean和beanfactory)

传统开发，开发者自己创建对象、管理对象；

Spring的IOC容器可以统一管理对象，对象的创建、管理、销毁等整个生命周期交给Spring；

思想是：工程模式 + 反射机制；

本质是一个哈希表存放对象；


# Bean的生命周期

主流的框架都是通过生命周期钩子函数，来对程序功能进行扩展；

Spring也不例外，bean的生命周期就是：在创建、实例化、初始化Bean的基础上，通过Spring的一系列生命周期钩子方法，对Bean进行增强；

## 1. Bean的声明
1、首先开发者需要向Spring提供**Bean的声明**；告知要将哪些Bean注入到Spring容器中；一般的方式有：
- xml声明
- 注解声明

Spring将这些声明加载并封装为：`BeanDefinition` 对象；

此对象定义了Bean的元数据信息、含有的依赖、bean的工程、初始化、销毁方法等等；
```java
private Boolean lazyInit;        // 是否懒加载
private String[] dependsOn;      // 依赖
private volatile Object beanClass; // beanClass对象
private String initMethodName;   // 初始化方法
private String destroyMethodName;// 销毁方法
private String factoryBeanName; // factory
```
## 2. Bean的实例化和初始化

入口：`doCreateBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)`

### 实例化

Spring按照`BeanDefinition`开始创建Bean对象

调用：`createBeanInstance(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)`方法；

判断当前Bean是否有工厂方法、是否有指定的构造函数等；如果都没有，则使用反射通过无参构造函数创建Bean的空对象；

### 提前暴露

```java
boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences && isSingletonCurrentlyInCreation(beanName));
```

### 属性填充

调用：`populateBean(String beanName, RootBeanDefinition mbd, @Nullable BeanWrapper bw)`完成属性填充；

中间遇到依赖Bean，则
填充用户定义的依赖、属性，并扫描Bean实现的Aware接口，回调Aware方法；

如果Bean需要从Spring上下文中获取一些基础设施信息，实现对应的Aware：
- BeenNameAware：获取Beanname；
- ApplicationContextAware：如果Bean要获取ApplicationContext对象；
- BeanClassLoaderAware：获取Bean的类加载器；
- EnvironmentAware：获取环境配置信息等；

### 初始化Bean

调用：`initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd)`

```java
protected Object initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd) {
  // 调用bean实现的Aware方法
  invokeAwareMethods(beanName, bean);
  
  // 执行bean的前置处理(如果有)
  wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
  
  // 执行初始化方法(如果有)
  invokeInitMethods(beanName, wrappedBean, mbd);

  // 执行bean的后置处理(如果有，SpringAOP在这里执行)
  wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
  
  return wrappedBean;
}
```

#### 前置处理

执行`BeanPostProcessor`中`postProcessBeforeInitialization()`

`PropertyPlaceholderConfigurer`：XML中的占位符，在前置处理中替换为值；

@PostConstruct在前置处理后执行；

#### 初始化

1、执行实现 InitializingBean 接口的`afterPropertiesSet()`方法(钩子函数)

2、执行用户自定义的`initMethod`初始化方法；

#### 后置处理
执行`BeanPostProcessor`中`postProcessAfterInitialization()`
- AnnotationAwareAspectJAutoProxyCreator在此处执行`wrapIfNecessary`完成代理对象的创建；

## 3. Bean的销毁

- 执行@PreDestroy注解标记的方法；属于一种钩子函数；类似于@PostConstruct

- 执行Bean实现的`DisposableBean`接口的`destroy()`方法；

- 用户自定义的销毁方法：Destroy


# IOC注入方式
三种方式：
- setter
- 构造器

# Bean的三级缓存

- 一级缓存：存放完全初始化的Bean的代理对象；
- 二级缓存：存放实例化完成，未完全初始化的Bean(根据需要也可以是代理对象)；
- 三级缓存：存放用于创建对象的工厂类；  


## 循环依赖
```java
public class A {
	B b;
}
public class B {
    A a;
}
```

描述循环依赖：

1、首先可以先初始化A，需要创建B对象；

2、然后实例化B对象，又去找A对象，A还没有实例化完成；

## 解决循环依赖
循环依赖问题就在于：**是否可以使用一个未初始化完成的对象，因此spring也无法解决完全构造器初始化的循环依赖**；

如果可以直接使用**没有初始化完成的的对象**，进行注入，就不存在循环依赖问题了；

所以解决循环依赖的本质是：**提前暴露对象**；

Spring如何解决：**将实例化和初始化分开进行，通过一级缓存、二级缓存、三级缓存来分开存储不同阶段的对象**；

同时使用多个缓存，也是为了区分开普通对象和代理对象；二者不能同时存在，因为不能同名；

Spring中：
1、实例化对象时，优先将其对象工厂放入三级缓存；再进行实例化，实例化完成，则删除三级缓存工厂，放入二级缓存；

2、属性填充时，如果有依赖的Bean，就从缓存中查询，则去创建依赖Bean；
- 如果一级缓存有，则直接注入；
- 如果二级缓存有，则直接注入；
- 如果三级缓存有，则通过三级缓存中存放的工厂，获取依赖bean，注入，并将其放入二级缓存，删除三级缓存的工厂；

3、初始化完成后，将此Bean放入一级缓存；

开始实例化，先将工厂放入三级缓存；(这个步骤是针对可能创建代理对象)

只要实例化完成，则放入二级缓存；

只要初始化完成，则放入一级缓存；

## 三级缓存的必要性

三级缓存并不是为了解决循环依赖，而是为了能够创建代理对象；

# Spring Bean

1、Spring的单例Bean不是线程安全的；

## Bean的注入方式

1、使用@Configuration与@Bean注解

2、使用@Controller、@Service、@Repository、@Component 注解标注该类，然后启用@ComponentScan自动扫描；

3、@Import
## Spring Bean的作用域

**singleton**：单例Bean，同名的bean只有一个；同类型可以有多个不同名的Bean在容器中；
- 如果存在带**有状态的成员变量**，则非线程安全；

**prototype**

**request**

**session**

**global-session**

## Spring Bean线程安全问题

SpringBean默认单例模式，且Spring没有对单例Bean进行多线程封装处理；

实际业务中，Bean是否线程安全，要看Bean是否有状态：

1、大部分场景下SpringBean都是以无状态的方式使用，如DAO类；

在这种场景下Bean是线程安全的；

2、如果Bean业务上存在状态，需要自行维护线程安全性问题；如：
- 改变作用域为prototype，隔离线程间的Bean；
- 使用ThreadLocal，在公用一个Bean的情况下，隔离线程间的数据；空间换时间；
- 使用锁，进行同步；


## 从IOC中获取Bean

@Autowired：优先按照类型（byType）装配依赖对象的,但是存在多个类型⼀致的bean，⽆法通过byType注⼊时，就会再使⽤byName来注⼊，如果还是⽆法判断注⼊哪个bean则会UnsatisfiedDependencyException

@Resource：优先按照byName来装配，如果找不到bean，会⾃动byType再找⼀次。
# FactoryBean和BeanFactory

相同点：都是用来创建对象的；

不同点：
- BeanFactory是IOC容器的根接口，用于为IOC容器提供一套完整的DI规范；遵守SpringBean的生命周期，一般用户是不需要关注的，也是无法干预的，只能为其提供BeanDefinition，具体创建还是交给Spring的；
- FactoryBean是为用户提供的；如果想要自己控制创建对象的过程，并希望放入IOC容器里，就可以实现BeanFacotry，实现`T getObject()`方法即可；