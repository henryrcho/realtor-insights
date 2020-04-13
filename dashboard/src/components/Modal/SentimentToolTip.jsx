import React, { Component } from 'react';
import { Chart } from 'react-charts'


class SentimentToolTip extends Component {
	constructor(props) {
    super(props);
    this.props = props;
  }

  buildData() {
    const { histData, buckets, type } = this.props;
    let dataForGraph = [];
    for (let i = 0; i < buckets.length; i++) {
      dataForGraph.push([buckets[i], histData[i]])
    }
    return {dataForGraph, type};
  }
    
  render() {
    const {dataForGraph, type} = this.buildData();
    const data = [{ data: dataForGraph }];
    const series = ({ type: type });
    const axes = [
      { primary: true, type: 'ordinal', position: 'bottom' },
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
        <Chart title="Sentiment distibution" series={series} data={data} axes={axes} />
      </div>
    );
  }
}

export default SentimentToolTip;
