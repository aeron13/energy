import React, { MouseEventHandler } from "react";

interface IButton {
    onClick: MouseEventHandler, 
    children: React.ReactNode, 
    selected: boolean, 
    disabled: boolean
}

const Button: React.FC<IButton> = (props) => {
    return (
        <button 
            onClick={props.onClick} 
            className={`${props.selected ? 'bg-teal text-white' : ''} ${props.disabled && 'opacity-50 pointer-events-none'} px-5 py-1 lg:py-2 rounded-lg`}
        >
            {props.children}
        </button>
    )
}

export default Button;