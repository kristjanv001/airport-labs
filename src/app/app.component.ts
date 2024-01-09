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
  filteredDepartures: Departure[] = [];
  filteredSortedDepartures: Departure[] = [];

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

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.getAirports('NO');
  }

  private displayCountryAirports() {
    this.markerService.makeMarkers(
      this.map,
      this.airports,
      this.getDepartures.bind(this)
    );
  }

  // TODO: extract filtering and displaying
  private getAirports(countryCode: string) {
    this.airportsService
      .getCountryAirports(countryCode)
      .subscribe((airports) => {
        this.airports = airports.response.filter(
          (airport: any) => airport.iata_code !== null
        );
        this.displayCountryAirports();
      });
  }

  private getDepartures(IATACode: string) {
    this.airportsService
      .getAirportDepartures(IATACode)
      .subscribe((reqResponse) => {
        // filter & sort
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
    const filtered = departures.filter((departure) => {
      const uniqueKey = `${departure.dep_time_ts}-${departure.arr_iata}`;

      if (
        departure.status !== 'scheduled' ||
        departure.dep_actual_ts <= this.currentUnixTime ||
        this.uniqueKeySet.has(uniqueKey)
      ) {
        return false;
      }

      this.uniqueKeySet.add(uniqueKey);

      return true;
    });

    this.uniqueKeySet.clear();

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
