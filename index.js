const express = require('express')
const morgan = require('morgan')
const corts = require('cors')
const app = express()
const path = require('path')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(corts())
app.use(morgan('tiny'))

app.use(express.static(path.join(__dirname, 'dist')))


morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})


//direccion info 
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      res.send(
        `<p>Phonebook has info for ${count} people</p>
           <p>${currentTime}</p>`
      )
    })
    .catch(error => {
      console.error('Error obteniendo info:', error.message)
      res.status(500).end()
    })
})


//funcion borrar
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end() // ✅ Persona eliminada
      } else {
        res.status(404).json({ error: 'Person not found' }) // ❌ No existe ese ID
      }
    })
    .catch(error => {
      console.error('Error eliminando:', error.message)
      res.status(500).end()
    })
})
  

//buscar uno especifico por id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

//solicitus http post
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }
  
  // 🔍 Verificar si ya existe una persona con ese nombre
  Person.findOne({ name: body.name })
    .then(existing => {
      if (existing) {
        return res.status(400).json({ error: 'Name must be unique' })
      }
  
      const person = new Person({
        name: body.name,
        number: body.number,
      })
  
      // 💾 Guardar en MongoDB
      person.save()
        .then(savedPerson => {
          res.status(201).json(savedPerson)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

//petición put

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const updatedPerson = {
    name,
    number,
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(updated => {
      res.json(updated)
    })
    .catch(error => next(error))
})



const PORT = 3001

const errorHandler = (error, req, res, next) => {
  console.error('❌ Error atrapado por middleware:', error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  
  next(error) // Pásalo a Express si no es nuestro error
}

app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})





