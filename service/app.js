const express = require('express');
const firebase = require('firebase-admin');
const serviceAccountKey = require('./serviceAccountKey.json');
const dateTime = require('node-datetime');

const utils = require('./utils');
let Comment = require('./comment');
let Reader = require('./reader');

const app = express();
const port = process.env.port || 3000;
const datetime = dateTime.create();

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
    databaseURL: 'https://blogapp-c6c40.firebaseio.com/'
});

const database = firebase.database();
let dbPostsData;
let dbReadersData;
let dbCommentsData;

database.ref('posts').on('value', snapshot => {
    dbPostsData = snapshot.val();
}, error => {
    console.log('Error while reading posts from database ' + error);
});

database.ref('readers').on('value', snapshot => {
    dbReadersData = snapshot.val();
}, error => {
    console.log('Error while reading readers from database ' + error);
});

database.ref('comments').on('value', snapshot => {
    dbCommentsData = snapshot.val();
}, error => {
    console.log('Error while reading comments from database ' + error);
});

app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (request, response) => {
    response.send('Service works!');
});

app.get('/api/posts', (request, response) => {
    console.log('GET [posts]. Requested all posts.');
    const dataToSend = utils.createArrayFromObject(dbPostsData);
    response.send(dataToSend);
});

app.get('/api/posts/:id', (request, response) => {
    const postId = request.params.id;
    const post = dbPostsData[postId];

    console.log('GET [posts/id]. Requested ID: ' + postId);
    
    if (!post) {
        response.sendStatus(400);
        return;
    }

    post.comments = utils.getCommentsForPost(dbCommentsData, dbReadersData, postId);
    response.send(post);
});

app.post('/api/add-post', (request, response) => {
    let data = request.body;
    console.log('POST [add-post] Request data: ' + JSON.stringify(data));
    data.time = datetime.format('d.m.Y. H:M'); 
    database.ref('posts').push(request.body);
    response.send(data);
});

app.put('/api/update-post/:id', (request, response) => {
    // @TODO: implement this
});

app.delete('/api/delete-post/:id', (request, response) => {
    // @TODO: implement this
    // if you're going to imeplemnt this then add 'active' field for logical deleting
});

app.post('/api/add-comment', (request, response) => {
    let data = request.body;
    console.log('POST [add-comment] Request data: ' + JSON.stringify(data));
    
    if (!data.name || !data.email || !data.comment) {
        response.sendStatus(400);
        return;
    }

    const time = datetime.format('d.m.Y. H:M'); 
    let readerId = utils.readerExists(dbReadersData, data.email);

    if (readerId) {
        const comment = new Comment.Comment(data.postId, readerId, data.comment, time);
        database.ref('comments').push(comment);
    } else {
        database.ref('readers').push(new Reader.Reader(data.name, data.email)).then(snap => {
            const readerId = snap.key;
            const comment = new Comment.Comment(data.postId, readerId, data.comment, time);
            database.ref('comments').push(comment);
        });
    }

    response.send(data);
});

app.post('/api/register', (request, response) => {
    const user = request.body;
    console.log('POST [register] User: ' + user);

    // @TODO: implement this
});

app.post('/api/login', (request, response) => {
    // @TODO: implement this
});

app.listen(port, () => {
    console.log(`Listening to port ${port}. URL: http://localhost:${port}`);
});