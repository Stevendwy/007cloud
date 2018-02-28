import React, {Component} from "react"
import Pagination from 'pagination-react'
import {Prompt} from 'dialog-react'
import CalendarSelectorPay from "./calendarselector-pay"
import Signin from './signin-react'

export default class Pay extends Component {
	constructor() {
		super()
		this.state = {
			showbtnlogs:false,   //是否显示人工记录按钮
			startDate: "2017-04-01",
			endDate: "待确认",
			showCalendar: false,
			startClass: "date",
			endClass: "date",
			titleData:{}, 				//将整体数据获取 用于title展示
			footerData: [],
			count: 1, //页码总数
			showAdd: false, 			//显示添加框
			showDialog: false , 		
			showSign:false,				//显示人工记录
		}
		this.currentPage = 1
		this.button = "paid_user"
		this.operation = ""
		this.id = -1
		this.uid = -1 //保存点击 sos 产生的 uid
		this.enddata= ""  //保存默认时间
		this.startdata = "" 
	}

	//请求数据
	dataList(page, isSearch,end_datetime={}) {
		this.currentPage = page
		 end_datetime = {
			start_datetime:this.state.startDate,
			end_datetime:this.state.endDate
		}
		Model.dataList(this, isSearch,end_datetime, res => {
			if (isSearch==true && res.data.length==0) {
				alert("无此账号信息")
			}
			let _manually_record_enable = res.manually_record_enable === 1 ? true : false
			this.setState({
				showbtnlogs:_manually_record_enable,   //是否显示人工记录按钮
				titleData:res,
				footerData: res.data,
				count: res.amount_page,
				showDialog: false //顺便关掉 dialog
			}, this.clearData) //获取成功后，顺便清空下一编辑输入框
		})
	}

