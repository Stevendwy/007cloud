import React, {Component} from "react"

export default class OperationData extends Component {

	componentDidMount() {
		let _url = `${hostPort}/api_visit_data`

		getAjax(_url, {}, res => {
			this.renderEchats(res.data)
		})
	}

	analysisNumber(data) {
	    let obj = {
	        brand_name: [],
	        api_usage_percentage: [],
	        api_searching_volumn: []
	    }
	    for(let i = 0, l = data.length; i < l; i ++) {
	        let dataSub = data[i]
	        obj.brand_name.push(dataSub.brand_name)
	        obj.api_usage_percentage.push(dataSub.api_usage_percentage)
	        obj.api_searching_volumn.push(dataSub.api_searching_volumn)
	    }
	    
	    return obj
	}

	analysisPercent(data) {
	    let arr = []
	    for(let i = 0, l = data.length; i < l; i ++) {
	        let dataSub = data[i]
	        let obj = {
	            value: dataSub.api_searching_volumn,
	            name: dataSub.brand_name + ' ' + dataSub.api_usage_percentage
	        }
	        arr.push(obj)
	    }
	    
	    return arr
	}

	renderEchats(data) {
	    // 基于准备好的dom，初始化echarts实例
	    let portTimes = echarts.init(this.refs.porttimes)
	    let objNumber = this.analysisNumber(data)
	    // 指定图表的配置项和数据
	    let optionPortTimes = {
	        title: {
	            text: ''
	        },
	        tooltip: {},
	        legend: {
	            data: ['次']
	        },
	        xAxis: {
	            data: objNumber.brand_name
	        },
	        yAxis: {},
	        series: [{
	            name: '',
	            type: 'bar',
	            data: objNumber.api_searching_volumn
	        }]
	    }

	    // 使用刚指定的配置项和数据显示图表。
	    portTimes.setOption(optionPortTimes)

	    let portTimesPercent = echarts.init(this.refs.porttimespercent)
	    let objPercent = this.analysisPercent(data)
	    let optionPortTimesPercent = {
	        baseOption: {
	            backgroundColor: '#2c343c',
	            visualMap: {
	                show: false,
	                min: 80,
	                max: 600,
	                inRange: {
	                    colorLightness: [0, 1]
	                }
	            },
	            series: [{
	                name: '访问来源',
	                type: 'pie',
	                radius: '55%',
	                data: objPercent,
	                roseType: 'angle',
	                label: {
	                    normal: {
	                        textStyle: {
	                            color: 'rgba(255, 255, 255, 0.3)'
	                        }
	                    }
	                },
	                labelLine: {
	                    normal: {
	                        lineStyle: {
	                            color: 'rgba(255, 255, 255, 0.3)'
	                        }
	                    }
	                },
	                itemStyle: {
	                    normal: {
	                        color: '#c23531',
	                        shadowBlur: 200,
	                        shadowColor: 'rgba(0, 0, 0, 0.5)'
	                    }
	                }
	            }]
	        },
	        media: [{
	            option: {
	                legend: {
	                    left: 0,
	                    top: 0,
	                    right: 0,
	                    bottom: 0
	                },
	                series: [{
	                    radius: [0, '50%'],
	                    center: ['50%', '50%']
	                }]
	            }
	        }]
	    }

	    portTimesPercent.setOption(optionPortTimesPercent)

	    //用于使chart自适应高度和宽度
        portTimes.resize()
        portTimesPercent.resize()
	}


	render() {
		return (
			<div className="container-thirdapi">
				<div className="container-title">
					<span className="title">
						1.1 第三方接口
					</span>
				</div>
				<div className="content">
					<div className="title">
						<span>接口查询量（单词：次）</span>
						<span className="remind">数据更新于整点双数时间，如2点、4点、6点、8点、10点、12点</span>
					</div>
		            <div className="container-parttimes">
		                <div ref="porttimes" className="parttimes"></div>
		            </div>
		            <div className="title">接口调用占比</div>
		            <div ref="porttimespercent" className="porttimespercent"></div>
				</div>
			</div>
		)
	}
}
