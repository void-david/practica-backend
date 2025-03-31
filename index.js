const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const port = 3000

// Middleware to parse JSON
app.use(express.json())

const db = new sqlite3.Database('./db.sqlite3')

// Create the 'main' table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS main (name TEXT, lastname TEXT)')
})

// POST route to insert data into the 'main' table
app.post('/main', (req, res) => {
  const { name, lastname } = req.body

  if (!name || !lastname) {
    return res.status(400).send('Name and lastname are required')
  }

  const stmt = db.prepare('INSERT INTO main (name, lastname) VALUES (?, ?)')
  stmt.run(name, lastname, function (err) {
    if (err) {
      console.error(err.message)
      return res.status(500).send('Failed to insert data')
    }
    res.status(201).send(`Data inserted with rowid: ${this.lastID}`)
  })
  stmt.finalize()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})