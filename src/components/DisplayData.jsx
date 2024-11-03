const DisplayData = ({ title, value, unit }) => {

    return (
        <div className="">
            <h4 className="font-semibold mb-2">{title}</h4>
            <div className="flex items-baseline gap-x-3">
                <p className="text-6xl font-bold">{value}</p>
                <p className="text-lg">{unit}</p>
            </div>
        </div>
    )
}

export default DisplayData;