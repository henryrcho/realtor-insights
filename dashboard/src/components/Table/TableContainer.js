import React, { Component } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SortableTable from './SortableTable';


class TableContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			userData: this.props.location.state.userData,
			rows: []
		}
	}

	formatRows(model1, model2, model3) {
		var rows = [];
		for(var i = 0; i < model1.length; i++) {
			if((model1[i].district !== model2[i].district) || (model1[i].district !== model3[i].district)) {
				return [];
			}
			rows[i] = { 
				district: model1[i].district,
				personalFit: model1[i].sentiment,
				publicPerception: model2[i].sentiment,
				financialOutlook: model3[i].sentiment,

			}
		}
		return rows;
	}

	componentDidMount() {
		// For making the table
		var personalFit = require('./dummy.json');
		var publicPerception = require('./dummy.json');
		var financialOutlook = require('./dummy.json');
		this.setState({ 
			rows: this.formatRows(personalFit, publicPerception, financialOutlook)
		});
		


		// let userData = this.state.userData;
		// this.setState({ isLoading: true });
		// const urls = [
		// 	'http://localhost:9000/getData/dummy.json',
		// 	'http://localhost:9000/getData/dummy.json',
		// 	'http://localhost:9000/getData/dummy.json'
		// ];
		
		// Promise.all(urls.map(url =>
		// 	fetch(url)
		// 		.then(checkStatus)                 
		// 		.then(parseJSON)
		// 		.catch(error => console.log('There was a problem!', error))
		// 	))
		// 	.then(data => {
		// 		this.setState({
		// 			rows: this.formatRows(data[0], data[1], data[2]),
		// 			isLoading: false
		// 		});
		// 	});

		// function checkStatus(response) {
		// 	if (response.ok) {
		// 		return Promise.resolve(response);
		// 	} else {
		// 		return Promise.reject(new Error(response.statusText));
		// 	}
		// }
		
		// function parseJSON(response) {
		// 	return response.json();
		// }
	}  

	render() {
		return (
			<div className="container">
				<div className="row justify-content-center">
					<div className="col pt-5">
						{this.state.isLoading ? <LoadingSpinner /> :
							<div>
								<h2>Here are your results!</h2>
								<SortableTable 
									rows={this.state.rows}
								/>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default TableContainer;