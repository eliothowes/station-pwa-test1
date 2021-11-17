
const MESSAGES = [
  {
    id: 'SERIAL_NUMBER',
    valid: buffer => {
      return buffer[1] === 0xF4
      && buffer[2] === 0x0B
      && buffer[3] === 0x02
      && buffer.slice(4, 13).reduce((out, curr) => out + curr, 0) === buffer[13]; // perform checksum
    },
    parseData: buffer => {
      // Return the serial number as a string
      const serialNumber = buffer.slice(4, 13)
      .map(asciiCode => {
        return String.fromCharCode(asciiCode);
      })
      .join('');

      return {
        serialNumber
      };
    },
    getSize () {
      return 15;
    }
  },
  {
    id: 'SOFTWARE_REVISION_NUMBER',
    valid: buffer => {
      return buffer[1] === 0xF3
      && buffer[2] === 0x02;
    },
    parseData: buffer => {
      return {
        mainModule: buffer[3],
        oximetryModule: buffer[4]
      };
    },
    getSize () {
      return 6;
    }
  },
  {
    id: 'MODEL_NUMBER',
    valid: buffer => {
      return buffer[1] === 0xF4
      && buffer[2] === 0x07
      && buffer[3] === 0x05
      && buffer[8] === 0x00
      && buffer.slice(4, 9).reduce((out, curr) => out + curr, 0) === buffer[9]; // perform checksum
    },
    parseData: buffer => {
      const modelNumber = buffer.slice(4, 8)
      .map(asciiCode => {
        return String.fromCharCode(asciiCode);
      })
      .join('');

      return {
        modelNumber
      };
    },
    getSize () {
      return 11;
    }
  },
  {
    id: 'DATA',
    valid: buffer => {
      return buffer.length - 2 === buffer[1]; // check the length byte
    },
    parseData: buffer => {
      const statusByte = buffer[2];

      // const displaySyncIndication = (0b00000001 & statusByte) > 0;
      const lowWeakSignal = (0b00000010 & statusByte) > 0;
      const smartPoint = (0b00000100 & statusByte) > 0;
      const searching = (0b00001000 & statusByte) > 0;
      const correctCheck = (0b00010000 & statusByte) > 0; 

      const pulseAmplitudeIndex = (buffer[4] << 8) | buffer[5]; // in hundredths of percent TODO CONFIRM THIS IS RIGHT
      // const counter = (buffer[6] << 8) | buffer[7]; // take the two 8 bit bytes and make a 16 bit unsigned integer from them
      const spO2 = buffer[8]; // as percentage
      const pulse = (buffer[9] << 8) | buffer[10]; // take the two 8 bit bytes and make a 16 bit unsigned integer from them

      return {
        spO2: !searching && correctCheck ? spO2 : 0,
        pulse: !searching && correctCheck ? pulse : 0,
        fingerIn: correctCheck, // they call it 'correct check' which means the finger is in
        searching,
        pulseAmplitudeIndex,
        lowWeakSignal,
        highQualityMeasurement: smartPoint,
      };
    },
    getSize (buffer) {
      return buffer[1] + 2;
    }
  }
];

/**
 * Work out whether the buffer has the right start and end bytes
 * @param {Array} buffer array of byte data
 */
function isValidPacket (buffer) {
  return buffer[0] === 0x02 && buffer[buffer.length - 1] === 0x03;
}

const REQUIRES_MORE_DATA = {
  id: 'REQUIRES_MORE_DATA',
  getSize () {
    return 0;
  },
};

const GARBLED_MESSAGE = {
  id: 'GARBLED_MESSAGE',
  getSize () {
    return 1;
  },
};

export default function parseInputMessage (buffer) {

  if (!isValidPacket) {
    return REQUIRES_MORE_DATA;
  }

  /**
   * Is there a matching message?
   */
  const message = MESSAGES.find(messageDef => {
    return buffer.length === messageDef.getSize(buffer) && messageDef.valid(buffer);
  });

  if (message) {
    return message;
  }
  else {
    return GARBLED_MESSAGE;
  }
}