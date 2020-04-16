import React, { Component } from 'react';
import { Chart } from 'react-charts'


class GenericToolTip extends Component {
	constructor(props) {
    super(props);
    this.props = props;
  }

  buildData() {
    const { data, yRange, type } = this.props;
    let dataForGraph = [];
    let val;
    let dataRange;
    for (let i = 0; i < yRange.length; i++) {
        switch (yRange[i]) {
            case 'median_age':
                switch (data[yRange[i]]) {
                    case '20-24':
                        val = 22;
                        break;
                    case '25-34':
                        val = 29.5;
                        break;
                    case '35-44':
                        val = 39.5;
                        break;
                    case '45-54':
                        val = 45;
                        break;
                    case '55-59':
                        val = 57;
                        break;
                    case '60-64':
                        val = 62;
                        break;
                    case '65-74':
                        val = 69.5;
                        break;
                    case '75-84':
                        val = 79.5;
                        break;
                    case '85+':
                        val = 85;
                        break;
                    default:
                        break;
                }
                break;
            case 'median_income':
                dataRange = data[yRange[i]].replace(/\$/g, '').replace(/,/g, '').split(' to ');
                val = (Number(dataRange[0]) + Number(dataRange[1])) / 2; 
                switch (data[yRange[i]]) {
                    case 'Less than $10,000':
                        val = 10000;
                        break; 
                    case '$200,000 or more':
                        val = 200000;
                        break;
                    default:
                        break;
                }
                break;
            case 'median_bed':
                dataRange = data[yRange[i]].replace('or more bedrooms', '').replace('bedrooms', '').replace('bedroom', '').trim();
                val = Number(dataRange);
                break;
            case 'median_veh':
                dataRange = data[yRange[i]].replace('or more vehicles', '').replace('vehicles', '').replace('vehicle', '').trim();
                val = Number(dataRange);
                break;
            default:
                break;
        }
        dataForGraph.push([yRange[i], val]);
    }
    return {dataForGraph, type};
  }
    
  render() {
    const {dataForGraph, type} = this.buildData();
    const series = ({ type: type });
    const axes = [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { position: 'left', type: 'linear' }
    ];

    return (
        dataForGraph.map((index) => (
            <div
                style={{
                backgroundColor: 'white',
                width: '200px',
                height: '300px',
                padding: '30px',
                float: 'left'
                }}
            >
                <Chart title="Personal Fit tooltip graph" series={series} data={[{data: [['', 0], index, ['', 0]]}]} axes={axes} />
            </div>
        ))
    );
  }
}

export default GenericToolTip;
