import React, { MouseEventHandler } from "react";

const Button: React.FC<{onClick: MouseEventHandler, children: React.ReactNode, selected: boolean, disabled: boolean}> = (props) => {
    return (
        <button 
            onClick={props.onClick} 
            className={`${props.selected ? 'bg-teal text-white border-teal' : 'border-grey-30l'} ${props.disabled && 'opacity-50 pointer-events-nont'} border px-5 py-1 rounded`}
        >
            {props.children}
        </button>
    )
}

export default Button;