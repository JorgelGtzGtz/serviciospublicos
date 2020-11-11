import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input () seccion: string;
  urlActual: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
}
