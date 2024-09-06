// ==================== Unlimited Number of Arguments Function ====================

// A function declaration provides a function scoped arguments array3
// Any thing we passed as argument in the function can be accessed from arguments object inside the functions
function sumByRegularFunction() {
    let sum = 0
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i]
    }
    return sum
}

const sumByArrowFunction = (...args) => {
    let sum = 0
    for (const num of args) {
        sum += num
    }
    return sum
}

let res = sumByArrowFunction(1, 2, 3, 4)
console.log(res)



// ============ Higher Order Function ==============
// Higher order functions are functions which take other function as a parameter or return a function as a value.
// The function passed as a parameter is called callback.
const arr = [1, 2, 3, 4]

// builtin-method: forEach, map, filter, reduce, find, every, some, sort, splice
arr.forEach(item => console.log(item))
arr.forEach((item, index, arr) => console.log(item, index, arr))

const numbersSquare = arr.map((num) => num * num)
console.log(numbersSquare)

const arr1 = [1, 2, 3, 4]
arr1.splice(1)
console.log(arr1)


