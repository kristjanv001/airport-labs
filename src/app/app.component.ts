import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerService } from './marker.service';
import { AirportsService } from './airports.service';
import { ClockTimePipe } from './clock-time.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeafletModule, ClockTimePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'airport-labs';
  departures: any = [];
  filteredDepartures: any = [];
  private uniqueKeySet: Set<String> = new Set();
  private airports: any = [];
  private map!: Leaflet.Map;
  currentUnixTime: number;

  constructor(
    private markerService: MarkerService,
    private airportsService: AirportsService
  ) { 
    this.currentUnixTime = Math.floor(Date.now() / 1000);
  }

  ngOnInit() { 

  };

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
        this.departures = departures.response;
        console.log(this.departures)

        this.uniqueKeySet.clear();

        this.filteredDepartures = departures.response
          .filter((dep: any) => this.filterNextDepartures(dep))
          .sort((a: any, b: any) => {
            const depTimeA = a.dep_time_ts;
            const depTimeB = b.dep_time_ts;
            
            return depTimeA - depTimeB;

          })

          // .slice(0, 5);
        console.log(this.uniqueKeySet.size)
      })


  }

  private filterNextDepartures(dep: any) {
    const uniqueKey = `${dep.dep_time_ts}-${dep.arr_iata}`;

    if (
      dep.status === 'active' || 
      dep.status === 'landed' || 
      dep.dep_actual_ts <= this.currentUnixTime ||
      this.uniqueKeySet.has(uniqueKey)
    ) {
      return false;
    }

    this.uniqueKeySet.add(uniqueKey);

    return true;
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


