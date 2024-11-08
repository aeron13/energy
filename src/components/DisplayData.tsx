import React from "react";

interface IDisplayData {
    title: string
    value: number|string
    unit: string
    color: string|undefined
}

const DisplayData: React.FC<IDisplayData> = (props) => {

    return (
        <div className="">
            <h4 className="mb-1 text-sm">{props.title}</h4>
            <div className="flex items-baseline gap-x-1">
                <p className={`text-4xl ${props.color ?? 'text-gray-20l'}`}>{props.value}</p>
                <p className="">{props.unit}</p>
            </div>
        </div>
    )
}

export default DisplayData;