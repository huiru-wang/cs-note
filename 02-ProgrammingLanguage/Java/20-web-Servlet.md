
# Servlet何时加载

1、**首次请求时加载**

服务器会检查是否有匹配的 Filter 配置。如果有，服务器会加载并实例化这些 Filter，并调用它们的`init`方法进行初始化。然后，请求会依次通过 Filter 链，最终到达目标 Servlet。

2、**服务器启动时预加载（可选）**
