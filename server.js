const express = require("express");
const path = require("path");
const fs = require("fs");
const uuidv1 = require("uuidv1");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;

    let savedNotes = JSON.parse(data);
    res.json(savedNotes);
  });
});

app.post("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;

    let savedNotes = JSON.parse(data);
    let newNoteData = req.body;

    let makeId = uuidv1();

    newNoteData.id = makeId;

    savedNotes.push(newNoteData);

    let updateNote = JSON.stringify(savedNotes);

    fs.writeFile("./db/db.json", updateNote, (err) => {
      if (err) throw err;

      console.log("Note added");
      res.json(savedNotes);
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  const noteId = req.params.id;

  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;

    const savedNotes = JSON.parse(data);

    const newNoteArray = savedNotes.filter((note) => note.id !== noteId);

    const updateNewNote = JSON.stringify(newNoteArray);

    fs.writeFile("./db/db.json", updateNewNote, (err) => {
      if (err) throw err;
      res.json(savedNotes);
    });

    console.log("Note deleted");
  });
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening to PORT " + PORT);
});
