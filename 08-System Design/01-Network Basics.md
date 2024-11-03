How computers communicate with each other.
# IP

IP(Internet Protocol) is a network-layer protocol that identifies devices via unique IP address and provides a best-effort connectionless packet-delivery service to send data from the source device to the destination device.

> A unique identifier for each device on a network.

- IPV4: 32-bits, allows for approximately 4 billion (2<sup>32</sup>) unique address.
- IPV6: 128-bits, allows for approximately  2<sup>128</sup> unique address.

# TCP & UDP

## 1. TCP

TCP(Transmission Control Protocol): is a <font color="#de7802">connection-oriented</font> and <font color="#de7802">reliable</font> transport-layer protocol. It establishes a connection through a Three-way handshake to ensure that data can be accurately transmitted from the sender to the receiver.

> TCP是一个面向链接的、可靠的传输层协议，它通过3次握手建立链接，以确保数据可以准确的从发送方传输到接收方。

Three-way handshake

Four-way handshake

## 2. UDP

UDP(User Datagram Protocol): is a connectionless and unreliable transport-layer protocol. It doesn't require a connection when transmitting data and has a fast data-sending speed, but it can't ensure the orderly arrival and integrity of data.

UDP is faster, but less reliable than TCP.

> UDP是一个无连接、不可靠的传输层协议，它在传输数据时不需要建立链接，数据发送速度快，但不保证顺序到达和数据的完整性

UDP is better suited for time-sensitive communications, such as Video Call and Live Streaming services, where speed is crucial and some data loss is acceptable.


# DNS

DNS(Domain Name System): is an internet service that converts human-friendly domain names into IP Addresses. Just like an internet phone book.

>DNS是一个互联网服务，将人类友好的域名转换为IP

When you enter a URL in your browser, the browser sends a DNS query to find the corresponding IP address.

# HTTP & HTTPS

## 1. HTTP

HTTP (Hyper-Text Transfer Protocol): is an stateless application-layer protocol used for transmitting hyper-test such as web pages and transmits data in plaint text.

> HTTP是用于传输超文本（如网页）的应用层协议，采用明文传输数据。

### Reliable Transmission

#TODO


### HTTP Methods

Get: used for fetching data.
Post: used for creating data on a server.
Put/Patch: used for updating a record. 
Delete: used for removing a record from database.

### Status Code
2xx Success Code: indicate that the request was successfully received and processed.
> 2xx表明请求已被成功接收并处理
- 200 OK: The standard response for successful requests.
- 201 Created: Signifies that a new resource has been successfully created.
- 204 No Content: Indicates that the server successfully processed the request, but is not returning any content.

3xx Redirection Code: signify that further action needs to be take by the browser in order to fulfill the requests.
> 300系列提示浏览器需要一些额外操作才能满足请求
- 301 Moved Permanently: The URL of the requested resource has been changed permanently. The new URL is given in the response.
- 302 Found: Indicates that the resource is temporarily located at another URL.
- 304 Not Modified: Informs the client that the cashed version of the response is still valid and can be used.

4xx Client Error Code: 400 series indicate the requests contains bad syntax.
> 4xx表明请求包含语法错误无法被处理
- 400 Bad Request: The server cannot process the request due to a client error.
- 401 Unauthorized: Authentication is required for the requests to be completed.
- 403 Forbidden: The server understands the request but refuses to authorize it.
- 404 Not Found: The server can not find the resource.
- 429 Too Many Requests: The user has sent too many requests in a given amount of time( rate limiting )

5xx Server Error Code: 500 series indicate that something went wrong on the server.
> 5xx表示服务端存在问题
- 500 Internal Server Error.
- 501 Not Implemented: The server does not support the functionality required to fulfill the request.
- 503 Service Unavailable: The server is not ready to handle the request, often used the maintenance or overloaded servers.

## 2. HTTPS

HTTPS (Hyper-Text Transfer Protocol Secure) adds an SSL/TLS encryption layer on the basic of HTTP to ensure data security and privacy through encrypted transmission.

> HTTPS在HTTP的基础上加入SSL/TLS加密层，通过加密传输来保证数据安全和隐私


# WebSocket

WebSocket is a protocol for full-duplex communication over a single TCP connection, enabling bidirectional and real-time data transfer between the server and the client, and is widely used in scenarios such as instant chat application, stock market feeds and online games that require real-time interaction.

> WebSocket是一个建立在单个TCP链接上的全双工通信协议，允许服务器与客户端之间实现双向、实时的数据传输，广泛应用于即时通信、在线游戏等需要实时交互的场景

# RPC
[[04-Micro Service#RPC]]
RPC is a protocol that allows a program on one computer to execute code on a server or another computer. 
It is a method used to invoke a function as if it were a local call, when in reality, the function is executed on a remote machine.
It abstracts the details of the network communication, allowing the developer to interact with remote functions seamlessly as if they were local to the application.

> RPC是一个允许程序执行另一台服务器的代码的协议
> 它是一种函数调用协议，它抽象了网络通信细节，允许开发人员与远程功能无缝交互，就好像时应用程序本地的一样


# Others

## FTP

FTP (File Transfer Protocols): a standard protocol for file transfer over a network. It is based on the client-server model and supports file uploads and downloads.

## SSH

SSH (Secure Shell Protocol): is a network protocol mainly used for securely remotely logging into and managing devices such as servers in a unsecured network environment. It ensures the integrity and authentication and confidentiality of data transmission through an encryption mechanism.

> SSH网络协议用于在不安全的网络环境中安全地登录和管理服务器等设备，通过加密机制保证数据传输的完整性、认证性和保密性


## MQTT

MQTT (Message Queuing Telemetry Transport) is a lightweight, simple and efficient messaging protocol. It is frequently used in internet-of-things scenarios.

## AMQP

AMQP (Advanced Message Queuing Protocol) is a protocol for message-oriented middleware. Like RabbitMQ.

















