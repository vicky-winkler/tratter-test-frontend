import { ADValues } from "../adValues/types";


export class EcuTest {
    id: number;
    macAddress: string;
    serialNumber: string;
    teststationId: number;
    firmwareTest: boolean;
    switchON: boolean;
    ledTest: boolean;
    chargingTest: boolean;
    gyroAcceleroTest: boolean;
    adValues1: ADValues;
    adValues2: ADValues;
    adValues3: ADValues;
    firmwareUpdate: boolean;
    switchOFF: boolean;
    status: boolean;
    timeStamp: Date;
  };