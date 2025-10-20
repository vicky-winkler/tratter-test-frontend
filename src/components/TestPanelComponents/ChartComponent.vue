<template>
    <div class="pl-6 pr-6 pb-6 pt-2  border rounded border-b dark:bg-zinc-800 dark:border-gray-800"
        style="height: 100%;">
        <div id="chart">
            <apexchart height="500px" type="line" ref="chart" :options="chartOptions" :series="series">
            </apexchart>
        </div>
    </div>
</template>

<script setup>
// VUE
import { ref, onMounted, onUnmounted } from 'vue';

// Messaging and Commands
import slip from 'slip';
import { Buffer } from 'buffer';
import { decodeMessage } from '../../services/backendMessaging/backendCommands';
import { wsAddress } from '../../services/websocket/mainWebSocket';
import { BackEndCommand } from '../../services/backendMessaging/commandEnums';
import { connection } from '../../services/websocket/mainWebSocket';

// Stores and Data
import { useTestConfigStore } from '../../store/testConfigStore';




/* CODE STARTS HERE */


const testConfigStore = useTestConfigStore();

// var connection = null
window.Buffer = window.Buffer || Buffer;

const YAXISRANGE = 3500
const YAXISMIN = 0
const DATAPOINTS = 120

const chart = ref()


var chartUpdateReady = true;

var chartDataSet = [[], [], [], [], [], [], [], [], []]


const DATAFRAME_UPDATE_SKIP = 2

var currentUpdateSkipFrame = 0

const AVG_DATA_IN_FRAME = true

onMounted(() => {
    //currently 200hz
    //chartOptions.value.xaxis.range = ((testConfigStore.testDurationID + 2) * 63)

    if (AVG_DATA_IN_FRAME) {
        chartOptions.value.xaxis.range = DATAPOINTS
    } else {
        chartOptions.value.xaxis.range = DATAPOINTS
    }


    for (var i = 0; i < 9; i++) {
        chartDataSet[i] = new Array();
        // for(var j = 0; j < chartOptions.value.xaxis.range; j++){
        //     chartDataSet[i].push(0);
        // }
    }

    chartUpdateReady = true;
})


onUnmounted(() => {
    // chart.value.destroy();
})



function updateChart() {

    if (chartUpdateReady) {

        chartUpdateReady = false;
        //testSleep()
        //console.log(chartDataSet)
        chart.value.updateSeries([{
            data: chartDataSet[0]
        }, {
            data: chartDataSet[1]
        }, {
            data: chartDataSet[2]
        }, {
            data: chartDataSet[3]
        }, {
            data: chartDataSet[4]
        }, {
            data: chartDataSet[5]
        }, {
            data: chartDataSet[6]
        }, {
            data: chartDataSet[7]
        }, {
            data: chartDataSet[8]
        }
        ]).then(chartUpdateReady = true)
    }
}


