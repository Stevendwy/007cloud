import React, {Component} from "react"
import Pagination from "pagination-react"
import CalendarSelector from "./calendarselector"

export default class InquireBrand extends Component {
	constructor() {
		super()
		this.state = {
			startDate: "待确认",
			endDate: "待确认",
			showCalendar: false,
			startClass: "date",
			endClass: "date",
			isInverted: false, //是否日期倒序
			footerData: [],
			count: 1, //页码总数
			date: [] //第一行显示的日期
		}

		this.currentType = -1 //记录当前点击的日期是开始还是结束
		this.currentPage = 1 //记录当前页码
		this.button = "daily" //日统计还是周统计
	}

	ajaxData(page, isSearch) {
		// console.log(page)
		this.currentPage = page
		Model.ajaxData(this, isSearch, res => {
			this.setState({
				footerData: res.data || [],
				count: res.amount_page,
				date: res.date_order
			})
		})
	}

	calendarClick(date) {
		let _date = new Date(date)
        let _month = _date.getMonth() + 1
        let _day = _date.getDate()
		_date = `${_date.getFullYear()}-${_month > 9 ? _month : ("0" + _month)}-${_day > 9 ? _day : ("0" + _day)}`
		let _state = {
			showCalendar: false,
			startClass: "date",
			endClass: "date"
		}
		switch (this.currentType) {
			case 0:
				_state.startDate = _date
				break
			case 1:
				_state.endDate = _date
				break
		}

		this.setState(_state)
	}

	toggleCalendar(type, e) {
		e.stopPropagation()

		let _showCalendar = null
		let _startClass = "date"
		let _endClass = "date"

		if(this.currentType == type) {
			_showCalendar = !this.state.showCalendar
			if(type == 0 && _showCalendar) _startClass = "date selected"
			else if(type == 1 && _showCalendar) _endClass = "date selected"
		}else {
			_showCalendar = true
			if(type == 0) _startClass = "date selected"
			else _endClass = "date selected"
		}

		this.currentType = type

		this.setState({
			showCalendar: _showCalendar,
			startClass: _startClass,
			endClass: _endClass
		})
	}

	showDay() {
		this.button = "daily"
		this.ajaxData(this.currentPage)
	}

	showWeek() {
		this.button = "weekly"
		this.ajaxData(this.currentPage)
	}

	search() {
		this.currentPage = 1 //搜索重新排序
		this.ajaxData(this.currentPage, true)
	}

	exportExcel() {
		Model.exportExcel(this, res => {
			window.open(res.path)
		})
	}

	render() {
		let _startDate = this.state.startDate
		let _endDate = this.state.endDate
		let _toggleCalendar = this.toggleCalendar
		let _showCalendar = this.state.showCalendar
		let _startClass = this.state.startClass
		let _endClass = this.state.endClass
		let _footerData = this.state.footerData
		let _date = this.state.date
		let _ajaxData = this.ajaxData.bind(this)
		let _showDay = this.showDay.bind(this)
		let _showWeek = this.showWeek.bind(this)
		let _search = this.search.bind(this)
		let _exportExcel = this.exportExcel.bind(this)

		return (
			<div className="container-inquirebrand">
				<div className="container-title">
					<span className="title">
						2.2品牌查询量统计
					</span>
					<div className="container-search" style={{display: "none"}}>
						<input ref="phone" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" defaultValue="搜索" onClick={_search}/>
					</div>
				</div>
				<div className="util">
					<div className="container-type">
						<input className={this.button == "daily" ? "button selected" : "button"} type="button" value="日统计" onClick={_showDay} />
						<input className={this.button == "weekly" ? "button selected" : "button"} type="button" value="周统计" onClick={_showWeek} />
					</div>
					<div className="container-date">
						<input className={_startClass} type="button" defaultValue={_startDate} onClick={_toggleCalendar.bind(this, 0)} />
						<span>起</span>
						<input className={_endClass} type="button" defaultValue={_endDate} onClick={_toggleCalendar.bind(this, 1)} />
						<span>止</span>
						<input className="export" type="button" defaultValue="导出Excel" onClick={_exportExcel} />
						<CalendarSelector
							show={_showCalendar}
							callback={this.calendarClick.bind(this)} />
					</div>
				</div>
				<div className="content">
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">品牌</div>
						<div className="item3">{_date[0] || ""}</div>
						<div className="item4">{_date[1] || ""}</div>
						<div className="item5">{_date[2] || ""}</div>
						<div className="item6">{_date[3] || ""}</div>
						<div className="item7">{_date[4] || ""}</div>
						<div className="item8">{_date[5] || ""}</div>
						<div className="item9">{_date[6] || ""}</div>
					</div>
					<Footer data={_footerData} />
				</div>
				<div className="container-pagination">
					<Pagination
						count={this.state.count}
						groupCount={5}
						selectedCount={1}
						callback={selectedIndex => _ajaxData(selectedIndex)}/>
				</div>
			</div>
		)
	}
}

class Footer extends Component {
	getItems() {
		let _items = this.props.data.map((item, index) => {
			return (
				<div className="footer" key={index}>
					<div className="item1">{item.index}</div>
					<div className="item2">{item.brand}</div>
					<div className="item3">{item.query[0] || 0}</div>
					<div className="item4">{item.query[1] || 0}</div>
					<div className="item5">{item.query[2] || 0}</div>
					<div className="item6">{item.query[3] || 0}</div>
					<div className="item7">{item.query[4] || 0}</div>
					<div className="item8">{item.query[5] || 0}</div>
					<div className="item9">{item.query[6] || 0}</div>
				</div>
			)
		})

		return _items
	}

	render() {
		return (
			<div className="container-footer">
				{this.getItems()}
			</div>
		)
	}
}

class Model {
	static ajaxData(v, isSearch, callback) {

		let _url = `${hostPort}/brand_query_statis`
		let _obj = {
			page: v.currentPage,
			time_format: v.button,
			mode: "query"
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static exportExcel(v, callback) {
		let _url = `${hostPort}/brand_query_statis_excel`
		let _obj = {
			start_time: v.state.startDate,
			end_time: v.state.endDate,
			time_format: v.button
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
