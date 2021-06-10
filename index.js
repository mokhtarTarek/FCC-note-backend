// imports Node's built-in web server module
const express = require('express')
const cors=require('cors')//cors middleware to allow access to this origin
//create express app
const app = express()

//########################costums middleswares#############
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//#########################################################

//middlewares are functions that handles request and response objects
//using json-parser middleware : to parse raw data
app.use(cors())
app.use(express.json());
app.use(requestLogger);
//app.use(unknownEndpoint)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
     id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]
  
const generatedId = ()=>{
    const maxId = notes.length > 0?
    //spread notes _id
    Math.max(...notes.map(n=>n.id))
    :0
    return maxId + 1 
}

app.get('/',(req,res)=>{
    res.send('<h1>hello fucking world</h1>')
})
app.get('/api/notes',(req,res)=>{
    res.json(notes)
})

app.get('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id)
    const note = notes.find(n=>n.id === id)
    if (note) {
    res.json(note)
    } else {
      res.status(404).end()  
    }
})

app.delete('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id)
    //re-assign the array
    notes = notes.filter(n=>n.id !== id)
    res.status(204).end();
})

app.post('/api/notes',(req,res)=>{
   
    if(!body.content){
        //calling return is crucial, otherwise the code will
        //executed till the end
         return res.status(400).json({
           error: 'content missing'
        })
    }   
    const note = {
        content: body.content,
        important: body.important || false ,
        date: new Date(),
        id: generatedId(),
    }
    
    notes = notes.concat(note)
    //console.log(note)
    res.json(note)

})


//middleware to catch request made for non existing routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`server running on port ${PORT}`)



//middleware : 

