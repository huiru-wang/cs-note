
let productColors = ["red", "blue"]
console.log(productColors) //["red", "blue"]

productColors[0] = 41
console.log(productColors) // [41, 'blue']


// ============== split ==============
const charsInJavaScript = "JavaScript".split('') // ["J", "a", "v", "a", "S", "c", "r", "i", "p", "t"]


// ============== Getting index an element in arr array ==============
const index = charsInJavaScript.indexOf('a')
if (index === -1) {
    // not exist
} else {
    console.log(index)  // 1
}

const lastIndex = charsInJavaScript.lastIndexOf('a') // 3

// ============== Slice: [start, end), return a new array ================
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.slice(1, 4)) // [2, 3, 4] 


// ============= PUSH: add item to the end of the array ===============
const arr = ['item1', 'item2', 'item3']
arr.push('new item')

// ============= POP: remove the end element =============a
arr.pop()  // ['item1', 'item2', 'item3']


// ============= shift: remove the first element =============
arr.shift()
console.log(arr)

// ============= unshift: add item to the start of the array =============
arr.unshift('new item')
console.log(arr)


// ============= reverse ==============
numbers.reverse()
console.log(numbers)

// ============= join ==============

// ============= sort ==============
