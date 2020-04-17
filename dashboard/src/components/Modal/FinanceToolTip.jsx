import React, { Component } from 'react';
import { Chart } from 'react-charts'


class FinanceToolTip extends Component {
	constructor(props) {
    super(props);
    this.props = props;
  }

  buildData() {
    const { projection, historical } = this.props;
    const historicalData = historical.map(x => x.value);
    const historicalDates = historical.map(x => {
      let dateParts = x.date.split('-')
      return new Date(parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2].split(' ')[0], 10))
    });
    let historicalDataForGraph = []; 
    for (let i = 0; i < historicalData.length; i++) {
      historicalDataForGraph.push([historicalDates[i], historicalData[i]]);
    }

    const projectedData = projection.map(x => x.value);
    const projectedUpperCI = projection.map(x => x.upper_ci);
    const projectedLowerCI = projection.map(x => x.lower_ci);
    const projectedDates = projection.map(x => {
      let dateParts = x.date.split('-');
      return new Date(parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2].split(' ')[0], 10))});

    let projectedDataForGraph = [];
    let projectedUpperCIForGraph = [];
    let projectedLowerCIForGraph = [];
    for (let i = 0; i < projectedData.length; i++) {
      projectedDataForGraph.push([projectedDates[i],  projectedData[i]])
      projectedUpperCIForGraph.push([projectedDates[i], projectedUpperCI[i]])
      projectedLowerCIForGraph.push([projectedDates[i], projectedLowerCI[i]])
    }

    return { 
      historicalDataForGraph, 
      projectedDataForGraph, 
      projectedUpperCIForGraph, 
      projectedLowerCIForGraph 
    };
  }
    
  render() {
    const { historicalDataForGraph, projectedDataForGraph,
      projectedUpperCIForGraph, projectedLowerCIForGraph } = this.buildData();
    const data = [
      { data: historicalDataForGraph }, 
      { data: projectedDataForGraph },
      { data: projectedUpperCIForGraph },
      { data: projectedLowerCIForGraph }
    ];

    const axes = [
      { primary: true, type: 'time', position: 'bottom' },
      { position: 'left', type: 'linear' }
    ];

    return (
      <div
        style={{
          backgroundColor: 'white',
          width: '400px',
          height: '300px',
          padding: '30px',
        }}
      >
        <Chart title="Generic tooltip graph" data={data} axes={axes} />
      </div>
    );
  }
}

export default FinanceToolTip;
