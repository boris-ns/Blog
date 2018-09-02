class Comment {
    constructor(postId, readerId, text, time) {
        this.postId = postId;
        this.readerId = readerId;
        this.text = text;
        this.time = time;
    }
}

module.exports.Comment = Comment;