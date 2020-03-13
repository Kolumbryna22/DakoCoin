const ideas = require('../src/ideas.js');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/proveIt/:idea', (req, res) => {
  const { idea } = req.params;

  ideas
    .proofNewIdea(idea)
    .then((idea) => {
      res.status(200).send('New idea added');
    })
    .catch((e) => {
      res.status(400).send('Failed to add new idea');
    });
});

app.get('/ideas', (req, res) => {
  ideas
    .getAllIdeas()
    .then((ideas) => {
      res.status(200).send(ideas);
    })
    .catch((e) => {
      res.status(400).send('Failed to fetch ideas');
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, (req, res) => {
  console.log(`Serwer is listening on port ${process.env.PORT || 8080} ...`);
});
