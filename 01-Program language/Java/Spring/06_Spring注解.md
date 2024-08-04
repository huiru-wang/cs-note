- [@Resource/@Autowire/@Inject](#resourceautowireinject)
- [@Mapper/@Repository](#mapperrepository)
- [@Component/@Bean/@Service/@Repository](#componentbeanservicerepository)
- [@PostConstruct](#postconstruct)
- [@RequestParam](#requestparam)

# @Resource/@Autowire/@Inject
1、提供方不同：@Autowire由Spring提供；@Resource、@Inject是Java提供的JSR250规范注解；
2、注入方式不同：@Autowire通过类型注入(byType)
  @Resource、@Inject通过名称注入(byName)；
3、装配方式：@Autowire当类型相同，可以结合@Qualifier进行Bean的区分;



# @Mapper/@Repository

`@Repository`需要额外配置Dao扫描地址；

`@Mapper`=`@Repository`+`@MapperScan`


# @Component/@Bean/@Service/@Repository

@Component：用于将Java类标记为SpringBean，由Spring扫描注入到IOC容器，交由Spring管理；

@Bean：用于将Java方法返回的对象注入到IOC容器；

@Service：@Component的特化，没有额外功能，语义上更适用于业务代码；

@Repository：@Component的特化，通常用于DAO层，但是@Repository允许非受检异常转为Spring DataAccessException



# @PostConstruct

1、@PostConstruct在Bean初始化之前执行；

2、然后Bean进行初始化(initalizeBean)

3、如果在xml中配置了，就继续执行init-method方法(已经很少用了)

- init-method通过反射执行，不允许有入参；

  

# @RequestParam

用于Get请求的参数映射

```java
public Response getUserInfo(@RequestParam(
                            required = true, 
                            defaultValue = "", 
                            value = "username") String username) {

    User user = userService.getUserByUserName(username);

    return ResponseUtil.success(user);

}

```






