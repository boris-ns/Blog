/* Creates array of objects from object of objects.
   Also adds new propery to object - id (key) */
function createArrayFromObject(data) {
    let newData = new Array();

    for (let key in data) {
        let obj = data[key];
        obj.id = key;
        newData.push(obj);    
    }

    return newData;
}

/* Checks if reader exists in the list by comparing emails. */
function readerExists(readers, email) {
    for (let reader in readers) {
        if (readers[reader].email === email) {
            return reader;
        }
    }

    return false;
}

/* Finds reader's name according to it's ID. */
function getReadersName(readersData, id) {
    for (let key in readersData) {
        if (key === id)
            return readersData[key].name;
    }

    return "";
}

/* Prepares all the comments for post with ID=postId. */
function getCommentsForPost(commentsData, readersData, postId) {
    let comments = new Array();

    for (let key in commentsData) {
        if (commentsData[key].postId !== postId)
            continue;

        const readerName = getReadersName(readersData, commentsData[key].readerId);
        const comment = {
            name: readerName,
            comment: commentsData[key].text,
            time: commentsData[key].time
        };

        comments.push(comment);
    }

    return comments;
}

module.exports = {
    createArrayFromObject: createArrayFromObject,
    readerExists: readerExists,
    getCommentsForPost: getCommentsForPost,
    getReadersName: getReadersName
}