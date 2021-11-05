const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");
const db = require('./database');
const PORT = process.env.PORT || 2001;


//MIDDLEWARE
app.use(cors());
app.use(express.json());

//app.use(express.static(path.join(__dirname, "client/build")))
//npm run build
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")))
}

console.log(__dirname);
console.log(path.join(__dirname, "client/build"));

//ROUTES

//GET ALL TODOS
app.get('/todos', async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM todo');
        res.json(response.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//GET ONE TODO
app.get('/todos/:id', async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM todo WHERE id=$1', [req.params.id]);
        res.json(response.rows)
    } catch (err) {
        console.error(err.message);
    }
});

//CREATE TODO
app.post('/todos', async (req, res) => {
    try {
        const response = await db.query('INSERT INTO todo (description) VALUES($1) RETURNING *', [req.body.description]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//UPDATE TODO
app.put('/todos/:id', async (req, res) => {
    try {
        const response = await db.query('UPDATE todo SET description=$1 WHERE id=$2', [req.body.description, req.params.id]);
        res.json('todo has been updated.');
    } catch (err) {
        console.error(err.message);
    }
});

//DELETE TODO
app.delete('/todos/:id', async (req, res) => {
    try {
        const response = await db.query('DELETE FROM todo WHERE id=$1', [req.params.id]);
        res.json('todo has been removed');
    } catch (err) {
        console.error(err.message);
    }
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
})

//LISTEN ON PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});