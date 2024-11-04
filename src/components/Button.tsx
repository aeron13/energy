import React, { MouseEventHandler } from "react";

const Button: React.FC<{onClick: MouseEventHandler, children: React.ReactNode, selected: boolean}> = (props) => {
    return (
        <button 
            onClick={props.onClick} 
            className={`${props.selected ? 'bg-black' : 'bg-[#8e8e8e]'} text-white px-5 py-1 rounded`}
        >
            {props.children}
        </button>
    )
}

export default Button;