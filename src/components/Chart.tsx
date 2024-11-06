import * as echarts from 'echarts';
import React from 'react';
import { useEffect } from 'react';
import { ECharts } from 'echarts';

const Chart: React.FC<{data: any[], timestamps: any[], loading: boolean}> = (props) => {

    useEffect(() => {
        let eChart: ECharts|null = null
        if (!props.loading && props.data?.[0].data.length > 1) {

            const chartDom = document.getElementById('chart')!;
            eChart = echarts.init(chartDom);

            const option = {
                color: ['#2bb3a0', '#ffab00'],
                grid: {
                    left: 60,
                    right: 10
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
                series: [
                  {
                    name: props.data[0].type,
                    type: 'line',
                    smooth: false,
                    data: props.data[0].data,
                  },
                  {
                    name: props.data[1].type,
                    type: 'line',
                    smooth: false,
                    data: props.data[1].data,
                  },
                ]
            };
              
            eChart?.setOption(option);
        }
        
        return () => {
            eChart?.clear()
        }

    }, [props.loading])

    return(
        <div id="chart" className={`w-full h-[600px] ${props.loading && 'hidden'}`}></div>
    )

}

export default Chart