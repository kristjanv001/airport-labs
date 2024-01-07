import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerService } from './marker.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MarkerService]
})
export class AppComponent implements AfterViewInit {
  title = 'airport-labs';
  private markerService = inject(MarkerService);
  private map!: Leaflet.Map;

  sayHello(): void {
    this.markerService.sayHello().subscribe(val => console.log(val));
  }

  makeCapitalMarkers() {
    this.markerService.makeCapitalMarkers(this.map);
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor(private httpClient: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.sayHello();
    this.makeCapitalMarkers();
  }

  

  



  
 

  
}


