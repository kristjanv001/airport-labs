export interface Airport {
  country_code: string;
  iata_code: string | null;
  icao_code: string;
  lat: number;
  lng: number;
  name: string;
}
