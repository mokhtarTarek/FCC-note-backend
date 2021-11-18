const mongoose = require ('mongoose')


if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
  const password = process.argv[2]//We can access the command line parameter like this
  //password = 'Spartacus1986'
  const url2 ="mongodb://localhost:27017/playgroundDB"
  //const url =
  //`mongodb+srv://Spartacus1986:${password}@cluster0.j4qp7.mongodb.net/note-app?retryWrites=true&w=majority`
  
  //mongoose.connect(url2, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  mongoose.connect(url2,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true });
  
  const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
  })

 
  const Note = mongoose.model('Note', noteSchema)
  
  
  const note = new Note({
    content: 'using Monngose',
    date: new Date(),
    important: true,
  })
  
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })