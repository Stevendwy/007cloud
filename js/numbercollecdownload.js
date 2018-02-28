import React,{Component} from 'react' 
import CalendarSelector from './calendarselector'
export default class Typedownload extends Component{
	constructor(props) {
	  super(props);

	  this.state = {
	  	showbutton:"daily",//按钮转态
	  	startDate: "待确认",
		endDate: "待确认",
		showCalendar: false,
		startClass: "date",
		endClass: "date",
	  	imgShow:["img/numbercollection/choose.png","img/numbercollection/unchoose.png"]
	  };
	  this.button = "daily" //日统计还是周统计
	  this.currentType = -1 //记录当前点击的日期是开始还是结束
	  this.currentPage = 1 //记录当前页码
	  this.downtype="daily"
	}
	dayClick(whitch){
		let _order=["img/numbercollection/choose.png","img/numbercollection/unchoose.png"]
		let _reverse=["img/numbercollection/unchoose.png","img/numbercollection/choose.png"]
		let _reverses=whitch?_order:_reverse
		let _type=whitch?"daily":"weekly"
		this.downtype=_type//用于下载用参数
		this.setState({
			imgShow:_reverses
		})
		this.props.typeChoose(_type)//给上层传状态
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
		this.setState({
			showbutton:"daily"
		})
		// this.ajaxData(this.currentPage)
		this.props.typeChoose("daily")//给上层传状态
	}

	showWeek() {
		this.button = "weekly"
		this.setState({
			showbutton:"weekly"
		})
		// this.ajaxData(this.currentPage)
		this.props.typeChoose("weekly")//给上层传状态
	}

	showMonth(){
		this.button = "monthly"
		this.setState({
			showbutton:"monthly"
		})
		// this.ajaxData(this.currentPage)
		this.props.typeChoose("monthly")//给上层传状态
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
	// <CalendarSelector show={true} callback={() => console.log("build")} />
	render(){
		let _imgday=this.state.imgShow[0]
		let _imgweek = this.state.imgShow[1]
		let _starttime=this.props.gettime.timestart
		let _endtime=this.props.gettime.timeend


		let _startDate = this.state.startDate
		let _endDate = this.state.endDate

		let _toggleCalendar = this.toggleCalendar

		let _showCalendar = this.state.showCalendar
		let _startClass = this.state.startClass
		let _endClass = this.state.endClass

		let _showDay = this.showDay.bind(this)
		let _showWeek = this.showWeek.bind(this)
		let _showMonth = this.showMonth.bind(this)
		let _exportExcel = this.exportExcel.bind(this)
		return(
			<div className="util">
				<div className="container-type">
					<input className={this.button == "daily" ? "button selected" : "button"} 
						type="button" 
						// checked={this.state.showbutton == "daily"?true:false}  radio
						value="日统计"
						onClick={_showDay} />
					<input className={this.button == "weekly" ? "button selected" : "button"}
						 type="button" 
						 // checked={this.state.showbutton == "weekly"?true:false} 
						 value="周统计" 
						 onClick={_showWeek} />
					<input className={this.button == "monthly" ? "button selected" : "button"} 
						type="button" 
						// checked={this.state.showbutton == "monthly"?true:false} 
						value="月统计" 
						onClick={_showMonth} />
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
		)
	}
}


class Model {
	static ajaxData(v, isSearch, callback) {

		let _url = `${hostPort}/excelexpt`
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
		let _url = `${hostPort}/excelexpt`
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
