// src/app/shared/components/world-map/world-map.component.ts

import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './world-map.html',
  styleUrls: ['./world-map.scss']
})
export class WorldMapComponent implements AfterViewInit {
  private map!: L.Map;
  private visitedCountries: string[] = [];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.loadVisitedCountries();
    this.initMap();
  }

  private loadVisitedCountries(): void {
    const saved = localStorage.getItem('visitedCountries');
    this.visitedCountries = saved ? JSON.parse(saved) : [];
  }

  private saveVisitedCountries(): void {
    localStorage.setItem('visitedCountries', JSON.stringify(this.visitedCountries));
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Cargar GeoJSON local de países
    this.http.get('assets/data/countries.geojson').subscribe((geojson: any) => {
      L.geoJSON(geojson, {
        style: (feature: any) => ({
          fillColor: this.visitedCountries.includes(feature.properties.ISO_A2) ? '#34a853' : '#cccccc',
          weight: 1,
          color: '#333333',
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          const code = feature.properties.ISO_A2;
          const name = feature.properties.ADMIN;

          layer.on({
            mouseover: () => {
              if (layer instanceof L.Path) {
                layer.setStyle({ weight: 2, color: '#000000' });
              }
              layer.bindTooltip(name, { permanent: false }).openTooltip();
            },
            mouseout: () => {
              if (layer instanceof L.Path) {
                layer.setStyle({
                  fillColor: this.visitedCountries.includes(code) ? '#34a853' : '#cccccc',
                  weight: 1,
                  color: '#333333'
                });
              }
              layer.closeTooltip();
            },
            click: () => this.toggleCountry(code, layer)
          });
        }
      }).addTo(this.map);
    });

    // Marcar ciudades con clic
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      L.marker(e.latlng)
        .addTo(this.map)
        .bindPopup(`Ciudad visitada: ${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`)
        .openPopup();
    });
  }

  private toggleCountry(code: string, layer: L.Layer): void {
    if (this.visitedCountries.includes(code)) {
      this.visitedCountries = this.visitedCountries.filter(c => c !== code);
    } else {
      this.visitedCountries.push(code);
    }
    this.saveVisitedCountries();

    if (layer instanceof L.Path) {
      layer.setStyle({
        fillColor: this.visitedCountries.includes(code) ? '#34a853' : '#cccccc'
      });
    }
  }
}
