const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const markdown = require('markdown');

const express = require('express');
const app = express();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/uploader/', (req, res) => {
    let filename = new Date().getTime();
    let md = req.body.markdown;
    fs.writeFileSync(path.join(__dirname + `/markdown/${filename}.md`), req.body.markdown);
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption)
    .then(client => {
        console.log('connected successfully to server');
        const db = client.db('markdown');
        let document = {
            filename: filename,
            title: md.split(/\r\n|\n/)[0].replace(/#\ /, ''),
            timestamp: md.split(/\r\n|\n/)[1],
            description: md.split(/\r\n|\n/)[3].slice(0,10)
        };
        db.collection('article').insertOne(document, (err, res) => {
            if(err) throw err;
            client.close();
        });
    })
    .catch(err => {
        console.error(err);
    });
});
app.get('/list/', (req, res) => {
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption)
    .then(client => {
        const db = client.db('markdown');
        db.collection('article').find().toArray()
        .then(documents => {
            console.log(documents);
            res.send(JSON.stringify(documents));
            client.close();
        })
        .catch(err => {
            console.error(err);
        })
    });
});
app.post('/getArticle/', (req, res) => {
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption)
    .then(client => {
        const db = client.db('markdown');
        db.collection('article').find({'_id': mongodb.ObjectId(req.body._uid)}).toArray()
        .then(document => {
            const file = fs.readFileSync(path.join(__dirname + `/markdown/${document[0].filename}.md`), {encoding: 'utf-8'});
            const output = markdown.markdown.toHTML(file);
            res.send(JSON.stringify({dom: output}));
            client.close();
        })
        .catch(err => {
            console.error(err);
        });
    });
});

app.use(express.static(path.join(__dirname + '/public/')));
app.listen(8000);