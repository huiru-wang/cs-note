# go env

```shell
# 查看环境变量
go env

# 开启go mod
go env -w GO111MODULE=on

# 设置代理
go env -w GOPROXY=https://goproxy.cn

# 关闭包验证
go env -w GOSUMDB=off
```

# go build

在项目目录下直接编译，默认可执行文件为项目名：

```shell
# 默认编译项目
go build

# 编译指定文件
go build main.go
```

指定编译后输出的文件名：

```shell
go build -o [文件名]
```

## 执行linux编译

指定编译为linux下的可执行文件：

```shell
go env -w GOOS=linux
go env -w GOARCH=amd64
go build
```

## 最小化编译

编译后二进制文件，默认包含调试信息，排除调试信息编译，缩小二进制文件体积：

```shell
go build -o [文件名] -ldflags "-w -s"
```

## 逃逸分析

```shell
go build -gcflags="-m" main.go
```

