import React from 'react';


const LoadingSpinner = (props) => {
    return (
        <div>
            <div className="spinner-border text-primary mt-5" style={{width: 10+'rem', height: 10+'rem'}}  role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-5">This make take a few moments...</p>
        </div>
    )}

export default LoadingSpinner;
