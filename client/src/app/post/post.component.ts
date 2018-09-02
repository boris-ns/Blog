import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  private postId: string;
  post$;

  constructor(private route: ActivatedRoute, private dataService: DataService) {
    this.route.params.subscribe(
      params => this.postId = params.id
    );
  }

  ngOnInit() {
    this.dataService.getPost(this.postId).subscribe(
      data => this.post$ = data
    );
  }

  addNewComment(name: string, email: string, comment: string) {
    const data = {
      name: name,
      email: email,
      comment: comment,
      postId: this.postId
    };

    this.dataService.addComment(data).subscribe(response => {
      alert('Your comment has been added.')
    }, error => {
      alert('There was a problem with adding your comment to the database. Try again later.');
    });;    
  }
}
