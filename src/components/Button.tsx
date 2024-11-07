import React, { MouseEventHandler } from "react";

interface IButton {
    onClick: MouseEventHandler, 
    children: React.ReactNode, 
    selected: boolean
}

const Button: React.FC<IButton> = (props) => {
    return (
        <button 
            onClick={props.onClick} 
            className={`${props.selected ? 'bg-teal text-white border-teal' : 'border-grey-30l'} border px-5 py-1 rounded`}
        >
            {props.children}
        </button>
    )
}

export default Button;