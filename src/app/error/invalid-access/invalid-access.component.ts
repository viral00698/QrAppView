import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-invalid-access',
  templateUrl: './invalid-access.component.html',
  styleUrls: ['./invalid-access.component.css']
})
export class InvalidAccessComponent implements OnInit{

  constructor(private authService:AuthenticationService){}

  ngOnInit(): void {
    alert("Access restricted. Please contact the administrator.")
    this.authService.logout();
  }

}
