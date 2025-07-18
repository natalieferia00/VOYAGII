import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VisitRecord {
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  daysStayed: number;
}

@Component({
  selector: 'app-visited-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visited-form.html',
  styleUrls: ['./visited-form.scss']
})
export class VisitedFormComponent {
  countries: string[] = ['Colombia', 'Argentina', 'España', 'México', 'Brasil', 'Japón', 'Italia', 'Francia'];
  cities: string[] = ['Bogotá', 'Buenos Aires', 'Madrid', 'Ciudad de México', 'São Paulo', 'Tokio', 'Roma', 'París'];

  form: Partial<VisitRecord> = {};
  visits: VisitRecord[] = [];

  constructor() {
    this.loadVisits();
  }

  calculateDaysStayed() {
    if (this.form.startDate && this.form.endDate) {
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      this.form.daysStayed = diff >= 0 ? diff : 0;
    }
  }

  addVisit() {
    if (this.form.country && this.form.city && this.form.startDate && this.form.endDate && this.form.daysStayed !== undefined) {
      const record: VisitRecord = {
        country: this.form.country,
        city: this.form.city,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        daysStayed: this.form.daysStayed
      };
      this.visits.push(record);
      this.saveVisits();
      this.form = {};
    }
  }

  removeVisit(index: number) {
    this.visits.splice(index, 1);
    this.saveVisits();
  }

  saveVisits() {
    localStorage.setItem('visitedRecords', JSON.stringify(this.visits));
  }

  loadVisits() {
    const saved = localStorage.getItem('visitedRecords');
    this.visits = saved ? JSON.parse(saved) : [];
  }
}
