const express = require('express');
const firebase = require('firebase-admin');
const serviceAccountKey = require('./serviceAccountKey.json');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
    databaseURL: 'https://blogapp-c6c40.firebaseio.com/'
});

const dbPosts = firebase.database().ref('posts');
let dbPostsData;

dbPosts.on('value', snapshot => {
    dbPostsData = snapshot.val();
}, error => {
    console.log('Error while reading posts from database ' + error);
});

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
    response.send(Object.values(dbPostsData));
});

app.get('/api/posts/:id', (request, response) => {
    const postId = request.params.id;
    const post = dbPostsData[postId];

    console.log('GET [posts/id]. Requested ID: ' + postId);
    
    if (!post) {
        response.status(404).send(`Post with ID ${postId} doesn't exist!`);
        return;
    }

    response.send(post);
});

app.post('/api/add-post', (request, response) => {
    console.log('POST [add-post] Request data: ' + JSON.stringify(request.body));
    dbPosts.push(request.body);
    response.send(request.body);
});

app.put('/api/update-post/:id', (request, response) => {
    // @TODO: implement this
});

app.delete('/api/delete-post/:id', (request, response) => {
    // @TODO: implement this
    // if you're going to imeplemnt this then add 'active' field for logical deleting
});

app.listen(port, () => {
    console.log(`Listening to port ${port}. URL: http://localhost:${port}`);
});