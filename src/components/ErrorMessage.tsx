import React from "react";

const ErrorMessage = ({message = 'An error occured'}) => {
    return (
        <div>{message}</div>
    )
}

export default ErrorMessage;