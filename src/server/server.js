const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app = express();

const url = 'mongodb://localhost:27017';
let dbName = 'db';
let reloadDB = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

process.argv.forEach((val, index) => {
    if (index === 2 && val === 'init')
        reloadDB = true;
    else if ((index == 2 || index == 3) && val)
        dbName = val;
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello API')
});

app.get('/films', (req, res) => {
    db.get().collection('films').find().toArray((err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
});

app.get('/films/:id', (req, res) => {
    //здесь должна быть ваша проверка id
    db.get().collection('films').findOne({_id: ObjectID(req.params.id)}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    });
});

app.post('/films', (req, res) => {
    let film = {
        title: req.body.title,
        year: req.body.year,
        director: req.body.director
    };
    db.get().collection('films').insertOne(film, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });
    res.sendStatus(200);
});

app.put('/films/:id', (req, res) => {
    db.get().collection('films').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set: {"title": req.body.title, "year": req.body.year, "director": req.body.director}},
        (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    );
});

app.delete('/films/:id', (req, res) => {
    db.get().collection('films').deleteOne(
        {_id: ObjectID(req.params.id)},
        (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    );
});

db.connect(url, dbName, (err) => {
    if (err)
        return console.log(err);
    //строка ниже заполнит коллекцию фильмов в базе данных значениями из файла db_init.json
    if (reloadDB)
        db.reloadFilmsCollection('./db_init');
    app.listen(3001, () => {
        console.log('API app started');
    });
});