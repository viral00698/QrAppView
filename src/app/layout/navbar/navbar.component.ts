import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit ,OnDestroy{

  private intervalId: any;
  date!:Date
  constructor(private authService:AuthenticationService , private router:Router){
   
  }
  
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Clear the interval on component destruction to avoid memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('') 
  }
}

