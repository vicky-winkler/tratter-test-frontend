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

const YAXISRANGE = 10000
const YAXISMIN = 0
const DATAPOINTS = 120

const chart = ref()


var chartUpdateReady = true;

var chartDataSet = [[]]


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

    chartDataSet[0] = new Array();

    chartUpdateReady = true;
})


onUnmounted(() => {
    // chart.value.destroy();
})



function updateChart() {

  if (!chartUpdateReady) return;
  chartUpdateReady = false;

  // ensure we use a copy, so reactivity picks it up
  series.value = [{
    name: 'Loadcell',
    type: 'line',
    data: chartDataSet[0].slice()
  }];

  // small microtask to set ready back (optional)
  // ensures the DOM / apex has processed the update first
  Promise.resolve().then(() => { chartUpdateReady = true; });





    // if (chartUpdateReady) {

    //     chartUpdateReady = false;
    //     //testSleep()
    //     //console.log(chartDataSet)
    //     chart.value.updateSeries([{
    //         data: chartDataSet[0]
    //     }, 
    //     ]).then(chartUpdateReady = true)
    // }
}


// Process received data
function processMessage(decodedOscMessage) {

    // Extract CommandType from Address
    const commandType = decodedOscMessage.address.split('/')[2]

    // CommandID
    const commandID = decodedOscMessage.args[1].value;


    // DATA
    if (commandType === "DATA") {
        if (commandID === BackEndCommand.QualitySingleMeasurementData) {

            if (decodedOscMessage.args[2].value == 2) { 

                // convert data
                const valueInt = convertByteToInt(decodedOscMessage.args[5].value);
                //console.log(valueInt);

                // only positive values
                if(valueInt >= 0){
                    chartDataSet[0].push(valueInt);  

                    updateChart()  
                }
             
            }
        }
        // CMD + Init Testing => reset chart!
    } else if (commandType === "CMD") {
        if (commandID === BackEndCommand.QualitySingleInitTesting) {
            console.log("init testing")
            //chartDataSet[0] = []

            //updateChart();
        }

    }
};


function resetChart(){
 chartDataSet[0] = [];
  // set series to empty dataset so chart clears
  series.value = [{
    name: 'Loadcell',
    type: 'line',
    data: []
  }];
  // also try to trigger an immediate update if desired
  Promise.resolve().then(() => { chartUpdateReady = true; });
}


// accessible from parent component
defineExpose({
    processMessage,
    resetChart,

});







function convertByteToInt(value) {
  const bytes = value instanceof Uint8Array
    ? value
    : new Uint8Array(value instanceof ArrayBuffer ? value : value);

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getInt32(0, true);
}






/*
    CHART!!!!
*/




// Chart Options -  design ecc.
const chartOptions = ref({
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
            text: 'N ( ' + YAXISMIN + ' - ' + YAXISRANGE + ' )',
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
            size: 1,
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
    name: 'Loadcell',
    type: 'line',
    data: chartDataSet[0].slice()
}, 
]);

</script>