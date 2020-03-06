import React, {Component} from 'react';
import CheckBox from './CheckBox';  
import Input from './Input';  
import TextArea from './TextArea';  
import Select from './Select';
import Button from './Button'


class FormContainer extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      newUser: {
        name: '',
        age: '',
        gender: '',
        skills: [],
        about: ''

      },

      genderOptions: ['Male', 'Female', 'Other'],
      skillOptions: ['Programming', 'Development', 'Design', 'Testing'],

      // testApiResponse: '',

    }
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleAge = this.handleAge.bind(this);
    this.handleFullName = this.handleFullName.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  /* This lifecycle hook gets executed when the component mounts */
  
  handleFullName(e) {
   let value = e.target.value;
   this.setState( prevState => ({ newUser : 
        {...prevState.newUser, name: value
        }
      }), () => console.log(this.state.newUser))
  }

  handleAge(e) {
       let value = e.target.value;
   this.setState( prevState => ({ newUser : 
        {...prevState.newUser, age: value
        }
      }), () => console.log(this.state.newUser))
  }

  handleInput(e) {
       let value = e.target.value;
       let name = e.target.name;
   this.setState( prevState => ({ newUser : 
        {...prevState.newUser, [name]: value
        }
      }), () => console.log(this.state.newUser))
  }

  handleTextArea(e) {
    console.log("Inside handleTextArea");
    let value = e.target.value;
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser, about: value
      }
      }), ()=>console.log(this.state.newUser))
  }


  handleCheckBox(e) {

    const newSelection = e.target.value;
    let newSelectionArray;

    if(this.state.newUser.skills.indexOf(newSelection) > -1) {
      newSelectionArray = this.state.newUser.skills.filter(s => s !== newSelection)
    } else {
      newSelectionArray = [...this.state.newUser.skills, newSelection];
    }

      this.setState( prevState => ({ newUser:
        {...prevState.newUser, skills: newSelectionArray }
      })
      )
  }

  handleFormSubmit(e) {
    e.preventDefault();
    // let userData = this.state.newUser;

    // Exmaple API call and handle response
    // fetch('http://localhost:9000/testAPI')
    //   .then(res => res.text())
    //   .then(res => this.setState({testApiResponse: res}));

    // fetch('http://localhost:9000/testAPI',{
    //   method: "POST",
    //   body: JSON.stringify(userData),
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    // }).then(response => {
    //   response.json().then(data =>{
    //     console.log("Successful" + data);
    //     // might need to fix this; have to see what response returns
    //     // return <Link to={"/results?data=data"} /> 
    //     // here make 3 calls, one to each vm server, for knn model send userdata
    //     // https://www.basefactor.com/react-how-to-display-a-loading-indicator-on-fetch-calls
    //   })
    // })
  }   

  handleClearForm(e) {
    e.preventDefault();
    this.setState({ 
      newUser: {
        name: '',
        age: '',
        gender: '',
        skills: [],
        about: ''
      },
    })
  }

  // **************************************
  // testAPI stuff

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ testApiResponse: res }));
  }

  componentWillMount() {
    this.callAPI();
  }
  // **************************************


  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
            <div className="col pt-5">
                <h2>Tell us a bit about yourself...</h2>
                {/* for test API */}
                {/* <p className="App-intro">;{this.state.testApiResponse}</p> */}
            </div>
        </div>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <form className="container-fluid" onSubmit={this.handleFormSubmit}>
              
              <div className="row">
                <div className="col-md-6">
                  <Input inputType={'number'} 
                    name={'age'}
                    title= {'Age'} 
                    value={this.state.newUser.age} 
                    placeholder = {'Enter your age'}
                    handleChange={this.handleAge} 
                  /> {/* Age */}
                </div>
                <div className="col-md-6">
                  {/* Add another field here */}
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
        
       {/* example feilds */}
        <Input inputType={'text'}
          title= {'Full Name'} 
          name= {'name'}
          value={this.state.newUser.name} 
          placeholder = {'Enter your name'}
          handleChange = {this.handleInput}
        /> {/* Name of the user */}
        <Select title={'Gender'}
          name={'gender'}
          options = {this.state.genderOptions} 
          value = {this.state.newUser.gender}
          placeholder = {'Select Gender'}
          handleChange = {this.handleInput}
        /> {/* Age Selection */}
        <CheckBox title={'Skills'}
          name={'skills'}
          options={this.state.skillOptions}
          selectedOptions = { this.state.newUser.skills}
          handleChange={this.handleCheckBox}
        /> {/* Skill */}
        <TextArea title={'About you.'}
          rows={3}
          value={this.state.newUser.about}
          name={'currentPetInfo'}
          handleChange={this.handleTextArea}
          placeholder={'Describe your past experience and skills'} 
        />{/* About you */}
      </div>
    );
  }
}

const buttonStyle = {
  margin : '20px 20px 20px 20px'
}

export default FormContainer;