import React from "react";

const Button = ({onClick, children, selected}) => {
    return (
        <button onClick={onClick} className={`${selected ? 'bg-black' : 'bg-[#8e8e8e]'} text-white px-5 py-1 rounded`}>
            {children}
        </button>
    )
}

export default Button;