const http = require('http')
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
const app = http.createServer((req,res)=>{
    // res.writeHead(200,{'Content-type': 'text/plain'})
    // res.end('hello world')
    res.writeHead(200,{'Content-Type': 'application/json'})
    res.end(JSON.stringify(notes))
})
 
const PORT = 3002;
app.listen(PORT)
console.log(`server running on port ${PORT}`)
//##############################


const express = require("express");
const app = express();

require('dotenv').config()//must be imported before the Note model
const cors = require("cors"); //cors middleware allow access from others origins (ports)
const Note = require('./models/note')//import Note model

app.use(express.static("build"));//the request to the '/' route
//will be the static file in the build diretory
app.use(cors());
app.use(express.json());//this is a body parser

//########################costums middleswares#############
//middlewares are functions that handles request and response objects
//using json-parser middleware : to parse raw data
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);
//#########################################################

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

// app.get("/api/notes", (req, res) => {
//   res.json(notes);
// });

app.get("/api/notes", (req, res) => {
  Note.find({})
  .then(notes=>{
    res.json(notes)
  })
});


app.get("/api/notes/:id", (req, res,next) => {//next is a function
  // const id = Number(req.params.id);
  // const note = notes.find((n) => n.id === id);
  // if (note) {
  //   res.json(note);
  // } else {
  //   res.status(404).end();
  // }
  Note
  .findById(req.params.id)//return a promise (fullfield/rejected)
  .then(note=>{//event handler function (callback)
    if(note){
      res.json(note)
    }else{//if note is null
      res.status(404).end()//not found
    }
  })
  // .catch(error=>{//if the result of promise is rejected
  //   console.log(error)
  //   // res.status(500).end()//internel server error
  //   res.status(400).send({error:'malformated id'})//bad request
  // })
  .catch(error=>next(error))


});

app.delete("/api/notes/:id", (req, res,next) => {
  // const id = Number(req.params.id);
  // //re-assign the array
  // notes = notes.filter((n) => n.id !== id);
  // res.status(204).end();
  Note
  .findByIdAndRemove(req.params.id)
  .then(result=>{//fullfield
    res.status(204).end()
  })
  .catch(error=next(error))//rejected
});

// const generatedId = () => {
//   const maxId =
//     notes.length > 0
//       ? //spread notes _id
//         Math.max(...notes.map((n) => n.id))
//       : 0;
//   return maxId + 1;
// };

app.post("/api/notes", (req, res,next) => {
  const body = req.body;
  // if (!body.content) {
  if (body.content === undefined) {
    //calling return is crucial, otherwise the code will be
    //executed till the end
    return res.status(400).json({
      error: "content missing",
    });
  }
  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generatedId(),
  // };
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
  .save()//return promise
  .then(savedNote=>{//receive the obj(savedNote) returned by mongoose
    // res.json(savedNote)
    return savedNote.toJSON()
  })//then method of promise also return a promise
  .then(savedAndFormattedNote=>{
    res.json(savedAndFormattedNote)
  })
  .catch(error => next(error))

  // notes = notes.concat(note);
  // //console.log(note)
  // res.json(note);
});

app.put('/api/notes/:id',(req,res,next)=>{

  const body = req.body
  const note = {
    content: body.content,
    important: body.important
  }
Note
.findByIdAndUpdate(req.params.id,note,{new: true})
.then(updatedNote=>{
  res.json(updatedNote)
})
.catch(error=>next(error))

})


//middleware to catch request made for non existing routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

//middleware to handle errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

