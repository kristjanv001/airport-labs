import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerService } from './marker.service';
import { AirportsService } from './airports.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MarkerService, AirportsService]
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'airport-labs';
  private airports: any = [];
  private markerService = inject(MarkerService);
  private airportsService = inject(AirportsService);

  private map!: Leaflet.Map;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() { 
    
  };

  ngAfterViewInit(): void {
    this.initMap();
    this.getAirports("NO");
  }

  private displayCountryAirports() {
    this.markerService.makeMarkers(this.map, this.airports);
  }

  private getAirports(countryCode: string): void {
    this.airportsService.getCountryAirports(countryCode)
      .subscribe((airports) => {
        this.airports = airports.response.filter((airport: any) => airport.iata_code !== null);

        this.displayCountryAirports();
      });
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [ 62.00000000, 10.00000000 ],
      zoom: 3
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
}


