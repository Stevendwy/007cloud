import React, {Component} from "react"
import Pagination from "pagination-react"
import CalendarSelector from "./calendarselector"

export default class InquireErrorBack extends Component {
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
			isRefreshing: false 
		}

		this.currentType = -1 //记录当前点击的日期是开始还是结束
		this.currentPage = 1 //记录当前页码
	}

	componentDidMount() {
		this.createTriangle()
	}

	ajaxData(page) {
		// console.log(page)
		this.currentPage = page
		this.setState({isRefreshing: true}, () => {
			postAjax(`${hostPort}/query_error_refresh`, {}, res => {
				let _url = `${hostPort}/query_error`
				let _obj = {
					page: this.currentPage,
					order: this.state.isInverted ? "asc" : "desc"
				}
		
				getAjax(_url, _obj, res => {
					// console.log(res)
					this.setState({
						footerData: res.data || [],
						count: res.amount_page,
						isRefreshing: false
					})
				})
			})
		})
	}

	createTriangle() {
		let _canvas = this.refs.triangle
		_canvas.width = 5
		_canvas.height = 5
		var cxt=_canvas.getContext('2d')
		cxt.beginPath()
		cxt.moveTo(0,0)
		cxt.lineTo(5,0)
		cxt.lineTo(3,5)
		cxt.closePath()
		cxt.fill()
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

	invert() {
		this.setState({
			isInverted: !this.state.isInverted 
		}, () => {
			this.ajaxData(this.currentPage)
		})
	}
	
	exportExcel() {
		Model.exportExcel(this, res => {
			window.open(res.path)
		})
	}

	refresh() {
		this.ajaxData(this.currentPage)	
	}

	render() {
		let _startDate = this.state.startDate
		let _endDate = this.state.endDate
		let _toggleCalendar = this.toggleCalendar
		let _showCalendar = this.state.showCalendar
		let _startClass = this.state.startClass
		let _endClass = this.state.endClass
		let _invert = this.invert.bind(this)
		let _isInverted = this.state.isInverted
		let _footerData = this.state.footerData
		let _ajaxData = this.ajaxData.bind(this)
		let _exportExcel = this.exportExcel.bind(this)
		let _refresh = this.refresh.bind(this)

		return (
			<div className="container-inquireerrorback">
				<div className="container-title">
					<span className="title">
						5.2查询错误量返回
					</span>
					<span className="refresh" onClick={_refresh}>
						刷新
					</span>
				</div>
				<div className="util">
					<input className={_startClass} type="button" defaultValue={_startDate} onClick={_toggleCalendar.bind(this, 0)} />
					<span>起</span>
					<input className={_endClass} type="button" defaultValue={_endDate} onClick={_toggleCalendar.bind(this, 1)} />
					<span>止</span>
					<input className="export" type="button" defaultValue="导出Excel" onClick={_exportExcel} />
					<CalendarSelector
						show={_showCalendar}
						callback={this.calendarClick.bind(this)} />
				</div>
				<div className="content">
					<span style={{display: this.state.isRefreshing ? "block" : "none"}}>刷新查找中...</span>
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">失败内容</div>
						<div className="item3">来源</div>
						<div className="special-item" onClick={_invert}>
							<span>日期</span>
							<canvas ref="triangle" className={_isInverted ? "triangle invert" : "triangle"}></canvas>
						</div>
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
					<div className="item1">{item.index || index + 1}</div>
					<div className="item2">{item.errors}</div>
					<div className="item3">{item.source}</div>
					<div className="item4">{item.date}</div>
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
	static exportExcel(v, callback) {
		let _url = `${hostPort}/query_error_excel`
		let _obj = {
			start_time: v.state.startDate,
			end_time: v.state.endDate
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
