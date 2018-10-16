const MongoClient = require('mongodb').MongoClient;

let state = {
    db: null,
    dbName: null
};

exports.connect = (url, dbName, done) => {
    if (state.db)
        return done();

    MongoClient.connect(url, {useNewUrlParser: true}, (err, db) => {
        if (err)
            return done(err);
        state.db = db.db(dbName);
        console.log('db connected');
        done();
    })
};

exports.get = () => {
    return state.db;
};

exports.reloadFilmsCollection = (file) => {
    let db = require(file);
    let films = db.films;
    state.db.collection('films').drop(
        (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Collection is empty');
    });
    state.db.collection('films').insertMany(films, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Default data was loaded');
    });
};
