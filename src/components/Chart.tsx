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

              let color = '';
              let opacity = 0.6;
              switch(obj.type) {
                case 'Consumption':
                  color = `255, 171, 0`
                break
                case 'Production':
                  color = `43, 179, 160`
                break
                default:
                  color = '170, 180, 200'
                break
              };

              return {
                name: obj.type,
                type: 'line',
                data: obj.data,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                  color: `rgba(${color}, ${opacity})`
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: `rgba(${color}, ${opacity})`},
                    { offset: 1, color: `rgba(${color}, 0.05)` }
                  ])
                }
              }
            });

            const option = {
                color: ['#2bb3a0', '#ffab00', '#c4c5c6', '#3c424a'],
                grid: {
                    left: 60,
                    right: 10,
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