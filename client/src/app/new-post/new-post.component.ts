import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  addPost(author: string, title: string, text: string) {
    const post = {
      author: author,
      title: title,
      text: text
    };

    this.dataService.addPost(post).subscribe(response => {
      alert('New post has been added.')
    }, error => {
      alert('There was a problem with adding your text to the database. Try again later.');
    });
  }
}
