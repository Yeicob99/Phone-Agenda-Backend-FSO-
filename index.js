const express = require('express');
const morgan = require('morgan');
const corts = require('cors')
const app = express();
const path = require('path');

app.use(express.json());
app.use(corts())
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'dist')));


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status - :response-time ms :body'));

const persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

//direccion info 

 app.get('/info', (req, res) => {
    const numContacts = persons.length;
    const currentTime = new Date();
    res.send(
        `<p>Phonebook has info for ${numContacts} people</p>
        <p>${currentTime}</p>
      ` )
});


//funcion borrar
app.delete('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const index = persons.findIndex(person => person.id === id);

    if (index !== -1) {
        persons.splice(index, 1); 
        res.status(204).end(); 
    } else {
        res.status(404).json({ error: `Person with ID ${id} not found` });
    }
});

//buscar uno especifico por id
app.get('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const person = persons.find(person => person.id === id); 

    if (person) {
        res.json(person); 
    } else {
        res.status(404).json({ error: `Person with ID ${id} not found` }); 
    }
});

//solicitus http post
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase());
    if (nameExists) {
        return res.status(400).json({ error: "Name must be unique" });
    }

    if (typeof body.name !== "string" || typeof body.number !== "string") {
        return res.status(400).json({ error: "Invalid data type: Name must be a string and number must be a string" });
    }

    const newID = Math.floor(Math.random() * 10000) + 1;

    const newPerson = {
        id: newID,
        name: body.name,
        number: body.number
    };

    persons.push(newPerson);

    res.status(201).json(newPerson);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//



