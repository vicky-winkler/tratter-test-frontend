const enum FrontEndCommand
{
    UsersMes = 7777,
    Settings  = 8888, // DATA

    LoginView = 11010,
    LoginUser = 11011,       // CMD
    LogoutUser = 11012,      // CMD
    StorageFull = 0,
    
    MainScreenView = 11020,
    TestingView = 11040,
    ResultsView = 11050,

    SettingsView = 11030,	
    OperationMode = 11031,   // DATA, single INT
    ChangeTool = 11032,
    ExportCSV = 11033,        // CMD
    CalibrateGoDex = 11034,

    ShutDown = 9999,        //CMD
    Stop = 1111, 
    LightBarrier = 2222,
    Instructions = 3333, // DATA as string
}

const enum BackEndCommand
{
    // SENSOR
    InitTesting = 12000,
    ReadyToTest = 12004,    // OPERATIVE on Backend
    ScanQrCode = 12010,
    SizeAndSensorId = 12011,    // Data string
    ReadRFID = 12020,
    RfidAndOrientation = 12021, // DATA, 
    SerialNumber = 12030,
    MeasurementData = 12040, // Data, byte Array (7,9 bools - directly from MCU)
    FinalResults = 12051, // DATA, byte array (7/9 bools) TODO????
    Resetting = 12060,

    // BOOT
    BootInitTesting = 22010,
    BootReadyToTest = 22042,
    BootReadRFID = 22020,
    BootSizeOrientationRFID = 22021,
    BootConnectingBluetooth = 22030,
    BootMacAddress = 22031,
    BootReadyForButtonPress = 22042,
    BootMeasurementData = 22050,
    BootCalibrate = 22060,
    BootResetting = 22080,
    BootFinalStatusResults = 22071,
    BootFinalResults = 22072,
    BootEcuDeviceInfo = 22090,
    BootRecordBoot = 22100,


    // OVEN - Conditioning
    OvenInitTesting = 32010,
    OvenReadyToTest = 32011,
    OvenTestDuration = 32020,
    OvenTesting = 32030,
    OvenFinalResult = 32041,
    OvenResetting = 32050,
    OvenScanRfids = 32060,
    OvenStopScanningRfids = 32061,
    OvenScanQrCode = 32070,
    OvenSizeAndOrientation = 32071,
    OvenStopScanningQrCode = 32072,
    OvenSerialNumber = 32080,

    // RECALIBRATION
    RecalInitTesting = 52000,
    RecalStartPressed = 52001,
    RecalOperative = 52004,
    RecalScanRFID = 52010,
    RecalSizeOrientationRFID = 52011,
    RecalRecordingDataCalibration = 52020,
    RecalRecordingDataBoot = 12030,
    RecalStoringResult = 12040,
    RecalFinalResult = 12041,
    RecalResetTeststation = 52050,

    // STUFEN RECALIBRATION
    StepRecalInitTesting = 62010,
    StepRecalReadyToTest = 62042,
    StepRecalButtonPressed = 62043,
    StepRecalReadRFID = 62020,
    StepRecalSizeOrientationRFID = 62021,
    StepRecalConnectingBluetooth = 62030,
    StepRecalMacAddress = 62031,
    StepRecalMeasurementData = 62050,
    StepRecalCalibrate = 62060,
    StepRecalResetting = 62080,
    StepRecalFinalResults = 62071,
    StepRecalLightBarrierReset = 62090,
    StepRecalEcuDeviceInfo = 62100,
    StepRecalRecordCalibration = 62110,

    // QUALITY SINGLE CELL
    QualitySingleInitTesting = 72010,
    QualitySingleTestReady = 72022,  // CMD Allowed Press Button
    QualitySingleButtonPressed = 72023,   // CMD
    QualitySingleMeasurementData = 72030,   // Data -> single float value
    QualitySingleTargetPressure = 72031,    // DATA
    QualitySingleCalculatedPressure = 72032,    // DATA
    QualitySingleNewTest = 72033,
    QualitySingleManualInputFrontEnd = 72040,
    QualitySingleStoreResult = 72050,
    QualitySingleFinalResult = 72051,       // DATA array with 10 bools
    QualitySingleResetTeststation = 72060,

}


const enum OscDataType{
    None = -1,
    String = 0,
    Float = 1,
    Int = 2,
    Bool = 3,
}

export {
    FrontEndCommand,
    BackEndCommand,  
    OscDataType,
}