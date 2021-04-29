const USB_CONTROL = {
  //
  // Standard Device Requests
  //  http://www.scaramanga.co.uk/stuff/qemu-usb/usb11.pdf Table 9-4
  //  https://beyondlogic.org/usbnutshell/usb6.shtml
  GET_STATUS: 0x00,
  CLEAR_FEATURE: 0x01,
  RESERVED_1: 0x02,
  SET_FEATURE: 0x03,
  RESERVED_2: 0x04,
  SET_ADDRESS: 0x05,
  GET_DESCRIPTOR: 0x06,
  SET_DESCRIPTOR: 0x07,
  GET_CONFIGURATION: 0x08,
  SET_CONFIGURATION: 0x09,
  GET_INTERFACE: 0x0A,
  SET_INTERFACE: 0x0B,
  SYNC_FRAME: 0x0C,
  //
  // CP210x Custom Protocol
  //  https://searchcode.com/file/47315727/drivers/usb/serial/cp210x.c
  CP210X_GET_COMM_STATUS: 0x10,
  CP210X_PURGE: 0x12,
  CP210X_SET_FLOW: 0x13,
  CP210X_SET_CHARS: 0x19,
  CP210X_GET_BAUDRATE: 0x1D,
  CP210x_SET_BAUDRATE: 0x1E,
};

export default USB_CONTROL;
