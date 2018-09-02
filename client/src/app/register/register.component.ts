import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onClickRegister(username: string, email: string, password: string, password2: string) {
    if (password !== password2) {
      alert('Passwords are not the same!');
      return;
    }
    
    const user = {
      username: username,
      email: email,
      password: password
    };

    this.dataService.registerUser(user).subscribe(response => {
      
    });
  }
}
