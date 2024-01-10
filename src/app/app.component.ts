import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerService } from './services/marker.service';
import { AirportsService } from './services/airports.service';
import { ClockTimePipe } from './pipes/clock-time.pipe';
import { LangDropdownComponent } from './components/lang-dropdown/lang-dropdown.component';
import { Departure } from './interfaces/departure';
import { Airport } from './interfaces/airport';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    LeafletModule,
    ClockTimePipe,
    LangDropdownComponent,
    
  ],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'a-labs';
  departures: Departure[] = [];
  airportName = "";
  private airports: Airport[] = [];
  
  private map!: Leaflet.Map;
  private currentUnixTime: number;

  constructor(
    private markerService: MarkerService,
    private airportsService: AirportsService
  ) {
    this.currentUnixTime = Math.floor(Date.now() / 1000);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.getAirports('NO');
  }

  private displayAirportMarkers() {
    this.markerService.makeMarkers(
      this.map,
      this.airports,
      this.getDepartures.bind(this)
    );
  }

  private getAirports(countryCode: string) {
    this.airportsService.getCountryAirports(countryCode)
      .subscribe((reqResponse) => {
        console.log(reqResponse)
        this.airports = this.filterAirports(reqResponse.response);
        this.displayAirportMarkers();
      });
  }

  private filterAirports(airports: Airport[]) {
    return airports.filter((airport) => airport.iata_code !== null);
  }

  private getDepartures(IATACode: string, airportName: string) {
    this.airportName = airportName;

    this.airportsService.getAirportDepartures(IATACode)
      .subscribe((reqResponse) => {
        this.departures = reqResponse.response;
        this.departures = this.filterDepartures(this.departures);
        this.departures = this.sortDepartures(this.departures);
        // this.filteredSortedDepartures.slice(0, 5);
      });
  }

  private sortDepartures(departures: Departure[]) {
    return departures.toSorted((a: any, b: any) => {
      const depTimeA = a.dep_time_ts;
      const depTimeB = b.dep_time_ts;

      return depTimeA - depTimeB;
    });
  }

  private filterDepartures(departures: Departure[]) {
    const uniqueKeySet: Set<String> = new Set();
    const filtered = departures.filter((departure) => {
      const uniqueKey = `${departure.dep_time_ts}-${departure.arr_iata}`;
      
      if (
        departure.status !== 'scheduled' ||
        departure.dep_actual_ts <= this.currentUnixTime ||
        uniqueKeySet.has(uniqueKey)
        ) {
          return false;
        }
        uniqueKeySet.add(uniqueKey);
        
        return true;
      });
    console.log(filtered)
    
    return filtered;
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [62.0, 10.0],
      zoom: 4,
    });

    const tiles = Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 1,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }
}
