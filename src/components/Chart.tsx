import * as echarts from 'echarts';
import React from 'react';
import { useEffect } from 'react';
import { ECharts } from 'echarts';

interface IChartData {
  type: string
  data: string|number[]
}

interface IChart {
  data: IChartData[], 
  timestamps: string[], 
  loading: boolean
}

const Chart: React.FC<IChart> = (props) => {

    useEffect(() => {
        let eChart: ECharts|null = null
        if (!props.loading && props.data?.[0].data.length > 1) {

            const chartDom = document.getElementById('chart')!;
            eChart = echarts.init(chartDom);

            const series = props.data.map(obj => {
                return {
                    name: obj.type,
                    type: 'line',
                    smooth: false,
                    data: obj.data,
                }
            })

            const option = {
                color: ['#2bb3a0', '#ffab00', '#c4c5c6', '#3c424a'],
                grid: {
                    left: 60,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: props.timestamps
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value} W'
                  },
                  axisPointer: {
                    snap: true
                  }
                },
                series: series
            };
              
            eChart?.setOption(option);
        }
        
        return () => {
            eChart?.clear()
        }

    }, [props.loading])

    return(
        <div id="chart" className={`relative w-full h-[400px] lg:h-[600px] overflow-x-scroll ${props.loading && 'hidden'}`}></div>
    )

}

export default Chart