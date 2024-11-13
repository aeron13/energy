import React from "react"

interface IDataGroup {
    title: string
    children: React.ReactNode
}

const DataGroup: React.FC<IDataGroup> = (props) => {
    return (
        <div className="data-group border-grey-30l">
            <h4>{props.title}</h4>
            <div className='flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:items-end'>
                {props.children}
            </div>
        </div>
    )
}

export default DataGroup