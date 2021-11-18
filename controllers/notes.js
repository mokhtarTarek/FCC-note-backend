/**
 * The router is in fact a middleware,
 * that can be used for defining "related routes" (notes) in a single place,
 * that is typically placed in its own module
 */
const notesRouter = require("express").Router(); //create router obj
const User = require("../models/user");
const Note = require("../models/note");
const jwt = require("jsonwebtoken");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

//helper
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  }
  return null;
};

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  //The object decoded from the token
  //contains the username and id fields
  const user = await User.findById(decodedToken.id);

  //add userId to notes collection
  // const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  //add noteId to the users collection
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.json(savedNote);

  /**
   *The catch block simply calls the next function,
    which passes the request handling to the error 
    handling middleware.
   */
});

notesRouter.delete("/:id", async (request, response) => {
  // try {
  //   await Note.findByIdAndRemove(request.params.id)
  //   response.status(204).end()
  // } catch (exception) {
  //   next(exception)
  // }

  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
