import React, {Component} from "react"
import Pagination from "pagination-react"
import CalendarSelector from "./calendarselector"
import {Prompt} from 'dialog-react'
import AccountRenew from './accountrenew'

export default class AccountManage extends Component {
	constructor() {
		super()
		this.state = {
			startDate: "待确认",
			endDate: "待确认",
			showCalendar: false,
			startClass: "date",
			endClass: "date",
			registerInverted: false, //是否开通日期倒序
			validInverted: false, //是否到期日期倒序
			footerData: [],
			footerDaydate:[],    	//天记录
			footerWeekdate:[], 		//周记录
			datarenew:0 ,			//是否有权限延期
			count: 1 //页码总数
		}

		this.button = "all"
		this.currentType = -1 //记录当前点击的日期是开始还是结束
		this.currentPage = 1 //记录当前页码
		this.ord_dep = "register_datetime" //当前点击的那个日期排序按钮
		this.isInvert = "desc" //是否倒序，依赖排序按钮
	}

	componentDidMount() {
		//创建小三角
		Model.createTriangle([this.refs.triangle1, this.refs.triangle2])
	}

	ajaxData(page, isSearch) { 
		this.currentPage = page
		Model.ajaxData(this, isSearch, res => {
			this.setState({
				datarenew:res.renew_enable || 0 ,
				footerData: res.data || [],
				footerDaydate:res.date_order || [],
				footerWeekdate:res.week_order || [],
				count: res.amount_page || 1
			})
			// 刷新数据列表
			this.getDaylist()
			this.getWeeklist()
		})
	}

	invert(isRegister) {
		let _obj = {}
		if(isRegister) {
			this.ord_dep = "register_datetime"
			_obj.registerInverted = !this.state.registerInverted
			this.isInvert = _obj.registerInverted ? "asc" : "desc"
		}else {
			this.ord_dep = "valid_datetime"
			_obj.validInverted = !this.state.validInverted
			this.isInvert = _obj.validInverted ? "asc" : "desc"
		}
		this.setState(_obj, () => {
			this.ajaxData(this.currentPage)
		})
	}

	showType(isAll) {
		this.button = isAll
		this.ajaxData(this.currentPage)
	}

	search() {
		this.currentPage = 1 //搜索重新排序
		this.ajaxData(this.currentPage, true)
	}

	getDaylist(){
		let _daylist = this.state.footerDaydate
		let _returnlist = <div></div>
		if (_daylist!=[]) {
			_returnlist = _daylist.map((item,index)=>{
				let _classnum = 13 + index
				let _class = "item" + _classnum
				return (
					<div key={index} className={_class}>{item}</div>
					)
			}) 
		}

		return _returnlist
	}

	getWeeklist(){
		let _weeklist = this.state.footerWeekdate
		let _returnlist = <div></div>
		if (_weeklist!=[]) {
			_returnlist = _weeklist.map((item,index)=>{
				let _classnum = 12 + index
				let _class = "item" + _classnum
				return (
					<div key={index} className={_class}>{item}</div>
				)
			}) 
		}

		return _returnlist

	}

