import React from 'react';


const CheckBox = (props) => {
	return( <div className="form-group">
    <label for={props.name} className="form-label">{props.title}</label>
    <div className="form-check">
      {props.options.map(option => {
        return (
          <label key={option} className="form-check-inline">
            <input
              id = {props.name}
              name={props.name}
              onChange={props.handleChange}
              value={option}
              checked={ props.selectedOptions.indexOf(option) > -1 }
              type="checkbox"
              className="form-check m-1" 
            /> {option}
          </label>
        );
      })}
    </div>
  </div>
);

}

export default CheckBox;