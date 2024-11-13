import React from "react";

interface IDisplayData {
    title: string
    value: number|string
    unit: string
    color: string|undefined
    size: string|undefined
}

const DisplayData: React.FC<IDisplayData> = (props) => {

    return (
        <div className="max-w-[240px]">
            <h4 className={`mb-1 ${props.size === 'sm' ? 'text-xs' : 'text-sm'}`}>{props.title}</h4>
            <div className="flex items-baseline gap-x-1">
                <p className={`${props.size === 'sm' ? 'text-lg' : 'text-3xl'} ${props.color ?? 'text-gray-20l'}`}>{props.value}</p>
                <p className={props.size === 'sm' ? 'text-xs' : ''}>{props.unit}</p>
            </div>
        </div>
    )
}

export default DisplayData;