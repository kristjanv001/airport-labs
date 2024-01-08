import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerService } from './marker.service';
import { AirportsService } from './airports.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'airport-labs';
  departures: any = [];
  private airports: any = [];
  private map!: Leaflet.Map;

  constructor(
    private markerService: MarkerService,
    private airportsService: AirportsService
  ) { }

  ngOnInit() { };

  ngAfterViewInit(): void {
    this.initMap();
    this.getAirports("NO");
  }

  private displayCountryAirports() {
    this.markerService.makeMarkers(this.map, this.airports, this.getDepartures.bind(this));
  }

  private getAirports(countryCode: string) {
    this.airportsService.getCountryAirports(countryCode)
      .subscribe((airports) => {
        this.airports = airports.response.filter((airport: any) => airport.iata_code !== null);
        this.displayCountryAirports();
      });
  }

  private getDepartures(IATACode: string) {
    console.log("clicked on ", IATACode);

    this.airportsService.getAirportDepartures(IATACode)
      .subscribe((departures) => {
        console.log(departures);
        this.departures = departures.response;
      })
  }

  private filterNextDepartures() {
    const currentDate = new Date();

    const nextDepartures = this.departures.filter((departure: any) => {
      const departureDate = new Date(departure.dep_time_utc);
      return departureDate >= currentDate;
    }).slice(0, 5);

    return nextDepartures;
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [ 62.00000000, 10.00000000 ],
      zoom: 4
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
}


