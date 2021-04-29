export function getUint32 (buffer) {
  const data = new DataView(buffer);
  return data.getUint32(0, true);
}

export function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

// <https://gist.github.com/72lions/4528834>
export function appendBuffer (buffer1, buffer2) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
};

export async function exponentialBackoff (max, delay, toTry, onSuccess, onFail, log) {
  try {
    const result = await toTry();
    console.log(result);
    onSuccess(result);
  }
  catch (err) {
    console.log(err);

    if (max === 0) {
      onFail(err);
    }
    log(`Retrying in ${  delay  }s... (${  max  } tries left)`);
    setTimeout(function () {
      exponentialBackoff(--max, delay * 2, toTry, onSuccess, onFail, log);
    }, delay * 1000);
  }
}

/**
 * Convert SFLOAT to regular JS float
 * https://www.silabs.com/community/wireless/bluetooth/forum.topic.html/how_to_representsfl-zXtP
 * https://stackoverflow.com/questions/2263654/what-is-the-biggest-negative-number-on-a-4-bit-machine#:~:text=For%20Signed%204%2Dbits%2C%20first,number)%2C%20making%20it%201000.&text=4%2Dbit%20maximum%20will%20be%20a%20positive%20number.
 * @param {Number} sfloat 16 bit word comprising a signed 4 bit integer exponent followed by a signed 12-bit Mantissa
 */
export function sfloatToFloat (sfloat) {
  const exponent4bit = sfloat >> 12; 

  const mantissa = sfloat & 0x0fff;
  
  const exponentSignedBit = exponent4bit >> 3;

  const exponentValue = exponent4bit & 0b0111;

  // Negative numbers have the first bit as a 1
  const exponent = exponentSignedBit === 1 ? - exponentValue : exponentValue;

  return mantissa * (10 ** exponent);
}