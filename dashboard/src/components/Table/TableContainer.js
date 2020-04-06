import React, { Component } from 'react';
import LoadingSpinner from './LoadingSpinner';


class TableContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			userData: this.props.location.state.userData,
			personalFit: '',
			publicPerception: '',
			financialOutlook: ''
		}
	}

	componentDidMount() {
		let userData = this.state.userData;
		this.setState({ isLoading: true });
		const urls = [
			'http://localhost:9000/testAPI',{
				method: "POST",
				body: JSON.stringify(userData),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			},
			'http://localhost:9000/get_file/dummy.csv',
			'http://localhost:9000/testAPI'
		];
		
		Promise.all(urls.map(url =>
		fetch(url)
			.then(checkStatus)                 
			.then(parseJSON)
			.catch(error => console.log('There was a problem!', error))
		))
		.then(data => {
			this.setState({ 
				personalFit: data[0],
				publicPerception: data[1],
				financialOutlook: data[2],
				isLoading: false
			});
		})

		function checkStatus(response) {
			if (response.ok) {
				return Promise.resolve(response);
			} else {
				return Promise.reject(new Error(response.statusText));
			}
		}
		
		function parseJSON(response) {
			return response.text();
		}
	}  

	render() {
		return (
			<div className="container">
				<div className="row justify-content-center">
					<div className="col pt-5">
						<h1>This is a table placeholder.</h1>
						{this.state.isLoading ? <LoadingSpinner /> :
						// table compent here
						this.state.personalFit
						}
					</div>
				</div>
			</div>
		);
	}
}

export default TableContainer;