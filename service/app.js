const express = require('express');
const firebase = require('firebase-admin');
const serviceAccountKey = require('./serviceAccountKey.json');
const utils = require('./utils');

const app = express();
const port = process.env.port || 3000;

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
    databaseURL: 'https://blogapp-c6c40.firebaseio.com/'
});

const dbPosts = firebase.database().ref('posts');
let dbPostsData;

const dbReaders = firebase.database().ref('readers');
let dbReadersData;

const dbComments = firebase.database().ref('comments');
let dbCommentsData;

dbPosts.on('value', snapshot => {
    dbPostsData = snapshot.val();
}, error => {
    console.log('Error while reading posts from database ' + error);
});

dbReaders.on('value', snapshot => {
    dbReadersData = snapshot.val();
}, error => {
    console.log('Error while reading readers from database ' + error);
});

dbComments.on('value', snapshot => {
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

function getReadersName(id) {
    for (let key in dbReadersData) {
        if (key === id)
            return dbReadersData[key].name;
    }

    return "";
}

function getCommentsForPost(postId) {
    let comments = new Array();

    for (let key in dbCommentsData) {
        if (dbCommentsData[key].postId !== postId)
            continue;

        const readerName = getReadersName(dbCommentsData[key].readerId);
        const comment = {
            name: readerName,
            comment: dbCommentsData[key].text
        };

        comments.push(comment);
    }

    return comments;
}

app.get('/api/posts/:id', (request, response) => {
    const postId = request.params.id;
    const post = dbPostsData[postId];

    console.log('GET [posts/id]. Requested ID: ' + postId);
    
    if (!post) {
        response.sendStatus(400);
        return;
    }

    post.comments = getCommentsForPost(postId);
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

function readerExists(email) {
    for (let reader in dbReadersData) {
        if (dbReadersData[reader].email === email) {
            return reader;
        }
    }

    return false;
}

app.post('/api/add-comment', (request, response) => {
    let data = request.body;
    console.log('POST [add-comment] Request data: ' + JSON.stringify(data));
    
    if (!data.name || !data.email || !data.comment) {
        response.sendStatus(400);
        return;
    }

    let readerId = readerExists(data.email);
    console.log(readerId);
    if (readerId) {
        const comment = {
            postId: data.postId,
            readerId: readerId,
            text: data.comment
        };

        dbComments.push(comment);
    } else {
        const reader = {
            name: data.name,
            email: data.email
        }
    
        dbReaders.push(reader).then(snap => {
            const readerId = snap.key;
            const comment = {
                postId: data.postId,
                readerId: readerId,
                text: data.comment
            }
    
            dbComments.push(comment);
        });
    }

    response.send(data);
});

app.listen(port, () => {
    console.log(`Listening to port ${port}. URL: http://localhost:${port}`);
});