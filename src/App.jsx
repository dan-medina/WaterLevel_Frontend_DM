import React, {useState, useEffect} from 'react';
import MonthYearPicker from 'react-month-year-picker';
import './App.css';
import useAsyncFetch from './useAsyncFetch';
//import BarChart from './components/BarChart.jsx';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

function App() {

  return (
    <main className="main">
      <div className="header">
        <p id="title">
          Water Storage in California Reservoirs
        </p>
      </div>
      <div className="top">
        <div className="topleft">
          <p>
          California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
          </p>
          <p>
    California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
          </p>
        </div>
        <div className="topright">
          <img className="image" src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
  "/>
          <p id="caption">
    Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlantic article Dramatic Photos of California's Historic Drought.
          </p>
        </div>
      </div>
      <Data />
    </main>
  );
}

function Data() {
  const [buttonPushed, updateButtonPushed] = useState(false);

  function buttonAction1() {
    updateButtonPushed(true);
  }
  function buttonAction2() {
    updateButtonPushed(false);
  }

  

  if (buttonPushed) {
    return (
      <div className="container">
          <button className="button" onClick={buttonAction2}>
            See Less
          </button>
        
        
        <MonthYear />
      </div>
    )
  }
  else return (
    <div className="container">
        <button className="button" onClick={buttonAction1}>
          See More
        </button>
    </div>
  )
}

function MonthYear() {
  const [date, setDate] = useState({month: 4, year: 2021 });
  
  
  function yearChange(newYear) {
      let m = date.month;
      setDate({year: newYear, month: m });
    }

  function monthChange(newMonth){
      console.log("month change");
      let y = date.year;
      setDate({month: newMonth, year: y});
    }

    return (
      <div className="data">
        <div className="descmonth">
          <div className="subdesc">
            <p>
    Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the seven largest in-state reservoirs.
            </p> 
          </div>
          <div className="monthyear">
            <MonthYearPicker
              caption=""
              selectedMonth={date.month}
              selectedYear={date.year}
              minYear={2000}
              maxYear={2021}
              onChangeYear = {yearChange}
              onChangeMonth = {monthChange}
            />
                
          </div>
        </div>
        <div className="chart">
          <WaterDisplay month={date.month} year={date.year}/>
        </div>
      </div>
    );
}

function WaterChart(props) {
  const reservoirs = new Map();
  reservoirs.set(0, 'Shasta');
  reservoirs.set(1, 'Oroville');
  reservoirs.set(2, 'Trinity Lake');
  reservoirs.set(3, 'New Melones');
  reservoirs.set(4, 'San Luis');
  reservoirs.set(5, 'Don Pedro');
  reservoirs.set(6, 'Berryessa');

  let capacityObj = {label: "Reservoir Capacity", data:[], backgroundColor: 'rgb(120, 199, 227)'}
  let storageObj = {label: "Reservoir Storage", data:[], backgroundColor: 'rgb(66, 145, 152)'}
  let labels = [];
  for (let i = 0; i < 7; i++) {
    storageObj.data.push(props.chartData.get(i));
    labels.push(reservoirs.get(i));
  }
  //storageObj.data = ["2000000","2000000","2000000","2000000","2000000","2000000","2000000"];
  capacityObj.data = ["4552000", "3537577", "2447650", "2400000", "2041000", "2030000", "1602000"];
  
  let waterData = {};
  waterData.labels = labels;
  waterData.datasets = [storageObj, capacityObj];
  
  console.log(waterData);
  
  let options = {
    plugins: {
      title: {
        display: true,
        text: 'Capacity vs. Storage',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        stacked: true,
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          display: false
        },
        stacked: false,
        title: {
          display: true,
          text: 'Millions of Acre-Feet (AF)'
        },
        ticks: {
          callback: function (value, index, ticks) {
            return Math.floor(value/1000000) +'.'+ (value%1000000)/100000
          }
        }
      }
    }
  };
  return (
    <div id="chart-container">
      
      <Bar options={options} data={waterData} />
      
    </div>
  )
  
  

}

function WaterDisplay(props) {
  console.log("in WaterDisplay");
  
  const [chartData, setChartData] = useState([]);
  
  let dateObj = {
    month: props.month,
    year: props.year
  }

  useAsyncFetch('query/postCDECData', dateObj, props.month, props.year, {}, thenFunc, catchFunc);

  function thenFunc (result) {
    console.log("got back result")
    setChartData(result);
  }

  function catchFunc (error) {
    console.log(error);
  }

  let items = new Map();
  for (let i = 0; i < chartData.length; i++) {
    let res = chartData[i];
    items.set(i, res.value);
  }

  if (chartData) {
    return (
        <WaterChart chartData={items}> </WaterChart>
    )
  } else {
    return (<p>
      loading...
    </p>);
  }

  
}


export default App;