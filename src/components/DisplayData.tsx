import React from "react";
import type { TDisplayData } from "../ts/types";

const DisplayData: React.FC<TDisplayData> = (props) => {

    return (
        <div className="">
            <h4 className="font-semibold mb-1 text-sm">{props.title}</h4>
            <div className="flex items-baseline gap-x-1">
                <p className={`text-4xl ${props.color ?? 'text-gray-20l'}`}>{props.value}</p>
                <p className="">{props.unit}</p>
            </div>
        </div>
    )
}

export default DisplayData;