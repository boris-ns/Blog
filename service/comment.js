class Comment {
    constructor(postId, readerId, text) {
        this.postId = postId;
        this.readerId = readerId;
        this.text = text;
    }
}

module.exports.Comment = Comment;