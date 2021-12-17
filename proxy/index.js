const mysql = require('mysql2');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('combined'));

const pool = mysql.createPool({ host:'mysql', user: 'root', password: 'root', database: 'apteka' });

app.post('/q', async (req, res) => {
    try {
        const promisePool = pool.promise();
        const [rows, buf] = await promisePool.execute(req.body[0] || '', req.body[1] || []);
        res.json(rows);
    } catch(e) {
        res.status(400);
        res.json(e);
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
