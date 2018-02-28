/*
* @Author: steven
* @Date:   2017-09-05 12:04:16
* @Last Modified by:   steven
* @Last Modified time: 2017-11-17 11:38:06
*/
import React, {Component} from "react"
import CalendarSelector from "./calendarselector"
import {Prompt} from 'dialog-react'


export default class AccountRenew extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	ycid:"",			//保存修改的用户ycid
	  	username:"",		//保存修改的用户
	  	sendBrand:"",		//发送参数
	  	setname:"", 		//选中品牌名称
	  	setindex:[], 		//选中哪一个
	  	brandlist:[], 		//品牌列表

	  	endDate: "2016-08-18",
	  	endClass: "date",
	  	showCalendar: true, //日期选择弹框
	  	showDialogCtrl: false,
	  };
	  this.deleteimg= "../img/x.png"
	  this.username = "" //阻止多次点击
	  this.todaytime = ""
	  this.brandlist = [] //多选的品牌
	  this.setindex = [] //多选的index
	  this.setname = []  //多选品牌名称
	}
	
	componentDidMount(){
		// if (props.username == this.username) {return}
		let _username = this.props.username
		let _ycid = this.props.ycid
			this.username = this.props.username
			Model.mumberShip(_username,_ycid,res=>{
				// console.log(res)
				this.setState({
					brandlist:res.data || [],
					username:_username,
					ycid:_ycid
				})
			})
	}

	chooseClick(index,name,brandCode,valid_datetime){
		let _brandlist = JSON.parse(JSON.stringify(this.brandlist))
		let _setindex = JSON.parse(JSON.stringify(this.setindex))
		let _setname = JSON.parse(JSON.stringify(this.setname))

		let _index = $.inArray(brandCode, _brandlist)
		if (_index == -1) {
			_brandlist.push(brandCode)
			_setindex.push(index)
			_setname.push(name)
		}else{
			_brandlist.splice(_index,1)
			_setindex.splice(_index,1)
			_setname.splice(_index,1)
		}
		this.brandlist = _brandlist
		this.setindex = _setindex
		this.setname = _setname

		// 新加参数 valid_datetime 用户日历处理
		let _endtime =valid_datetime=="无" ? this.todaytime:valid_datetime
		let _brandCode = ""
		let _name = ""
		for (let i = 0; i < _brandlist.length; i++) {
			if (i < _brandlist.length - 1) {
				_brandCode += _brandlist[i] + ","
				_name += _setname[i] + ","
			} else {
				_brandCode += _brandlist[i]
				_name += _setname[i] 
			}
		}
		this.setState({
			setindex:_setindex,
			setname:_name,
			sendBrand:_brandCode,
			endDate:_endtime
		})

	}

	calendarClick(date) {
		let _date = new Date(date)
        let _month = _date.getMonth() + 1
        let _day = _date.getDate()
		_date = `${_date.getFullYear()}-${_month > 9 ? _month : ("0" + _month)}-${_day > 9 ? _day : ("0" + _day)}`
		let _state = {
			startClass: "date",
			endClass: "date",
			endDate:_date
		}
		this.todaytime = _date
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

	changeValue(){
		let _inputValue = this.refs.inputValue.value
		this.setState({
			endDate:_inputValue
		})
	}

	sureDelate(){
		if (this.state.setname == "") {
			alert("请选择套餐")
		}else if(this.state.endDate.length != 10){
			alert("输入时间格式为：xxxx-xx-xx    如：2016-08-18")
		}else{
			this.setState({
				showDialogCtrl:true
			})
		}
	}

	makeSuredelate(){
		this.setState({
			showDialogCtrl:false
		},()=>{
			Model.vaildTime(this,res=>{
				console.log(res)
				alert("延期成功短信已发送")
			})
		})
	}

	closeBtn(){
		this.props.renewBack()
	}

	render() {
		let _showCalendar = this.state.showCalendar
		let _startClass = this.state.startClass
		let _setname = this.state.setname
		let _endDate = this.state.endDate
		let _showDialogCtrl = this.state.showDialogCtrl
		
		let _brandlist = this.state.brandlist
		let _username = this.state.username
		let _leftlist = <div></div>
			if (_brandlist!=[]) {
				_leftlist = _brandlist.map((item,index)=>{
					let _img = item.name == "全部" ? "全部" : <img src={item.url} alt="wrongimg"/>
						if (item.name == "品牌件") {
							_img = "品牌件"
						}
					let _chooseindex = $.inArray(index, this.state.setindex)  != -1 ? true : false
					let _valid_datetime = item.valid_datetime == "无" ? "":item.valid_datetime
					// onClick={this.chooseClick.bind(this,index,item.name,item.brandCode,item.valid_datetime)}
					// checked={_chooseindex?true:false}
					return (
						<div key={index} className="firstlist"
							onClick={this.chooseClick.bind(this,index,item.name,item.brandCode,item.valid_datetime)}>
							<div className="list-img">{_img}</div>
							<div className="list-brand">{item.name}</div>
							<div className="list-endtime">{_valid_datetime}</div>
							<div className="list-choosebtn">
								<input  type="checkbox" className="source" value={item.name}
								checked={_chooseindex?true:false}/>
							</div>
						</div>
					)
				})
			}

		return (
			<div className="container-accountrenew" >
				<div className="renew-fixed">
					<div className="renew-title">
						<div className="title-world">延期账号：{_username}</div>
						<div className="closebtn" onClick={this.closeBtn.bind(this)}>
							<img src={this.deleteimg} alt="返回" className="closebtn" />
						</div>
					</div>
					<div className="title-title">
						<div>第一步：选择套餐</div>
						<div>第二步：选择到期日期</div>
					</div>
					<div className="renew-first">{_leftlist}</div>
					<div className="renew-second">
						<div className="renew-second-time">
							<input className={_startClass} 
								type="text" 
								ref="inputValue"
								onChange={this.changeValue.bind(this)}
								value={_endDate} 
								/>
						</div>	
						<CalendarSelector
								show={_showCalendar}
								callback={this.calendarClick.bind(this)} />
						<div className="renew-second-btn">
							<input className="surebtn" type="button" value="确定" onClick={this.sureDelate.bind(this)} />
						</div>
						<Prompt
						    content={`确认延期:  ${_setname}  到${_endDate}？`}
						    confirm="确定"
						    other="取消"
						    show={_showDialogCtrl}
						    fun={this.makeSuredelate.bind(this)}
						    close={() => this.setState({showDialogCtrl: false})} />
					</div>
				</div>
			</div>
		)
	}
}



class Model {
	static mumberShip(username,_ycid,callback){
		let _url = `${hostPort}/account_membership_status`
		let _obj = {
			// username:username,
			yc_id:_ycid,
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static vaildTime(v, callback) {
		let _url = `${hostPort}/user_validtime_renew`
		let _obj = {
			new_valid_datetime: v.state.endDate, //到期时间
			// username: v.username, 			//用户账户
			brandCode: v.state.sendBrand, 		//品牌
			yc_id:v.state.ycid,
		}
		// console.log(_obj)
		// callback(_obj)
		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

}
