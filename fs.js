const fs = require('fs')

// data to be written to new file (bob.json)
let bob = {
  age: 50
}

// write the file data to the file (bob.json)
fs.writeFile('bob.json', JSON.stringify(bob), (err) => {
  console.log('write new file complete', err)
})

// read bob.json and log the data (age)
fs.readFile('./bob.json', 'utf-8', (err, lemon) => {
  let lime = JSON.parse(lemon)
  console.log(lime.age, err)
})

// read data (city) from  data.json file in directory
const city = require('./data.json')
console.log(city.city)
