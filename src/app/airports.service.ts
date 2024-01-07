import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  constructor(private http: HttpClient) { }

  getCountryAirports(countryCode: string): Observable<any> {
    const { apiUrl, apiKey } = environment;
    const url = `${apiUrl}?country_code=${countryCode}&api_key=${apiKey}`

    return this.http.get<any>(url)
      .pipe(
        tap(_ => console.log("fetched airports")),
        catchError(this.handleError<any>('getCountryAirports', []))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error, "Failed to fetch airports");

      return of(result as T);
    }
  }
}
