import React, {Component} from "react"
import Pagination from "pagination-react"

export default class FeedbackManage extends Component {
	constructor() {
		super()
		this.state = {
			typechange:[false,false,false,false], //类型添加
			replys:[],         //运营回复记录
			userLog:[],        //记录用户日志
			userPrivilege:[],  //记录用户权限
			clickindex:-1,    //记录当前点击的index 用于上一下一点击
			isInverted: false, //是否日期倒序
			footerData: [],
			type: 1, //当前选择的查看类型，1 全部，0 待处理
			count: 1, //页码总数
			isHandle: false, //是否进入问题处理
			handleData: {}, //问题处理携带数据
			handleUrls: [], //问题处理的反馈图片列表
			showLogs: false, //是否显示用户日志
			showpermission:false, //是否显示权限
			permission:[], //用户权限
			isClear: false //已解决勾选记录
		}

		this.types = {
			pending: 0,
			all: 1
		}

		this.item = {}//记录当前的问题 id
		this.currentPage = 1 //记录当前页码
	}

	componentDidMount() {
		this.createTriangle()
	}

	ajaxData(page=1) {
		// console.log(page)
		this.currentPage = page
		let _url = `${hostPort}/user_fb_mag`
		let _obj = {
			page: this.currentPage,
			filter: this.state.type,
			ord_seq: this.state.isInverted ? "asc" : "desc"
		}
		let _searchvalue =  this.refs.phone.value
		if (_searchvalue.length==11) {
			_obj.username = _searchvalue
		}

		getAjax(_url, _obj, res => {
			// console.log(res)
			this.setState({
				footerData: res.data || [],
				count: res.amount_page || 1
			});
		})
	}

	prevNextClick(type){
		let _data =  JSON.parse(JSON.stringify(this.state.footerData))
		let _index = JSON.parse(JSON.stringify(this.state.clickindex))
		let _clickindex = type == "next" ?  _index+1 : _index-1
		if (_clickindex<0) {
			_clickindex=0
			alert("已经是第一条")
		}
		if (type == "next") {
			if (_clickindex > _data.length-1) {
				_clickindex = _data.length-1
				alert("已经是最后一条")
			}
		}
		let _item = _data[_clickindex]
		this.itemClick(_item,_clickindex)
	}

