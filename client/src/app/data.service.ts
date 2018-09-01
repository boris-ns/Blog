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

  addComment(comment) {
    return this.http.post('http://localhost:3000/api/add-comment', comment)
      .subscribe(response => {
        
      });
  }
}
