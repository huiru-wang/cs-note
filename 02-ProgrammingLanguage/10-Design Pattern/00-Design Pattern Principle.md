# 1. The Single Responsibility Principle

- 类、接口、方法都应只具备<font color="#de7802">一个职责</font>；
- 需要承担多个职责，就需要进行拆分；

最简单的例子：禁止使用`saveOrUpdate`，这种包含多种语义的方法，承担过多的职责；
将`saveOrUpdate`分离为`create`和`update`
- 可以强制让外部调用方清楚自己的行为，并作出对应的调用；这种看似简单的行为，往往能够避免很多意外；
- 也可以让内部的错误处理更加清晰，`create`错误就返回创建相关的错误，`update`也是一样；

这只是一个简单的例子，如果是一个复杂业务，如果不能尽量做到单一职责，往往会使业务复杂度更高，更<font color="#de7802">难以维护</font>，让<font color="#de7802">代码复用</font>的难度大大增加；

# 2. The Open-Close Principle

- <font color="#de7802">对扩展开放</font>
- <font color="#de7802">对修改关闭</font>

要做到开闭原则，必要要求业务的抽象程度较高，对后续业务的每个扩展点都很清楚，才能设计出一个符合开闭原则的代码架构；



# 3. Dependence Inversion Principle

- <font color="#de7802">依赖抽象，不依赖实现</font>
- 高层模块不应该依赖底层模块

最简单的例子：领域层仅依赖Mapper接口，而不直接依赖底层存储层；如此下层存储更换，只需要实现相同的Mapper，领域层对此无需感知；





