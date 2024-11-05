import React from "react";
import type { TDisplayData } from "../types";

const DisplayData: React.FC<TDisplayData> = (props) => {

    return (
        <div className="">
            <h4 className="font-semibold mb-2">{props.title}</h4>
            <div className="flex items-baseline gap-x-3">
                <p className="text-6xl font-bold">{props.value}</p>
                <p className="text-lg">{props.unit}</p>
            </div>
        </div>
    )
}

export default DisplayData;