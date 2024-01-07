import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as Leaflet from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = '/assets/data/world-capitals.geojson';

  constructor(private http: HttpClient) { }

  makeCapitalMarkers(map: Leaflet.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];

        const markerIcon = Leaflet.icon({
          iconUrl: 'assets/leaflet/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowUrl: 'assets/leaflet/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        });

        // const marker = Leaflet.marker([lat, lon]);
        const marker = Leaflet.marker([lat, lon], { icon: markerIcon });

        
        marker.addTo(map);
      }
    });
  }

  sayHello(): Observable<any> {
	  return of("Hello");
	}
}
