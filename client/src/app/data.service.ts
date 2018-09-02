import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get('http://localhost:3000/api/posts');
  }

  getPost(postId) {
    return this.http.get(`http://localhost:3000/api/posts/${postId}`);
  }

  addPost(newPost) {
    return this.http.post(`http://localhost:3000/api/add-post`, newPost);
  }

  addComment(comment) {
    return this.http.post('http://localhost:3000/api/add-comment', comment);
  }

  registerUser(user) {
    return this.http.post('http://localhost:3000/api/register', user);
  }
}
