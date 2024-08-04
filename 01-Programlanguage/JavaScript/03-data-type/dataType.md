# Primitive Data Type
- Numbers
- Strings
- Boolean
- Null
- Undefined
- Symbol

1. Primitive Data Type variables are immutable.

```JavaScript
let book = "Awsome JavaScript"
book[0] = 'a'
console.log(book) // "Awsome JavaScript"
```

2. Primitive Data Type variables are compared by values.

```javascript
let numOne = 1
let numTwo = 2

console.log(numOne == numTwo)  // false

let js = 'JavaScript'
let py = 'Python'

console.log(js == py)             //false
```

3. Undefiened: If a variable is created and not assign a value, the variable's value will be Undefined.

```javascript
let name;
console.log(name);  // undefined
```




# Non-Primitive Data Type(Reference Types)
- Object
- Array

1. Non-Primitive data types are mutable.

```javascript
let nums = [0, 1, 2]
nums[0] = 4
console.log(nums) // [4, 1, 2]
```

2. Non-Primitive data types are not compared by values. Even if two non-primitive data types have the same properties and values, the are not strictly equals.

```javascript
let nums1 = [0, 1, 2]
let nums2 = [0, 1, 2]
console.log(nums1 == nums2) // false
```
```javascript
let user1 = {
    name: "Abert",
    age: 17
}
let user2 = {
    name: "Abert",
    age: 17
}
console.log(user1 == user2) // false
console.log(user1 == user1) // true
```

3. Do not compare arryas, objects, functions. Non-primitive data types are reference types. The are compared by reference instead of values.









