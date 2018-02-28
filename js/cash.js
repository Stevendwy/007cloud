/*
* @Author: steven
* @Date:   2017-10-23 13:42:47
* @Last Modified by:   steven
* @Last Modified time: 2017-12-06 10:42:14
*/
import React, {Component} from "react"
import Pagination from 'pagination-react'
import CalendarSelectorCash from "./calendarselector-cash"
import $ from 'jquery'

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
			titleData:{}, //将整体数据获取 用于title展示
			footerData: [],
			count: 1, //页码总数
			showpeopleset:false,   //是否加载人工记录
		}
		this.currentPage = 1
		this.button = "all"
		this.uid = -1 //保存点击 sos 产生的 uid
		this.enddata= ""  //保存默认时间
		this.startdata= "" //保存默认时间
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
				// footerData: res.data,
				// count: res.amount_page,
				// titleData:res,
				showbtnlogs:_manually_record_enable,
				footerData: res.data,
				count: res.amount_page || 1,
				showDialog: false //顺便关掉 dialog
			}) //获取成功后，顺便清空下一编辑输入框
		})
	}

	showAll() {
		this.button = "all"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showPaid() {
		this.button = "all"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showNotPaid() {
		this.button = "cashback"
		this.isScreen()
		// this.dataList(this.currentPage, false)
	}

	showSOS() {
		this.button = "withdraw"
		this.isScreen()
	}

	showManual(){
		this.button = "manual"
		this.isScreen()
	}

	search() {
		// if(this.currentPage === 1) this.dataList(1, true)
		// else this.update(1)
		this.isScreen(true)
		// this.dataList(this.currentPage, true)
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
		// if(this.currentPage === 1) this.dataList(1, true)
		// else this.update(1)
		// 翻页设置
		if (this.currentPage !== 1) {
			this.update(1)
		}
		this.dataList(this.currentPage, types , _isScreen)
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

	alertPeople(){
		this.setState({
			showpeopleset:true
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
	
	componentDidMount(){
		Model.summary({},res=>{
			this.setState({
				titleData:res.data,
			}) 
		})
	}
    render() {
    	let _footerData = this.state.footerData
    	// let _dataList = this.dataList.bind(this)
		
		let _showAll = this.showAll.bind(this)
    	let _showPaid = this.showPaid.bind(this)
    	let _showNotPaid = this.showNotPaid.bind(this)
    	let _showSOS = this.showSOS.bind(this)
    	let _dataList = this.dataList.bind(this)
    	let _showManual = this.showManual.bind(this)

    	let _titleData = this.state.titleData
    	let _startClass = this.state.startClass
		let _endClass = this.state.endClass
		let _startDate = this.state.startDate
		let _endDate = this.state.endDate
		let _toggleCalendar = this.toggleCalendar
		let _showCalendar = this.state.showCalendar

		let _showpeopleset = this.state.showpeopleset ? <Peopleset callback={()=>{this.setState({showpeopleset:false})}}/> : null
		let _showbtnlogs = this.state.showbtnlogs ? "inline-block":"none" 
        return (
            <div className="container-cash">
				<div className="container-title">
					<span className="title">
						4.3 现金记录
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
									<div>发放金额：</div>
									<div>{_titleData.last_bonus_generation}</div>
									<div>提现金额：</div>
									<div>{_titleData.last_bonus_withdraw}</div>
									<div>现金余额：</div>
									<div>{_titleData.last_balance}</div>
								</div>
								<div className="thismonth">
									<div>本月：</div>
									<div>发放金额：</div>
									<div>{_titleData.current_bonus_generation}</div>
									<div>提现金额：</div>
									<div>{_titleData.current_bonus_withdraw}</div>
									<div>现金余额：</div>
									<div>{_titleData.current_balance}</div>
								</div>
							</div>
						</div>

						<div className="container-second">
							<div className="container-screen">
								<input className={_startClass} type="button" defaultValue={_startDate} onClick={_toggleCalendar.bind(this, 0)} />
								<div className="container-data-slide">-</div>
								<input className={_endClass} type="button" defaultValue={_endDate} onClick={_toggleCalendar.bind(this, 1)} />
								<CalendarSelectorCash
									show={_showCalendar}
									callback={this.calendarClick.bind(this)} />
								<input className="screen-btn" type="button" value="查询" onClick={this.isScreen.bind(this,false)} />
								<input className="screen-btn" type="button" value="重置" onClick={this.resetDate.bind(this)} />
								<input className="screen-btn" type="button" value="人工记录" 
								style={{display:_showbtnlogs}}
								onClick={this.alertPeople.bind(this)} />
							</div>
							<div className="container-type">
								<input className={this.button == "all" ? "button selected" : "button"} type="button" value="全部" onClick={_showPaid} />
								<input className={this.button == "cashback" ? "button selected" : "button"} type="button" value="发放" onClick={_showNotPaid} />
								<input className={this.button == "withdraw" ? "button selected" : "button"} type="button" value="提现" onClick={_showSOS} />
								<input className={this.button == "manual" ? "button selected" : "button"} type="button" value="人工" onClick={_showManual} />
							</div>
						</div>

					</div>
					<div className="head">
						<div className="itemlist item1">序号</div>
						<div className="itemlist item2">流水号</div>
						<div className="itemlist item3">红包来源</div>
						<div className="itemlist item4">时间</div>
						<div className="itemlist item5">收支金额</div>
						<div className="itemlist item6">账号</div>
						<div className="itemlist item7">姓名</div>
						<div className="itemlist item8">公司</div>
						<div className="itemlist item9">注册日期</div>

						<div className="itemlist item10">品牌权限</div>						
						<div className="itemlist item11">到期日期</div>
						<div className="itemlist item12">用户来源</div>

						<div className="itemlist item13">发放金额</div>
						<div className="itemlist item14">提现金额</div>
						<div className="itemlist item15">现金余额</div>
						<div className="itemlist item16">记录人</div>
						<div className="itemlist item17">备注</div>
					</div>
					<Footer data={_footerData}/>
						<div className="world">*黄色账号：已支付账号</div>
						<div className="container-pagination">
							<Pagination
								count={this.state.count}
								groupCount={5}
								selectedCount={1}
								setUpdate={handle => this.update = handle}
								callback={page => _dataList(page, false)}/>
						</div>
				</div>
				{_showpeopleset}
			</div>
        )
    }
}

class Footer extends Component {
	getItems() {

		let _items = this.props.data.map((item, index) => {
			let _brandCode = item.privileges.map((it , indexs)=>{
				let _classovertime = it.expiration_valid == 0 ? "overtime":"notovertime"
				return (
					<div key={indexs} className={_classovertime}>{it.brandCode}</div>
				)
			})

			let _validdatetime = item.privileges.map((ite,ind)=>{
				let _classovertimes = ite.expiration_valid == 0 ? "overtime":"notovertime"
				return (
					<div key={ind} className={_classovertimes}>{ite.valid_datetime}</div>
				)
			})
			let _amountclass = item.amount.indexOf("+") == -1 ? "itemlist item5 bluecolor":"itemlist item5 redcolor"
			let _footerClass = item.user_expired == 0 ? "footer" : "footer"
			let _paidclass = item.membership == 0 ? "itemlist item6" : "itemlist item6  paid"
			let _sos = item.sos == 1 ? "sos":""
			return (
				<div className={_footerClass} key={index}>
					<div className="itemlist item1">{item.index}</div>
					<div className="itemlist item2">{item.serial}</div>
					<div className="itemlist item3">{item.reason_str}</div>
					<div className="itemlist item4">{item.create_time}</div>
					<div className={_amountclass}>{item.amount}</div>
					<div className={_paidclass}>{item.username}</div>
					<div className="itemlist item7">{item.full_name}</div>
					<div className="itemlist item8">{item.company}</div>
					<div className="itemlist item9">{item.register_datetime}</div>

					<div className="itemlist item10">{_brandCode}</div>					
					<div className="itemlist item11">{_validdatetime}</div>

					<div className="itemlist item12">{item.code}</div>
					<div className="itemlist item13">{item.bonus_generation}</div>
					<div className="itemlist item14">{item.bonus_withdraw}</div>
					<div className="itemlist item15">{item.balance}</div>
					<div className="itemlist item16">{item.data_recorder}</div>
					<div className="itemlist item17">{item.comments}</div>
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


class Peopleset extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
		setmealList: [],
		showmealList:false, //是否重新请求套餐列表 
		getmealList:[],
		showCalendar: false,

	  }
	  this.record_reason = -1      //发用品牌需要的对应参数
	  this.button = "sure"
	}

	feedback(date) {
		if (date) {
			Model.sentEdit(this, res => {
				console.log(res)
				alert("录入成功！")
			})
		}
		this.props.callback()
	}

	handleInput(index){
		let that = this
		if (index == 0) {
			Model.dealsList(that , res => {				
				let _resdata = res.data || []
				that.setState({
					showmealList:true,
					getmealList:_resdata
				})
			})			
		}
	}

	leaveMealList(){
		this.setState({
			showmealList:false,
		})
	}

	itemClick(item){
		this.refs.record_reason.value = item.record_reason_displayed
		this.record_reason = item.record_reason
		this.setState({
			showmealList:false,
		})
	}

	render() {

		let _namelist = ['红包来源','发放金额','账号','备注']
		let _refslist = ['record_reason', 'amount', 'username', 'comments']
		let _placeholder = ['选择红包来源', '发放金额', '手机号', '备注']
		let _mealclass = this.state.showmealList ? "list-meallist-show" : "list-meallist-hid"

		let _getmealList = this.state.getmealList.map((items,indexs)=>{
			return (
				<div key={indexs} className="list-input-list" onClick={this.itemClick.bind(this,items)}>{items.record_reason_displayed}</div>
			)
		})

		let _content = _namelist.map((item,index) => {

			let _img = index == 0 ? <span className="position-img"></span> : null
			let _setMealList = index == 0 ? _getmealList : null
			return (
				<div className="list" key={index}>
					<div className="list-name">{item}</div>
					<div className="list-input-img">
						<input className="list-input" 
								ref={_refslist[index]} 
								onClick={this.handleInput.bind(this,index)}
								placeholder={_placeholder[index]} />
						{_img}
						<div className={_mealclass} onMouseLeave={this.leaveMealList.bind(this)}>{_setMealList}</div>
					</div>
				</div>
			)
		})

		return (
			<div className="signin">
				<div className="signin-position" >
					<div className="signin-head">
						<div className="head-title">人工记录</div>
						<div className="head-img" onClick={this.feedback.bind(this,false)}></div>
					</div>
					<div className="signin-content">
						{_content}
					</div>
					<div className="signin-footer">
						<input className={this.button == "back" ? "button selected" : "button"} type="button" value="取消" onClick={this.feedback.bind(this,false)} />
						<input className={this.button == "sure" ? "button selected" : "button"} type="button" value="确认" onClick={this.feedback.bind(this,true)} />
					</div>
				</div>
			</div>
		)
	}
}

class Model {
	static dealsList(v, callback) {
		let _url = `${hostPort}/serial/serial_source`
		let _obj = {}			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static sentEdit(v, callback) {
		let _username = v.refs.username.value
		let _record_reason = v.record_reason
		let _amount = v.refs.amount.value
		let _comments = v.refs.comments.value

		if (_username.length < 11 || _record_reason == -1 || _amount.length < 1) {
			return 
		}

		let _url = `${hostPort}/serial/record_manually`
		let _obj = {
			username:_username, 				//用户账号
			record_reason:_record_reason, 			//套餐			
			amount:_amount, 		//购买日期
			comments:_comments
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static dataList(v, isSearch,isScreen, callback) {
		let _phone = v.refs.phone.value
		if(isSearch && _phone.length < 1) return

		let _url = `${hostPort}/serial_history`
		let _obj = {
			filter: v.button,
			page: v.currentPage
		}

		if(isScreen != {}) {
			_obj.start_datetime = isScreen.start_datetime
			_obj.end_datetime = isScreen.end_datetime
		}

		if(_phone.length == 11) {
			_obj.phone = _phone
			// _obj.page = 1
		}
			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	// 修改为排序
	static summary(uid, callback) {
		let _url = `${hostPort}/serial_summary`
		let _obj = {}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}