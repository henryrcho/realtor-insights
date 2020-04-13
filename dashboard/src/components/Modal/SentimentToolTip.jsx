import React, { Component } from 'react';
import { Chart } from 'react-charts'

class SentimentToolTip extends Component {
	constructor(props) {
        super(props);
        this.props = props;
    }

    buildData() {
        const { histData } = this.props;
        const buckets = ['-1 to -0.8', '-0.8 to -0.6', '-0.6 to -0.4', '-0.4 to -0.2', '-0.2 to 0', 
                         '0 to 0.2', '0.2 to 0.4', '0.4 to 0.6', '0.6 to 0.8', '0.8 to 0.1']
        let dataForGraph = []
        for (let i = 0; i < buckets.length; i++) {
            dataForGraph.push([buckets[i], histData[i]])
        }
        return dataForGraph;
    }
    
    render() {
        console.log(this.props.histData);
        const dataForGraph = this.buildData();
        const data = [{ data: dataForGraph }];
        const series = ({ type: 'bar' });
        const axes = [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { position: 'left', type: 'linear'}
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
            <Chart title="hello" series={series} data={data} axes={axes} />
          </div>
        )
      }
}

export default SentimentToolTip;