	render() {
		let _startDate = this.state.startDate
		let _endDate = this.state.endDate
		let _toggleCalendar = this.toggleCalendar
		let _showCalendar = this.state.showCalendar
		let _startClass = this.state.startClass
		let _endClass = this.state.endClass
		let _registerInverted = this.state.registerInverted
		let _validInverted = this.state.validInverted
		let _footerData = this.state.footerData
		let _footerDaydate = this.state.footerDaydate
		let _footerWeekdate = this.state.footerWeekdate
		let _datarenew = this.state.datarenew


		let _invert = this.invert.bind(this)
		let _ajaxData = this.ajaxData.bind(this)
		let _showType = this.showType.bind(this)
		let _search = this.search.bind(this)

		return (
			<div className="container-accountmanage">
				<div className="container-title">
					<span className="title">
						3.2用户管理
					</span>
					<div className="container-search">
						<input ref="phone" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" defaultValue="搜索" onClick={_search}/>
					</div>
				</div>
				<div className="util">
					<div className="container-type">
						<input className={this.button == "all" ? "button selected" : "button"} type="button" value="全部" onClick={() => _showType("all")} />
						<input className={this.button == "membership" ? "button selected" : "button"} type="button" value="支付用户" onClick={() => _showType("membership")} />
						<input className={this.button == "notpaid" ? "button selected" : "button"} type="button" value="未支付用户" onClick={() => _showType("notpaid")} />
						<input className={this.button == "shutdown" ? "button selected" : "button"} type="button" value="到期用户" onClick={() => _showType("shutdown")} />
					</div>
				</div>
				<div className="content">
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">账号</div>
						<div className="item3">姓名</div>
						<div className="item4">公司</div>
						{/*<div className="item5">昨日查询量</div>*/}
						<div className="special-item1" onClick={() => _invert(true)}>
							<span>注册日期</span>
							<canvas ref="triangle1" className={_registerInverted ? "triangle invert" : "triangle"}></canvas>
						</div>
						<div className="special-item2" onClick={() => _invert()}>
							<span>到期日期</span>
							<canvas ref="triangle2" className={_validInverted ? "triangle invert" : "triangle"}></canvas>
						</div>
						<div className="item5">品牌权限</div>
						<div className="item8">用户来源</div>
						<div className="item9">发放金额</div>
						<div className="item10">提现金额</div>
						<div className="item11">现金余额</div>

						
						{this.getWeeklist()}
						{this.getDaylist()}
						<div className="item19">刷新</div>
					</div>
					<Footer 
						data={_footerData} 
						daydata={_footerDaydate} 
						weekdata={_footerWeekdate} 
						datarenew ={_datarenew}
						refresh={() => this.ajaxData(this.currentPage)}/>
				</div>

				<div className="container-world">					
					<div className="world">黄色账号：已支付账号</div>
					<div className="container-wrold-bottom">
						红色品牌：15天内到期预警
					</div>
					<div className="container-world-top">
						<div className="bluebox"></div>
						<div >: 已上传营业执照</div>
					</div>
					
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
	constructor() {
		super()
		this.state = {
			accountrenew:<div></div>, //默认是否请求
			username:"", //下层请求用username
			showCalendar: false,
			showDialogCtrl: false,
			showDialogTime: false,
			endDate: 0 //延长至。。。
		}
	
		this.currentpyid = "" //保存操作的yc-id
		this.currentPhone = -1 //保存操作的 id
		this.noCtrl = true //是否操作过，处理日历bug
	}

	getItems() {
		let _ctrlClick = this.ctrlClick.bind(this)
		let _validTimeClick = this.validTimeClick.bind(this)

		let _daylist = this.props.daydata
		let _weeklist = this.props.weekdata

		let _items = this.props.data.map((item, index) => {
			return (
				<FooterItem key={index} item={item} 
					daylist={_daylist} weeklist={_weeklist}
					ctrlClick={_ctrlClick} validTimeClick={_validTimeClick} />
			)
		})

		return _items
	}

	calendarClick(date) {
		if(this.noCtrl) return //如果没有操作过，不对读取信息处理

		let _date = new Date(date)
		let _month = _date.getMonth() + 1
		let _day = _date.getDate()
		_date = `${_date.getFullYear()}-${_month > 9 ? _month : "0" + _month}-${_day > 9 ? _day : "0" + _day}`
		let _state = {
			showCalendar: false,
			showDialogTime: true,
			endDate: _date
		}

		this.setState(_state)
	}

	ctrlClick(phone) {
		this.setState({showDialogCtrl: true,username:""}, () => this.currentPhone = phone)
	}

	renewBack(){
		this.setState({
			accountrenew:<div></div>
		})
	}

	validTimeClick(phone,ycid) {
		if (this.props.datarenew == 0 || this.props.datarenew == undefined ) return //没有延期权限就不能点
		// showCalendar: true,
		this.noCtrl = false // 执行这里，必然是已经操作过
		this.setState({
			accountrenew:<AccountRenew username={phone} ycid={ycid} renewBack={this.renewBack.bind(this)}/>,			
			username:phone
		}, () => {
			this.currentpyid = ycid
			this.currentPhone = phone
		})
	}

	newValidTime(phone) {
		this.setState({showDialogTime: false,username:""}, () => Model.newValidTime(this, this.props.refresh))
	}

	ctrlHandle() {
		Model.ctrlHandle(this, res => {
			this.setState({showDialogCtrl: false}, this.props.refresh)
		})
	}

	render() {
		let _showCalendar = this.state.showCalendar
		let _ctrlHandle = this.ctrlHandle.bind(this)
		let _newValidTime = this.newValidTime.bind(this)
		let _username = this.state.username
		let _accountrenew = this.state.accountrenew

		return (
			<div className="container-footer">
				{this.getItems()}
				<div className="container-calendar" style={{display: _showCalendar ? "block" : "none"}}
					onClick={() => this.setState({showCalendar: false})}>
					<div onClick={(e) => e.stopPropagation()}>
						<CalendarSelector
							show={_showCalendar}
							callback={this.calendarClick.bind(this)} />
					</div>
				</div>
				<Prompt
				    content={`确认操作吗？`}
				    confirm="确定"
				    other="取消"
				    show={this.state.showDialogCtrl}
				    fun={_ctrlHandle}
				    close={() => this.setState({showDialogCtrl: false})} />
				<Prompt
				    content={`延期至${this.state.endDate}？`}
				    confirm="确定"
				    other="取消"
				    show={this.state.showDialogTime}
				    fun={_newValidTime}
				    close={() => this.setState({showDialogTime: false})} />
				 {_accountrenew}
			</div>
		)
	}
}

class FooterItem extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	vin_query:0,			//车架号查询量
	  	total_query: 0, 		//总查询
		showToday: false
	  };
	}

	getDaylist(){
		let _daylist = this.props.daylist
		let _returnlist = <div></div>
		if (_daylist!=[]) {
			_returnlist = _daylist.map((items,indexs)=>{
				let _item = this.props.item.daily_query
				let _classnum = 13 + indexs
				let _class = "item" + _classnum
				return (
					<div key={indexs} className={_class}>{_item[items]}</div>
				)
			}) 
		}

		return _returnlist
	}

	getWeeklist(){
		let _weeklist = this.props.weeklist
		let _returnlist = <div></div>
		if (_weeklist!=[]) {
			_returnlist = _weeklist.map((items,indexs)=>{
				let _item = this.props.item.weekly_query
				let _classnum = 12 + indexs
				let _class = "item" + _classnum
				return (
					<div key={indexs} className={_class}>{_item[items]}</div>
				)
			}) 
		}

		return _returnlist

	}

	componentWillReceiveProps(){
		this.getDaylist()
		this.getWeeklist()
		if(this.state.showToday) {
			this.setState({
				showToday: false
			})
		}
	}

	todayNumber(username,ycid) {
		if(this.state.showToday) {
			this.setState({showToday: false})
			return
		}
        Model.todayNumber(username,ycid, res => {
            this.setState({
            	vin_query:res.data['vin_query'],			
	  			total_query: res.data['total_query'],
				showToday: true
            })
        })
    }

	render() {
		let _item = this.props.item
		let _ctrlClick = this.props.ctrlClick
		let _validTimeClick = this.props.validTimeClick
		let _isClose = _item.status == 1
		let _classItem3 = _isClose ? "item3" : "item3 warning"
		let _contentItem3 = _isClose ? "开始" : "停止"
		let _footerClass = _item.user_expired == 0 ? "footer" : "footer expired"

		let _daylist = this.props.daylist
		let _weeklist = this.props.weeklist 

		let _brandCode = <span></span>
			if (_item.brandCode!=[]) {
				_brandCode = _item.brandCode.map((iitem,iindex)=>{
					for(var keys in iitem) {
						var  _iclass = iitem[keys] == 1 ? "pastdue" : ""
						return (
							<span key={iindex} className={_iclass}>{keys}</span>
						)
					}
				})
			}

		let _itemToy = this.state.vin_query + "/" + this.state.total_query
		let _blueboxshow = _item.license == "1" ? "bluebox" : ""
		let _membership = _item.membership == 1 ? "item2  paid" : "item2"

		return (
			<div className={_footerClass}>
				<div className="item1">{_item.index || index + 1}</div>
				<div className={_membership}>
					<div className={_blueboxshow}></div>
					{_item.username}
				</div>
				{/*<div className={_classItem3} onClick={() => _ctrlClick(_item.username)}>{_contentItem3}</div>*/}
				<div className="item3">{_item.full_name}</div>
				<div className="item4">{_item.company}</div>				
				<div className="item6">{_item.register_datetime}</div>
				<div className="item7" onClick={() => _validTimeClick(_item.username,_item.yc_id)}>{_item.valid_datetime}</div>
				<div className="item5">{_brandCode}</div>
				<div className="item8">{_item.code}</div>
				<div className="item9">{_item.bonus_generation}</div>
				<div className="item10">{_item.bonus_withdraw}</div>
				<div className="item11">{_item.balance}</div>
							
				{this.getWeeklist()}
				{this.getDaylist()}	
				<div className="today" style={{display:this.state.showToday ? "flex" : "none" }}>{_itemToy}</div>		
				<div className="item19" onClick={this.todayNumber.bind(this,_item.username,_item.yc_id)}>刷新</div>
			</div>
		)
	}
}

