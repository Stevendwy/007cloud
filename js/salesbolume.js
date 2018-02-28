/*
* @Author: steven
* @Date:   2017-09-01 14:51:07
* @Last Modified by:   steven
* @Last Modified time: 2017-11-14 14:25:00
*/
import React, {Component} from "react"
import Pagination from 'pagination-react'

export default class SalesVolume extends Component {
	constructor() {
		super()
		this.state = {
			footerData: [],
			button:"montly"
		}
		this.button = "montly"
	}

	//请求数据
	dataList() {
		Model.dataList(this, res => {
			//console.log(res)
			this.setState({
				footerData: res.data,
			}) //获取成功后，顺便清空下一编辑输入框
		})
	}

	showWeek() {
		this.button = "weekly"
		this.dataList()
		this.setState({
			button:"weekly"
		})
	}

	showMonth() {
		this.button = "montly"
		this.dataList()
		this.setState({
			button:"montly"
		})
	}

	componentDidMount(){
		this.dataList()
	}

    render() {
    	let _footerData = this.state.footerData
    	let _showWeek = this.showWeek.bind(this)
    	let _showMonth = this.showMonth.bind(this)
    	let _buttontype = this.state.button

        return (
            <div className="container-salesbolume">
				<div className="container-title">
					<span className="title">
						4.2 销售团队明细
					</span>
				</div>
				<div className="content">
					<div className="util">
						<div className="container-type">
							<input className={this.button == "montly" ? "button selected" : "button"} type="button" value="月统计" onClick={_showMonth} />
							<input className={this.button == "weekly" ? "button selected" : "button"} type="button" value="周统计" onClick={_showWeek} />
						</div>
					</div>
					<div className="contentbody">
						<div className="head">
							<div className="item"></div>
							<div className="item">开通账号</div>
							<div className="item">付费账号</div>
							<div className="item">付费金额</div>
						</div>
						<Footer data={_footerData} type={_buttontype} />
					</div>
				</div>
			</div>
        )
    }
}

class Footer extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	  this.typeMonth = ["上月","本月"]
	  this.typeWeek = ["上周","本周"]
	  this.title = ["序号","人员","部门"]
	}

	getTitle(){
		let _type = this.props.type == "weekly" ? this.typeWeek : this.typeMonth
		return (
			<div className="footer">
					<div className="item">{this.title[0]}</div>
					<div className="item">{this.title[1]}</div>
					<div className="item">{this.title[2]}</div>
					<div className="item">{_type[0]}</div>
					<div className="item">{_type[1]}</div>
					<div className="item">{_type[0]}</div>
					<div className="item">{_type[1]}</div>
					<div className="item">{_type[0]}</div>
					<div className="item">{_type[1]}</div>
				</div>
		)
	}

	getItems() {
		let _items = this.props.data.map((item, index) => {
			let _footerClass = item.total_money_current_period != 0 ? "footer" : "footer expired"
			return (
				<div className={_footerClass} key={index}>
					<div className="item">{item.index}</div>
					<div className="item">{item.full_name}</div>
					<div className="item">{item.department}</div>
					<div className="item">{item.account_opened_last_period}</div>
					<div className="item">{item.account_opened_current_period}</div>
					<div className="item">{item.annual_membership_last_period}</div>
					<div className="item">{item.annual_membership_current_period}</div>
					<div className="item">{item.total_money_last_period}</div>
					<div className="item">{item.total_money_current_period}</div>
				</div>
			)
		})

		return _items
	}

	render() {
		return (
			<div className="container-footer">
				{this.getTitle()}
				{this.getItems()}
			</div>
		)
	}
}

class Model {
	static dataList(v, callback) {
		let _url = `${hostPort}/sales_team_performance_indicator`
		let _obj = {
			filter: v.button
		}			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
