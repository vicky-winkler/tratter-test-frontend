import slip from 'slip';
import crc32 from 'crc/crc32';
import osc from 'simple-osc-lib/index';
import { FrontEndCommand, BackEndCommand, OscDataType } from './commandEnums'
import { connection } from '../websocket/mainWebSocket';


const int32ToBytes = (int)  => {
  return [
    (int >> 24) & 0xff,
    (int >> 16) & 0xff,
    (int >> 8) & 0xff,
    int & 0xff
  ]
};



const encodeAndSendData = (connection, oscMessageBytes) => {
  const crcBytes = int32ToBytes(crc32(oscMessageBytes))
  const msgCrcBytes = Buffer.concat([Buffer.from(oscMessageBytes), Buffer.from(crcBytes)]);
  const encodedMsg = slip.encode(msgCrcBytes);

  if(connection && connection.readyState === WebSocket.OPEN){
    connection.send(encodedMsg);
  }
};

// Change View - TODO  refactor to ChangeViewCommand
const frontEndCommand = (connection, commandID) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/FRONT/CMD/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
    ],
  });

  encodeAndSendData(connection, bufferBytes);
};


// ACK command
const frontEndAckCommand = (connection, commandID) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/FRONT/ACK/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
    ],
  });

  encodeAndSendData(connection, bufferBytes);
};



// Login Command => username + hashed password
const frontEndLoginCommand = (connection, commandID, username, passwordHashed) => {

  var message = username + ", " + passwordHashed

  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/FRONT/DATA/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
      { type: 'integer', value: OscDataType.String },    // DataType
      { type: 'string', value: message}
    ],
  });

  encodeAndSendData(connection, bufferBytes)
};



const frontEndSettingsStringData = (connection, commandID, stringValue) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/FRONT/CMD/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
      { type: 'string' , value: stringValue } // values in string format e.g. "a, b, c"
    ],
  });

  encodeAndSendData(connection, bufferBytes);
}

// Change Settings
const frontEndSettingsData = (connection, commandID, value) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/FRONT/DATA/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
      { type: 'integer', value: OscDataType.String },    // DataType
      { type: 'string', value: "" + value} //push value as string
    ],
  });

  encodeAndSendData(connection, bufferBytes)
};


// back end CMD
const backEndCommand = (connection, commandID) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/BACK/CMD/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
    ],
  });

  encodeAndSendData(connection, bufferBytes);
};



// send to backend
const backEndSettingsData = (connection, commandID, dataType, value) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/BACK/DATA/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
      { type: 'integer', value: dataType },    // DataType
      { type: 'string', value: "" + value} //push value as string
    ],
  });

  encodeAndSendData(connection, bufferBytes)
};


// send to backend
const backEndIntegerData = (connection, commandID, dataType, value) => {
  const oscLib = new osc.simpleOscLib();
  const bufferBytes = oscLib.buildMessage({
    address: '/BACK/DATA/',
    args: [
      { type: 'integer', value: -1 },  // Teststation ID
      { type: 'integer', value: commandID },    // CommandID
      { type: 'integer', value: dataType },    // DataType
      { type: 'integer', value: value} //push value as string
    ],
  });

  encodeAndSendData(connection, bufferBytes)
};


// decode received Message
const decodeMessage = (msg, testStates, store, emit, trackStateStore) => {
  const oscLib = new osc.simpleOscLib();
  const dataBuffer = Buffer.from(msg);

  if (msg.length > 10) {
    const oscBytes = msg.slice(0, msg.length - 4);
    const crcBytes = new Uint8Array(msg.slice(msg.length - 4, msg.length));
    var attachedCrc = (crcBytes[0] << 24) | (crcBytes[1] << 16) | (crcBytes[2] << 8) | crcBytes[3];
    attachedCrc = attachedCrc >>> 0

    if (crc32(oscBytes) === attachedCrc) {
      return oscLib.readPacket(dataBuffer);

    } else {
      console.error("Data integrity compromised, CRC check failed - " + crc32(oscBytes) + " vs: " + attachedCrc);
    }
  } else {
    console.error("Invalid data");
  }
}







// export functions
export {
  frontEndCommand,
  frontEndAckCommand,
  frontEndSettingsData,
  frontEndSettingsStringData,
  frontEndLoginCommand,
  backEndSettingsData,
  backEndIntegerData,
  backEndCommand,
  decodeMessage
}