class Model {
	static createTriangle(canvases) {
		for(let i = 0, j = canvases.length; i < j; i++) {
			let _canvas = canvases[i]
			_canvas.width = 5
			_canvas.height = 5

			var cxt = _canvas.getContext('2d')
			cxt.beginPath()
			cxt.moveTo(0,0)
			cxt.lineTo(5,0)
			cxt.lineTo(3,5)
			cxt.closePath()
			cxt.fill()
		}
	}

	static ajaxData(v, isSearch, callback) {
		let _username = v.refs.phone.value
		if(isSearch && _username.length < 1) return

		let _url = `${hostPort}/user_management`
		let _obj = {
			page: v.currentPage,
			ord_seq: v.isInvert,
			ord_dep: v.ord_dep,
			filter: v.button
		}

		if(isSearch) {
			_obj.username = _username
			_obj.page = 1
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static ctrlHandle(v, callback) {
		let _url = `${hostPort}/acc_oper`
		let _obj = {
			username: v.currentPhone
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static newValidTime(v, callback) {
		// username: v.currentPhone,
		let _url = `${hostPort}/user_validtime_renew`
		let _obj = {			
			end_time: v.state.endDate,
			yc_id:v.currentpyid
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
	
	static todayNumber(username,ycid, callback) {
		let _url = `${hostPort}/indiv_query_intime_statis`
		let _obj = {
			// username: username,
			yc_id:ycid
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

}