// Process received data
function processMessage(decodedOscMessage) {

    // Extract CommandType from Address
    const commandType = decodedOscMessage.address.split('/')[2]

    // CommandID
    const commandID = decodedOscMessage.args[1].value;

    //console.log("Decode - Chart " + commandID + " " + commandType)

    // DATA
    if (commandType === "DATA") {
        if (commandID === BackEndCommand.MeasurementData || commandID === BackEndCommand.BootMeasurementData) { //---TODO

            if (decodedOscMessage.args[2].value == 2) { //1 == float datatype, 2 == int datatype
                var startIndex = 0;

                if (decodedOscMessage.args[3].value == 7) {//testMode 0
                    startIndex = 1;
                }

                const floats = new Int32Array(new Uint8Array(decodedOscMessage.args[5].value).buffer)
                // console.log(floats)

                var dataIndex = 0;
                var avgVals = [0, 0, 0, 0, 0, 0, 0, 0, 0]

                if (AVG_DATA_IN_FRAME) {
                    for (var x = 0; x < floats.length; x++) {
                        dataIndex = x % decodedOscMessage.args[3].value;
                        avgVals[startIndex + dataIndex] += ((floats[x]));
                    }
                    // console.log(avgVals);

                    for (var i = startIndex; i < startIndex + decodedOscMessage.args[3].value; i++) {
                        avgVals[i] /= (decodedOscMessage.args[4].value === 0 ? 1 : decodedOscMessage.args[4].value);
                        chartDataSet[i].push(Math.min(YAXISRANGE, (avgVals[i])));
                    }
                } else {
                    //for (var x = 0; x < decodedOscMessage.args[3].value; x++) {
                    for (var x = 0; x < floats.length; x++) {
                        dataIndex = x % decodedOscMessage.args[3].value;

                        chartDataSet[startIndex + dataIndex].push((floats[x]));

                        if (dataIndex == 0) {
                            x += decodedOscMessage.args[3].value * 2;
                        }
                    }
                }
                if (chartDataSet[startIndex].length > DATAPOINTS) {
                    chartOptions.value.xaxis.range = chartDataSet[startIndex].length;
                }

                updateChart()               
            }
        }
        // CMD + Init Testing => reset chart!
    } else if (commandType === "CMD") {
        if (commandID === BackEndCommand.InitTesting || commandID === BackEndCommand.BootInitTesting) {
            console.log("init testing")
            for (var i = 0; i < chartDataSet.length; i++) {
                chartDataSet[i] = []
            }

            updateChart();
            
        } else if (commandID == BackEndCommand.ReadRFID || commandID == BackEndCommand.BootReadRFID) {

        }
    }
};



// function resetChart() {
//     chartDataSet = [[], [], [], [], [], [], [], [], []];
//     updateChart();
// }



// accessible from parent component
defineExpose({
    processMessage,
    // resetChart
});






/*
    CHART!!!!
*/




// Chart Options -  design ecc.
const chartOptions = ref({
    colors: ['#e61919', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#00ced1', '#42d4f4', '#bfef45', '#808000'],
    chart: {
        id: 'realtime',
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            speed: 100,
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },

    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 4,

    },
    markers: {
        size: 0
    },
    xaxis: {
        range: DATAPOINTS,
        type: 'numeric',
        labels: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        // title: {
        //     fontSize: '24px',
        //     text: 'Samples',

        // },
    },
    yaxis: {
        min: YAXISMIN,
        max: YAXISRANGE,
        type: 'numeric',
        title: {
            fontSize: '26px',
            text: 'ADC Counts ( ' + YAXISMIN + ' - ' + YAXISRANGE + ' )',
        },
        labels: {
            show: false,
        },

    },
    tooltip: {
        style: {
            fontSize: '26px',
            fontFamily: undefined
        },
    },
    legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: false,
        showForZeroSeries: false,
        position: 'bottom',
        horizontalAlign: 'left',
        floating: false,
        fontSize: '26px',
        fontFamily: 'Avenir, Helvetica, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 10,
        labels: {
            colors: undefined,
            useSeriesColors: false
        },
        markers: {
            size: 9,
            shape: undefined,
            strokeWidth: 1,
            fillColors: undefined,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
        },
        itemMargin: {
            horizontal: 16,
            vertical: 0
        },
        onItemClick: {
            toggleDataSeries: true
        },
        onItemHover: {
            highlightDataSeries: true
        },

    }

});


// chart lines ...
const series = ref([{
    name: 'RFix',
    type: 'line',
    data: chartDataSet[0].slice()
}, {
    name: 'Sensor1',
    type: 'line',
    data: chartDataSet[1].slice()
}, {
    name: 'Sensor2',
    type: 'line',
    data: chartDataSet[2].slice()
}, {
    name: 'Sensor3',
    type: 'line',
    data: chartDataSet[3].slice()
}, {
    name: 'Sensor4',
    type: 'line',
    data: chartDataSet[4].slice()
}, {
    name: 'Sensor5',
    type: 'line',
    data: chartDataSet[5].slice()
}, {
    name: 'Sensor6',
    type: 'line',
    data: chartDataSet[6].slice()
}, {
    name: 'Sensor7',
    type: 'line',
    data: chartDataSet[7].slice()
}, {
    name: 'Rtemp',
    type: 'line',
    data: chartDataSet[8].slice()
}
]);

</script>