	createTriangle() {
		let _canvas = this.refs.triangle
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

	invert() {
		this.setState({
			isInverted: !this.state.isInverted
		}, () => {
			this.ajaxData(this.currentPage)
		})
	}

	toggleType(type) {
		this.setState({
			type: type
		}, () => this.ajaxData(this.currentPage))
	}

	search() {
		this.setState({
			isHandle: false
		}, () => {
			let _searchvalue =  this.refs.phone.value
			// console.log(_searchvalue)
			if (_searchvalue.length<11) {return}
			this.ajaxData(1)
		})
	}

	getTypes() {
		let _toggleType = this.toggleType.bind(this)
		let _type = this.state.type
		let _allClass = _type == this.types.all ? "type selected" : "type"
		let _waitingClass = _type == this.types.pending ? "type selected" : "type"
		let _refresh = this.refresh.bind(this)

		let _types = (
			<div className="util">
				<div className="container-type">
					<input className={_allClass} type="button" defaultValue="全部" onClick={_toggleType.bind(this, this.types.all)} />
					<input className={_waitingClass} type="button" defaultValue="待处理" onClick={_toggleType.bind(this, this.types.pending)} />
					<input className='refresh' type="button" defaultValue="刷新" onClick={_refresh} />
				</div>
			</div>
		)

		return _types
	}

	itemClick(item,index) {
		this.item = item
		// let _url = `${hostPort}/user_fb_details`
		let _url = `${hostPort}/user_feedback_info`
		let _obj = {
			fid: item.fid
		}

		postAjax(_url, _obj, res => {
			let _typechange  = [false,false,false,false]
			    _typechange[0] = res.data.feedback_status == 0 ? false : true
			    _typechange[1] = res.data.feedback_type.data == 0 ? false : true
			    _typechange[2] = res.data.feedback_type.features == 0 ? false : true
			    _typechange[3] = res.data.feedback_type.others == 0 ? false : true
			this.setState({
				clickindex:index,
				isHandle: true,
				handleData: res.data,
				handleUrls: res.data.img_urls,
				isClear: item.status === '已解决',
				typechange:_typechange,
				showLogs: false, 		//是否显示用户日志
				showpermission:false, 	//是否显示权限
			})
		})
		this.getReplys()
	}

	getReplys(){
		// 运营回复记录 回复人 回复内容 回复时间
		let _urlreplys = `${hostPort}/user_feedback_replys`
		let _obj = {
			fid: this.item.fid
		}
		postAjax(_urlreplys, _obj, resreplys => {
			 // console.log(resreplys)
			this.setState({
				replys: resreplys.data
			})
		})
	}

	getPrivilege(){
		let _showpermission =  JSON.parse(JSON.stringify(this.state.showpermission))
		if (_showpermission) {
			this.setState({
				showpermission: !this.state.showpermission,
				showLogs:false
			})
		}else{
			//用户权限数据请求
			let _urlPrivilege = `${hostPort}/user_feedback_userPrivilege`
			let _objPrivilege = {
				username:this.item.username
			}
			postAjax(_urlPrivilege, _objPrivilege, ress => {
				 // console.log(ress)
				this.setState({
					permission: ress.data,
					showpermission: !this.state.showpermission,
					showLogs:false
				})
			})
		}
	}


	getImgs() {
		if (this.state.handleUrls == []) {
			return <div></div>
		}else{
			return (
				<div className="constainer-imgs">
					{
						this.state.handleUrls.map((item, index) => {
							return <img key={index} className="img" src={item} />
						})
					}
				</div>
			)
		}
		
	}

	getuserLog(){
		let _showLogs =  JSON.parse(JSON.stringify(this.state.showLogs))
		if (_showLogs==true) {
			this.setState({
				showLogs: !this.state.showLogs,
				showpermission:false
			})
			return
		}else{
			// 回复人 回复内容 回复时间
			let _obj = {
				fid: this.item.fid
			}
			let _userLog = `${hostPort}/user_feedback_userLog`
			postAjax(_userLog, _obj, userLog => {
				 // console.log(userLog)
				this.setState({
					userLog: userLog.data,
					showLogs: !this.state.showLogs,
					showpermission:false
				})
			})
		}
		
	}

	getLogs() {
		let _user_log = this.state.userLog
		let _logs = <div></div>
		if(_user_log!=[] ) _logs = (
			<div className="container-logs" style={{display: this.state.showLogs ? "block" : "none"}}>
				{
					_user_log.map((item, index) => {
						return <div key={index}>{`${item.create_time}...${item.data}...${item.operate_key}`}</div>
					})
				}
			</div>
		)

		return _logs
	}

	permission(){
		let _user_permission = this.state.permission
		let _permission = <div></div>
		
		if( _user_permission!=[] ) _permission = (
			<div className="container-logs" style={{display: this.state.showpermission ? "block" : "none"}}>
				{
					_user_permission.map((item, index) => {
						return <div key={index}>{`${item.brandCode}    ${item.valid_datetime}`}</div>
					})
				}
			</div>
		)

		return _permission
	}

	submit() {
		let _value = this.refs.area.value
		if(_value.length < 1) {
			alert("请输入回复内容！")
			return
		}
		// let _url = `${hostPort}/user_fb_proc`
		let _url = `${hostPort}/user_feedback_process`
		let _obj = {
			reply_content: _value,
			fid: this.item.fid,
		}
		// feedback_status:this.state.typechange[0] == true ? 1 : 0 //反馈状态添加 解决 

		postAjax(_url, _obj, res => {
			// console.log("sublime")
			// this.refresh()
			this.refs.area.value = ''
			this.getReplys() //刷新历史记录
		})
	}

	refresh() {
		this.setState({
			isHandle: false
		}, () => {
			this.refs.area.value = ''
			this.ajaxData(this.currentPage)
		})
	}

	checkboxClick(which){
		let _check = this.refs.solve.checked
		let _typechange = JSON.parse(JSON.stringify(this.state.typechange))		
		switch (which){
			case 0:
				_check = this.refs.solve.checked
				break;
			case 1:
				_check = this.refs.data.checked
				break;
			case 2:
				_check = this.refs.func.checked
				break;
			case 3:
				_check = this.refs.other.checked
				break;
		}
		_typechange[which] = _check
		let _typs = ["","data","features","others"]
		var _value = ""
		for (var i = 1; i < _typechange.length; i++) {
			let _chockvalue = ""
			if (_typechange[i]) {
				_chockvalue=_typs[i]+","
				// if (i==3) {
				// 	_chockvalue=_typs[i]
				// }
			}
			_value +=_chockvalue
		}
		_value=_value.substring(0,_value.length-1) 
		let _url = `${hostPort}/user_feedback_type_verify`
		let _obj = {
			feedback_type: _value,
			fid: this.item.fid,
			feedback_status:_typechange[0] ? 1 : 0, //0 待处理, 1 已处理
		}
		postAjax(_url, _obj, res => {
			 console.log("类型选择")
		})

		this.setState({
			typechange:_typechange
		}) 


	}

	render() {
		let _invert = this.invert.bind(this)
		let _isInverted = this.state.isInverted
		let _footerData = this.state.footerData
		let _ajaxData = this.ajaxData.bind(this)
		let _itemClick = this.itemClick.bind(this)
		let _isHandle = this.state.isHandle
		let _handleData = this.state.handleData
		let _isClear = this.state.isClear
		let _replys = this.state.replys

		let _checkboxClick = this.checkboxClick.bind(this)
		let _typechanges = this.state.typechange

		return (
			<div className="container-feedbackmanage">
				<div className="container-title">
					<span className="title">
						5.1用户反馈管理
					</span>
					<div className="container-search">
						<input ref="phone" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" ref="search" defaultValue="搜索" onClick={this.search.bind(this)}/>
					</div>
				</div>
				<div className="container-list" style={{display: _isHandle ? "none" : "block"}}>
					{this.getTypes()}
					{this.permission()}
					<div className="content">
						<div className="head">
							<div className="item1">序号</div>
							<div className="item2">手机号</div>
							<div className="item3">姓名</div>
							<div className="item4">公司</div>
							<div className="item5">问题摘要</div>
							<div className="special-item" onClick={_invert}>
								<span>反馈日期</span>
								<canvas ref="triangle" className={_isInverted ? "triangle invert" : "triangle"}></canvas>
							</div>
							<div className="item7">来源</div>
							<div className="item8">状态</div>
						</div>
						<Footer data={_footerData} click={_itemClick}/>
					</div>
					<div className="container-pagination">
						<Pagination
							count={this.state.count}
							groupCount={5}
							selectedCount={1}
							callback={selectedIndex => _ajaxData(selectedIndex)}/>
					</div>
				</div>
				<div className="container-handle" style={{display: _isHandle ? "block" : "none"}}>
					<div className="util">
						<div className="title">
							<input className="back" type="button" defaultValue="返回" onClick={this.refresh.bind(this)} />
							<input className="prev" type="button" defaultValue="上一条" onClick={this.prevNextClick.bind(this,"prev")} />
							<input className="next" type="button" defaultValue="下一条" onClick={this.prevNextClick.bind(this,"next")} />
						</div>

						<div className="usermes">
							<p>反馈时间：{this.item.feedback_time}</p>
							<span>手机号：{this.item.username}  </span>
							<span>用户名：{this.item.full_name}  </span>
							<span>公司：{this.item.company}</span>
							<span className="log" onClick={this.getPrivilege.bind(this)}>用户权限</span>
							<span className="log" onClick={this.getuserLog.bind(this)}>用户日志</span>
						</div>
						
						<div className="typebtn">
							<input type="checkbox" className="checkbox" 
								checked={_typechanges[0]==true ? true : false}
								ref="solve"  onChange={e => _checkboxClick(0)} />已解决
							<input type="checkbox" className="checkbox" 
								checked={_typechanges[1]==true ? true : false}
								ref="data"  onChange={e => _checkboxClick(1)} />数据
							<input type="checkbox" className="checkbox" 
								checked={_typechanges[2]==true ? true : false}
								ref="func"  onChange={e => _checkboxClick(2)} />功能
							<input type="checkbox" className="checkbox" 
								checked={_typechanges[3]==true ? true : false}
								ref="other"  onChange={e => _checkboxClick(3)} />其他
						</div>
					</div>
					<div className="content">               
						{this.getLogs()}
						{this.permission()}						
						<div className="container-area">
							<textarea ref="area" className="area" placeholder="答复用户："></textarea>
							<input className={_isClear ? "clear selected" : "clear"} style={{display:"none"}} type="button" defaultValue="已解决" onClick={() => this.setState({isClear: !_isClear})} />
							<input className="button" type="button" value="回复" onClick={this.submit.bind(this)}/>
						</div>
						<Feedhistory  replys={_replys} />
						<div className="userfeedback">用户反馈：</div>
						<span className="browser-info">浏览器：{_handleData.browser}</span>
						<div className="describe">
							<span>用户查询路径：</span>
							<a href={_handleData.query_path} className="path">{_handleData.query_path}</a>
						</div>
						<div className="describe">
							<span>用户意见：</span>
							<span>{_handleData.user_feedback}</span>
						</div>
						{
							this.getImgs()
						}
					</div>
				</div>
			</div>
		)
	}
}

class Footer extends Component {
	getItems() {
		let _items = this.props.data.map((item, index) => {
			return (
				<div className="footer" key={index} onClick={() => this.props.click(item,index)}>
					<div className="item1">{item.index}</div>
					<div className="item2">{item.username}</div>
					<div className="item3">{item.full_name}</div>
					<div className="item4">{item.company}</div>
					<div className="item5">{item.advise}</div>
					<div className="item6">{item.feedback_time}</div>
					<div className="item7">{item.client}</div>
					<div className="item8">{item.status}</div>
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

class Feedhistory extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	  this.title = ["回复人","回复时间","回复内容"]
	}

	getTitle(){
		let _title = this.title.map((item,index)=>{
			return (
				<div className="titlelist">
					{item}
				</div>
			)
		})

		return _title
	}
	
	getTitledata(){
		let _items = <div></div>
		if (this.props.replys!=[]) {
			_items = this.props.replys.map((item, index) => {
				return (
					<div className="titleinclude" key={index}>
						<div className="titlelist">{item.replier_name}</div>
						<div className="titlelist">{item.reply_time}</div>
						<div className="titlelist">{item.reply_content}</div>
					</div>
				)
			})
		}

		return _items

	}

	render (){
		return (
			<div className="feed-history">
				<div className="title">回复记录</div>
				<div className="titleinclude titleincludeFirst">{this.getTitle()}</div>
				{this.getTitledata()}
			</div>
		)
	}

}













// 
