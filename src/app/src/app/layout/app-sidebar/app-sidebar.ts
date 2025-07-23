import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-sidebar.html',
  styleUrls: ['./app-sidebar.scss']
})
export class SidebarComponent implements OnInit {

  isDarkMode: boolean = false;

  constructor() {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);

    // Guarda la preferencia en localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    this.isDarkMode = (theme === 'dark');
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}