	showAll() {
		this.button = "all"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showPaid() {
		this.button = "paid_user"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showNotPaid() {
		this.button = "not_paid_user"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showSOS() {
		this.button = "sos"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showNet(){
		this.button = "natural"
		this.isScreen()
	}

	showManual(){
		this.button = "manual"
		this.isScreen()
	}

	search() {
		this.isScreen(true)
		// this.dataList(this.currentPage, true)
	}

	//列表右侧 sos 点击事件
	sosClick(uid) {
		this.uid = uid
		this.setState({
			showDialog: true 
		})
	}

	sosHandle() {
		Model.sosClick(this.uid, res => {
			this.isScreen()
			// this.dataList(this.currentPage, false)
		})
	}

	resetDate(){
		this.setState({
			startDate: this.startdata,
        	endDate: this.enddata
        },()=>{
        	this.isScreen()
        })
	}

	isScreen(types=false){
		// console.log(types)
		let _isScreen = {
			start_datetime:this.state.startDate,
			end_datetime:this.state.endDate
		}
		if (this.state.startDate == "2017-04-01" && this.state.endDate == this.enddata) {
			_isScreen = {}
		}
		this.dataList(this.currentPage, types , _isScreen)
	}

	articifial(){
		this.setState({
			showSign:true
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
	
	// 日期筛选 
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

	componentWillMount(){
		let _date = new Date()
		let _year = _date.getFullYear()
        let _month = _date.getMonth() + 1
        let _day = _date.getDate()
        let _dayaddzero = _day < 10 ? "0" + _day : _day
        let _enddata = _year + "-" + _month + "-" + _dayaddzero
        let _startdata = _year + "-" + _month + "-" + "01"
        this.enddata = _enddata
        this.startdata = _startdata
        this.setState({
        	startDate:_startdata,
        	endDate: _enddata
        })
	}

    render() {
    	let _footerData = this.state.footerData
    	let _showAll = this.showAll.bind(this)
    	let _showPaid = this.showPaid.bind(this)
    	let _showNotPaid = this.showNotPaid.bind(this)
    	let _showSOS = this.showSOS.bind(this)
    	let _showNet = this.showNet.bind(this)
    	let _showManual = this.showManual.bind(this)


    	let _dataList = this.dataList.bind(this)
    	let _sosClick = this.sosClick.bind(this)
    	let _sosHandle = this.sosHandle.bind(this)

    	let _titleData = this.state.titleData
    	let _startClass = this.state.startClass
		let _endClass = this.state.endClass
		let _startDate = this.state.startDate
		let _endDate = this.state.endDate
		let _toggleCalendar = this.toggleCalendar
		let _showCalendar = this.state.showCalendar

		let _showbtnlogs = this.state.showbtnlogs ? "inline-block":"none"

        return (
            <div className="container-pay">
				<div className="container-title">
					<span className="title">
						4.1支付
					</span>
					<div className="container-search">
						<input ref="phone" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" defaultValue="搜索" onClick={this.search.bind(this)}/>
					</div>
				</div>
				<div className="content">
					<div className="util">
						<div className="container-first">
							<div className="container-money">
								<div className="lastmonth">
									<div>上月：</div>
									<div>付款人数：</div>
									<div>{_titleData.last_payment_individuals}</div>
									<div>付款人次：</div>
									<div>{_titleData.last_payment_times}</div>
									<div>到账金额：</div>
									<div>{_titleData.last_monthly_turnover}</div>
								</div>
								<div className="thismonth">
									<div>本月：</div>
									<div>付款人数：</div>
									<div>{_titleData.payment_individuals}</div>
									<div>付款人次：</div>
									<div>{_titleData.payment_times}</div>
									<div>到账金额：</div>
									<div>{_titleData.monthly_turnover}</div>
								</div>
							</div>
						</div>

						<div className="container-second">
							<div className="container-screen">
								{/*<div className="container-data">购买日期：</div>*/}
								<input className={_startClass} type="button" defaultValue={_startDate} onClick={_toggleCalendar.bind(this, 0)} />
								<div className="container-data-slide">-</div>
								<input className={_endClass} type="button" defaultValue={_endDate} onClick={_toggleCalendar.bind(this, 1)} />
								<CalendarSelectorPay
									show={_showCalendar}
									callback={this.calendarClick.bind(this)} />
								<input className="screen-btn" type="button" value="查询" onClick={this.isScreen.bind(this,false)} />
								<input className="screen-btn" type="button" value="重置" onClick={this.resetDate.bind(this)} />
								<input className="screen-btn" type="button" value="人工记录" 
								style={{display: _showbtnlogs}}
								onClick={this.articifial.bind(this)} />
							</div>
							<div className="container-type">
								<input className={this.button == "paid_user" ? "button selected" : "button"} type="button" value="支付用户" onClick={_showPaid} />
								<input className={this.button == "not_paid_user" ? "button selected" : "button"} type="button" value="未支付用户" onClick={_showNotPaid} />
								<input className={this.button == "sos" ? "button selected" : "button"} type="button" value="SOS" onClick={_showSOS} />
								<input className={this.button == "natural" ? "button selected" : "button"} type="button" value="网络" onClick={_showNet} />
								<input className={this.button == "manual" ? "button selected" : "button"} type="button" value="人工" onClick={_showManual} />
							</div>
						</div>

					</div>
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">手机号</div>
						<div className="item3">姓名</div>
						<div className="item4">公司</div>
						<div className="item5">用户来源</div>
						<div className="item11">销售促进</div>
						<div className="item12">套餐</div>
						<div className="item8">购买日期</div>
						<div className="item6">应付金额</div>
						<div className="item7">到账金额</div>
						
						<div className="item9">到期日期</div>
						<div className="item10">用户反馈</div>
						<div className="item13">支付方式</div>
						<div className="item14">记录人</div>
						<div className="item15">备注</div>
					</div>
					<Footer data={_footerData}
						sosClick={_sosClick}/>
						<div className="world">*黄色账号：已支付账号</div>
						<div className="container-pagination">
							<Pagination
								count={this.state.count}
								groupCount={5}
								selectedCount={1}
								callback={page => _dataList(page, false)}/>
						</div>
				</div>

				{this.state.showSign ? <Signin callback={()=>{this.setState({showSign:false})}} /> : null}
				
				<Prompt
				    content="已处理完毕？"
				    confirm="取消"
				    other="确定"
				    show={this.state.showDialog}
				    fun={_sosHandle}
				    close={() => this.setState({showDialog: false})} />
			</div>
        )
    }
}

class Footer extends Component {
	getItems() {
		let _sosClick = this.props.sosClick

		let _items = this.props.data.map((item, index) => {
			let _footerClass = item.user_expired == 0 ? "footer" : "footer expired"
			let _paidclass = item.membership == 0 ? "item2" : "item2  paid"
			let _sos = item.sos == 1 ? "sos":""
			return (
				<div className={_footerClass} key={index}>
					<div className="item1">{item.index}</div>
					<div className={_paidclass}>{item.username}</div>
					<div className="item3">{item.full_name}</div>
					<div className="item4">{item.company}</div>
					<div className="item5">{item.code}</div>
					<div className="item11">{item.coupon_from}</div>
					<div className="item12">{item.title}</div>
					<div className="item8">{item.purchased_time}</div>
					<div className="item6">{item.purchase_payment}</div>
					<div className="item7">{item.received_payment}</div>					
					<div className="item9">{item.valid_datetime}</div>
					<div className="item10 sos">{_sos}</div>
					<div className="item13">{item.payment_method}</div>
					<div className="item14">{item.data_recorder}</div>
					<div className="item15">{item.remark}</div>
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
	static dataList(v, isSearch,isScreen, callback) {
		let _phone = v.refs.phone.value
		if(isSearch && _phone.length < 1) return

		let _url = `${hostPort}/payment_info`
		let _obj = {
			filter: v.button,
			page: v.currentPage
		}

		if(isScreen != {}) {
			_obj.start_datetime = isScreen.start_datetime
			_obj.end_datetime = isScreen.end_datetime
		}

		if(isSearch) {
			_obj.username = _phone
			_obj.page = 1
		}
			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static sosClick(uid, callback) {
		let _url = `${hostPort}/pay_fb_oper`
		let _obj = {
			uid: uid
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
