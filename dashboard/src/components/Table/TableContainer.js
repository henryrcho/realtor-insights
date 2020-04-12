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
	sort(a, b) {
		// Compare the 2 districts
		if (a.district < b.district) return -1;
		if (a.district > b.district) return 1;
		return 0;
	}

	formatRows(model1, model2, model3) {
		model1.sort(this.sort);
		model2.sort(this.sort);
		model3.sort(this.sort);
		var rows = [];
		for(var i = 0; i < model1.length; i++) {
			if((model1[i].district !== model2[i].district) || (model1[i].district !== model3[i].district)) {
				return console.log("Error! Out-of-order");
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
		// const user = this.state.userData;
		// var publicPerception = require('./dummy.json');
		// var financialOutlook = require('./dummy.json');
		// fetch('https://radiant-fortress-14740.herokuapp.com/runModel?age='+user.age+'&race='+user.race)
		// 	.then(checkStatus)                 
		// 	.then(parseJSON)
		// 	.catch(error => console.log('There was a problem!', error))
		// 	.then(data => {
		// 		this.setState({
		// 			rows: this.formatRows(data, publicPerception, financialOutlook)
		// 		});
		// 	});		

		const user = this.state.userData;
		this.setState({ isLoading: true });
		const urls = [
			'https://radiant-fortress-14740.herokuapp.com/runModel?age='+user.age+'&race='+user.race,
			'https://radiant-fortress-14740.herokuapp.com/getData/dummy.json',
			'https://radiant-fortress-14740.herokuapp.com/getData/dummy.json'
		];
		
		Promise.all(urls.map(url =>
			fetch(url)
				.then(checkStatus)                 
				.then(parseJSON)
				.catch(error => console.log('There was a problem!', error))
			))
			.then(data => {
				this.setState({
					rows: this.formatRows(data[0], data[1], data[2]),
					isLoading: false
				});
			});

		function checkStatus(response) {
			if (response.ok) {
				return Promise.resolve(response);
			} else {
				return Promise.reject(new Error(response.statusText));
			}
		}
		
		function parseJSON(response) {
			return response.json();
		}
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