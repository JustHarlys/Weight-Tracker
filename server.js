import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

const dbConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE,
    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
    }
};

sql.connect(dbConfig, (err) => {
    if (err) {
        console.log('Error conecting to the database', err)
        return;
    }
    console.log('connected to database')
});

app.post('/saveWeight', async(req, res) => {
    const {weight, date, comment} = req.body;
    const query = 'INSERT INTO weight_tracker (weight, date, comment) VALUES (@weight, @date, @comment)';

    try {
        const request = new sql.Request();
        request.input('weight', sql.Float, weight);
        request.input('date', sql.NChar, date);
        request.input('comment', sql.VarChar, comment);

        await request.query(query);
        res.send('Weight data inserted');
    } catch (err) {
        console.error('SQL Error',  err);
        res.status(500).send('Error inserting data');
    }
});

app.get('/getWeight', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM weight_tracker`;
        res.json(result.recordset);
    } catch (err) {
        console.log('SQL Error', err);
        res.status(500).send('Error fetching data');
    }
});

app.put('/updateWeight/:id', async (req, res) => {
    const { id } = req.params;
    const {weight, date, comment } = req.body;
    const query = 'UPDATE weight_tracker SET weight = @weight, date = @date, comment = @comment WHERE id = @id';

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        request.input('weight', sql.Float, weight);
        request.input('date', sql.NChar, date);
        request.input('comment', sql.VarChar, comment);

        await request.query(query);
        res.send('Weight Data Updated');
    } catch (err) {
        console.log('SQL Error', err);
        res.status(500).send('Error Updating Data');
    }
});

app.delete('/deleteWeight/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM weight_tracker WHERE id = @id';

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);

        await request.query(query);
        res.send('Weight data deleted');
    } catch (err) {
        console.log('SQL Error', err);
        res.status(500).send('Error Deleting Data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
