
| {Rest}                         | GRpc | GraphQL |
| ------------------------------ | ---- | ------- |
| Stateless                      |      |         |
| Standard Http Methods          |      |         |
| Over-fetching / Under Fetching |      |         |
| JSON for data exchange         |      |         |


# Idempotent

A well-designed API should be idempotent which means calling it multiple times doesn't change the result, and it should always return the same result.

>一个良好的API需要满足幂等性，这意味着多次调用同一个方法，都应该返回相同的结果


# Pagination

Common queries also include limit and offset for pagination which allows users or the client to retrieve specific sets of data without overwhelming the system.

>通常查询方法需要包含limit和offset进行分页查询，以防止压垮系统


# Backward Compatibility

When modifying endpoints, it's important to maintain backward compatibility.
A common practice is to introduce a new version of API.

# Rate Limitation

Rate Limitation is used to control the number of requests a user can make in a certain time. It prevents a single user from sending too many requests to a single API.

# CORS

Control which domains can access your API, preventing unwanted cross-site interactions.





















