import React, {Component} from "react"
import CalendarSelector from "./calendarselector"
import $ from 'jquery'

export default class Signin extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	placeholderlist : ['支付人手机号', '选择套餐', '', '到账金额'],
		setmealList: [],
		showmealList:false, //是否重新请求套餐列表 
		getmealList:[],
		showCalendar: false,
		username: "" ,     //验证用户后显示
	  }
	  this.commodity_id = -1      //发用品牌需要的对应参数
	  this.button = "sure"
	}

	feedback(date) {
		if (date) {
			Model.sentEdit(this, res => {
				alert("录入成功！")
			})
		}
		this.props.callback()
	}

	handleInput(index){
		let that = this
		if (index == 1) {
			Model.dealsList(that , res => {
				
				let _resdata = res.data || []
				that.setState({
					showmealList:true,
					getmealList:_resdata
				})
			})			
		}else if (index == 2) {
			that.setState({
				showCalendar: true
			})
		}
	}

	leaveMealList(){
		this.setState({
			showmealList:false,
		})
	}

	itemClick(item){
		this.refs.setmeal.value = item.deal_name
		this.commodity_id = item.commodity_id
		this.setState({
			showmealList:false,
		})
	}

	changeInput(index){
		let _changeValue = this.refs.account.value
		if (index === 0 && _changeValue.length == 11 ) {
			Model.ruleUser(_changeValue, res => {
				this.setState({
					username:res.data.full_name || ""
				})
			})
		}else if (index === 0 && _changeValue.length !== 11) {
			this.setState({
				username:""
			})
		}
	}

	calendarClick(date) {
		let _date = new Date(date)
        let _month = _date.getMonth() + 1
        let _day = _date.getDate()
			_date = `${_date.getFullYear()}-${_month > 9 ? _month : ("0" + _month)}-${_day > 9 ? _day : ("0" + _day)}`

		this.refs.buytime.value = _date
		this.setState({
			showCalendar: false
		})
	}

	componentDidMount(){
		let _placeholder = ['支付人手机号', '选择套餐', '', '到账金额','备注']
		let _date = new Date()
		let _year = _date.getFullYear()
        let _month = _date.getMonth() + 1
        let _day = _date.getDate()
        let _enddata = _year + "-" + _month + "-" + _day
			_placeholder[2] = _enddata
        this.setState({
        	placeholderlist: _placeholder
        })
	}

	render() {
		let _showCalendar = this.state.showCalendar

		let _namelist = ['账号','套餐','购买日期','到账金额','备注']
		let _refslist = ['account', 'setmeal', 'buytime', 'money' ,'comments']
		let _mealclass = this.state.showmealList ? "list-meallist-show" : "list-meallist-hid"

		let _getmealList = this.state.getmealList.map((items,indexs)=>{
			return (
				<div key={indexs} className="list-input-list" onClick={this.itemClick.bind(this,items)}>{items.deal_name}</div>
			)
		})

		let _content = _namelist.map((item,index) => {
			let _users = ((this.state.username == "无此用户") || (this.state.username == ""))? this.state.username : "用户：" + this.state.username
			let _username = index == 0 ? <span className="position-username">{_users}</span> : null
			let _img = index == 1 ? <span className="position-img"></span> : null
			let _setMealList = index == 1 ? _getmealList : null
			let _calendar = index == 2 ? <CalendarSelector
											show={_showCalendar}
											callback={this.calendarClick.bind(this)} /> : null
			return (
				<div className="list" key={index}>
					<div className="list-name">{item}</div>
					<div className="list-input-img">
						<input className="list-input" 
								ref={_refslist[index]} 
								onChange={this.changeInput.bind(this,index)}
								onClick={this.handleInput.bind(this,index)}
								placeholder={this.state.placeholderlist[index]} />
						{_img}
						{_calendar}
						{_username}
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
		let _url = `${hostPort}/payment_info/deals_list`
		let _obj = {}			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static ruleUser(username, callback) {
		let _url = `${hostPort}/user_exisitence`
		let _obj = {
			username:username
		}			
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static sentEdit(v, callback) {
		let _account = v.refs.account.value
		let _setmeal = v.commodity_id
		let _buytime = v.refs.buytime.value
		let _money = v.refs.money.value
		let _comments = v.refs.comments.value
		if (_account.length < 11 || _setmeal == -1 || _money.length < 1 ) {
			return 
		}

		let _url = `${hostPort}/payment_info/record_manually`
		let _obj = {
			username:_account, 				//用户账号
			commodity_id:_setmeal, 			//套餐			
			purchase_date:_buytime, 		//购买日期
			receive_amount:_money,
			comments: _comments 			//备注
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
