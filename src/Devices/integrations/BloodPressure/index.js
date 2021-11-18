import Device from '../../Device';
import adapters from './adapters/taidoc';

class BloodPressureMonitor extends Device {
  constructor (adapters) {
    super(adapters);
    this.name = 'Blood pressure monitor';
    this.description = 'A device for measuring a patient\'s systolic and diastolic blood pressure and heart rate.';
  }
}

export default new BloodPressureMonitor(adapters);
