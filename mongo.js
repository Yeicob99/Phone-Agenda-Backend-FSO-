//las librerias que vamos a utilizar
require('dotenv').config()
const mongoose = require('mongoose')

//leer la variable secreta que definimos en el archivo .env
const url = process.env.MONGODB_URI

//conectar a la base de datos
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//definir el esquema de la base de datos (primero esto y luego el modelo)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
//crear el modelo 

const Person = mongoose.model('Person', personSchema)

//revisara los argumentos que se pasan por consola

if (process.argv.length === 2) {
  // Mostrar todas las personas si solo se pasó `node mongo.js`
  console.log('📖 Agenda Telefónica:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} - ${person.number}`)
    })
    mongoose.connection.close()
  }) 
} else if (process.argv.length === 4) {
  // Si se pasan nombre y número, agregar a la base de datos
  const name = process.argv[2]
  const number = process.argv[3]
  
  const person = new Person({ name, number })
  
  person.save().then(() => {
    console.log(`Agregado: ${name} - ${number}`)
    mongoose.connection.close()
  })
} else {
  console.log('⚠️ Uso correcto:')
  console.log('Para agregar: node mongo.js "Nombre" "Número"')
  console.log('Para listar: node mongo.js')
  mongoose.connection.close()
}