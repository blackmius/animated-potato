const mysql = require('mysql2');
const express = require('express');

const app = express();
app.use(express.json());

const pool = mysql.createPool({ host:'localhost', user: 'root', database: 'test' });

app.post('/q', async (req, res) => {
    const promisePool = pool.promise();
    const result = await promisePool.execute(req.body[0], req.body[1]);
    res.json(result);
});

const port = 8000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
