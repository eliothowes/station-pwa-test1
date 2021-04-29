import Device from '../../Device';
import adapters from './nonin';

class PulseOximeter extends Device {
  constructor (adapters) {
    super(adapters);
    this.name = 'Pulse oximeter';
    this.description = 'A device for reading SpO2 and heart rate.';
  }
}

export default new PulseOximeter(adapters);
