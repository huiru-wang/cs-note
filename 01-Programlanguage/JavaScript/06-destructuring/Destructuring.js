const fullStack = [
    ['HTML', 'CSS', 'JS', 'React'],
    ['Node', 'Express', 'MongoDB']
]
const [frontEnd, backEnd] = fullStack

console.log(frontEnd) // [ 'HTML', 'CSS', 'JS', 'React' ]
console.log(backEnd) // ['Node', 'Express', 'MongoDB']


const names = ['Asabeneh', 'Brook', 'David', 'John']
let [, secondPerson, , fourthPerson] = names

console.log(secondPerson, fourthPerson)


// ============== spread ===============
const fullStack2 = [...frontEnd, ...backEnd]

console.log(fullStack2)


// ============= Spread operator to copy object ===========
const user = {
    name: 'Asabeneh',
    title: 'Programmer'
}

const copiedUser1 = { ...user } // deep clone

const copiedUser2 = { ...user, name: 'Eyob' } // deep clone and modify the properties

