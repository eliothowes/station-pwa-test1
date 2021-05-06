import Device from '../../Device';
import adapters from './taidoc';

class Thermometer extends Device {
  constructor (adapters) {
    super(adapters);
    this.name = 'Thermometer';
    this.description = 'A device for measuring a patients body temperature.';
  }
}

export default new Thermometer(adapters);