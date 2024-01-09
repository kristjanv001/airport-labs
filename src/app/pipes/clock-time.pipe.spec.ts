import { ClockTimePipe } from './clock-time.pipe';

describe('ClockTimePipe', () => {
  it('create an instance', () => {
    const pipe = new ClockTimePipe();
    expect(pipe).toBeTruthy();
  });
});
