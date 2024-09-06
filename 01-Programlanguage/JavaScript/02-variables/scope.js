/**
 * var: function-scoped;
 * let: block-scoped; Can be reassigned.
 * cosnt: block-scoped and cannot be reassigned. Accturally can not be reassigned the reference. so you still can change the object's properties.
 * 
 * function level > block level
 * 
 * summary: use let and const instead of var keyword
 */

// ============= access variable before defined =============

console.log(accessVarTest)   // "undefined", means var variable 
var accessVarTest = "accessVarTest"

console.log(accessLetTest)   // cannot access
var accessLetTest = "accessLetTest"

console.log(accessConstTest)   // cannot access
const accessConstTest = "accessConstTest"


// ============ block level scope ============

if (true) {
    var varBlockTest = "varBlockTest"
}
console.log(varBlockTest) // "varBlockTest"

if (true) {
    let letTest = "varTest"  // only avalible in block scope that it defined
}
// console.log(letTest) // "letTest is not define"







