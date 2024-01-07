import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  
  constructor() { }

  makeMarkers(map: Leaflet.Map, data: any): void {
    for (const item of data) {

      const lat = item.lat;
      const lon = item.lng;

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

      const marker = Leaflet.marker([lat, lon], { icon: markerIcon });
      
      marker.addTo(map);
    }
  }
}
