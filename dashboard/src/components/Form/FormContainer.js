import React, {Component} from 'react';
import Select from './Select';
import Button from './Button';
import { Redirect } from "react-router-dom";


class FormContainer extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        age: '',
        race: '',
        occupation: '',
        income: '',
        bedrooms: '',
        vehicles: ''
      },

      ageOptions: ['18-24', '25-34', '35-44', '45-54', '55-59', '60-64', '65-74', '75-84', '85+'],
      raceOptions: ['Latino', 'Caucasian', 'African American', 'Asian', 'Other'], 
      occupationOptions: [
        'Construction', 'Manufacturing', 'Wholesale trade', 'Retail trade', 'Transportation, warehousing, or utilities',
        'Information', 'Finance, insurance, real estate, or rental & leasing', 'Professional, scientific, management, administrative, or waste management services',
        'Educational services, health care, or social assistance', 'Arts, entertainment, recreation, accommodation, or food services',
        'Other services, except public administration', 'Public administration'   
      ],
      incomeOptions: [
        'Less than $10,000', '$10,000 to $14,999', '$15,000 to $24,999', '$25,000 to $34,999', '$35,000 to $49,999', 
        '$50,000 to $74,999', '$75,000 to $99,999', '$100,000 to $149,999', '$150,000 to $199,999', '$200,000 or more'
      ],
      bedroomOptions: ['0 bedrooms', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5 or more bedrooms'],
      vehicleOptions: ['0 vehicles', '1 vehicle', '2 vehicles', '3 or more vehicles'],
      

      redirect: null,
    }
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleAge = this.handleAge.bind(this);
    this.handleFullName = this.handleFullName.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  
  handleFullName(e) {
   let value = e.target.value;
   this.setState( prevState => ({ userData : 
        {...prevState.userData, name: value
        }
      }), () => console.log(this.state.userData))
  }

  handleAge(e) {
       let value = e.target.value;
   this.setState( prevState => ({ userData : 
        {...prevState.userData, age: value
        }
      }), () => console.log(this.state.userData))
  }

  handleInput(e) {
       let value = e.target.value;
       let name = e.target.name;
   this.setState( prevState => ({ userData : 
        {...prevState.userData, [name]: value
        }
      }), () => console.log(this.state.userData))
  }

  handleTextArea(e) {
    console.log("Inside handleTextArea");
    let value = e.target.value;
    this.setState(prevState => ({
      userData: {
        ...prevState.userData, about: value
      }
    }), ()=>console.log(this.state.userData))
  }


  handleCheckBox(e) {

    const newSelection = e.target.value;
    let newSelectionArray;

    if(this.state.userData.skills.indexOf(newSelection) > -1) {
      newSelectionArray = this.state.userData.skills.filter(s => s !== newSelection)
    } else {
      newSelectionArray = [...this.state.userData.skills, newSelection];
    }

    this.setState( prevState => ({ userData:
      {...prevState.userData, skills: newSelectionArray }
    }));
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ redirect: "/results" });
  }   

  handleClearForm(e) {
    e.preventDefault();
    this.setState({ 
      userData: {
        age: '',
        race: '',
        occupation: '',
        income: '',
        bedrooms: '',
        vehicles: ''
      },
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: this.state.redirect, 
        state: { 
          userData: this.state.userData,
        }
      }}/>
    }
    return (
      <div className="container">
        <div className="row justify-content-center">
            <div className="col pt-5">
                <h2>Tell us a bit about yourself...</h2>
            </div>
        </div>
        <div className="row pt-5">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <form className="container-fluid" onSubmit={this.handleFormSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Select title={'Age'}
                    name={'age'}
                    options = {this.state.ageOptions} 
                    value = {this.state.userData.age}
                    placeholder = {'Select Age'}
                    handleChange = {this.handleInput}
                  /> {/* Age Selection */}
                </div>
                <div className="col-md-6">
                  <Select title={'Ethnicity'}
                    name={'race'}
                    options = {this.state.raceOptions} 
                    value = {this.state.userData.race}
                    placeholder = {'Select Ethnicity'}
                    handleChange = {this.handleInput}
                  /> {/* Ethnicity Selection */}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Select title={'Occupation'}
                    name={'occupation'}
                    options = {this.state.occupationOptions} 
                    value = {this.state.userData.occupation}
                    placeholder = {'Select Occupation'}
                    handleChange = {this.handleInput}
                  /> {/* Occupation Selection */}
                </div>
                <div className="col-md-6">
                  <Select title={'Household Income'}
                    name={'income'}
                    options = {this.state.incomeOptions} 
                    value = {this.state.userData.income}
                    placeholder = {'Select Household Income'}
                    handleChange = {this.handleInput}
                  /> {/* Income Selection */}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Select title={'Number of Bedrooms'}
                    name={'bedrooms'}
                    options = {this.state.bedroomOptions} 
                    value = {this.state.userData.bedrooms}
                    placeholder = {'Select Number of Bedrooms'}
                    handleChange = {this.handleInput}
                  /> {/* Bedroom Selection */}
                </div>
                <div className="col-md-6">
                  <Select title={'Number of Vehicles'}
                    name={'vehicles'}
                    options = {this.state.vehicleOptions} 
                    value = {this.state.userData.vehicles}
                    placeholder = {'Select Number of Vehicles'}
                    handleChange = {this.handleInput}
                  /> {/* Vehicle Selection */}
                </div>
              </div>

              <Button 
                action = {this.handleFormSubmit}
                type = {'primary'} 
                title = {'Submit'} 
                style={buttonStyle}
              />{ /*Submit */ }
              
              <Button 
                action = {this.handleClearForm}
                type = {'secondary'}
                title = {'Clear'}
                style={buttonStyle}
              /> {/* Clear the form */}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const buttonStyle = {
  margin : '20px 20px 20px 20px'
}

export default FormContainer;