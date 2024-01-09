import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clockTime',
  standalone: true
})
export class ClockTimePipe implements PipeTransform {

  transform(dateTime: string): string {
    if (!dateTime) {
      return '';
    }

    const [date, time] = dateTime.split(' ');
    
    return time;
  }

}
