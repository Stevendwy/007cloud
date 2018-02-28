import React, {Component} from "react"
import Pagination from 'pagination-react'
import $ from 'jquery'

export default class HandleManage extends Component {
	constructor() {
		super()
		this.state = {
			showEdit: false,
			editUser: {},
			refresh: false,
			
		}
		this.searchphone = ""
	}

	//列表点击编辑 权限
	editClick(user) {
		this.setState({
			showEdit: true,
			editUser: user
		})
	}

	//编辑页点击返回或保存后的处理
	editBack(isSave) {
		this.setState({
			showEdit: false,
			refresh: isSave
		}, () => this.state.refresh = false)
	}

	//不显示就直接不渲染，否则下方导致 CheckBox 值 bug
	getEdit() {
		if(this.state.showEdit) {
			let _showEdit = this.state.showEdit
			let _editUser = this.state.editUser
			let _editBack = this.editBack.bind(this)

			return (
				<Edit show={_showEdit}
					user={_editUser}
					back={_editBack}/>
			)
		}
		else return <div></div>
	}

	search() {
		let _searchvalue =  this.refs.phonenum.value
		if (_searchvalue.length<11) {return}
			this.searchphone = _searchvalue
		this.setState({
			refresh: true,
		}, () => this.state.refresh = false)
	}

    render() {
    	let _showEdit = this.state.showEdit
    	let _editUser = this.state.editUser
    	let _refresh = this.state.refresh
    	let _editClick = this.editClick.bind(this)
    	let _search = this.search.bind(this)

        return (
            <div className="container-handlemanage">
				<div className="container-title">
					<span className="title">
						6.1操作管理
					</span>
					<div className="container-search">
						<input ref="phonenum" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" ref="search" defaultValue="搜索" onClick={_search}/>
					</div>
				</div>
				<div className="content">
					<List show={!_showEdit}
						searchphone={this.searchphone}
						editClick={_editClick}
						refresh={_refresh}
						/>
					{this.getEdit()}
				</div>
			</div>
        )
    }
}

class List extends Component {
	constructor() {
		super()
		this.state = {
			pagelist:null, //分页处理
			filterlist:0, //过滤选择
			inputshow:false,//编辑状态不关闭
			edittype:"normal" , //添加用户还是 编辑用户
			editusername:"",//编辑资料 
			typycheck:0, //类型选择 默认第一
			titledepartment:"选择部门", //显示 title
			titlerole:"选择角色", //显示 title
			showdepartment:false, //是否显示li 组件
			showrole:false, //是否显示li 组件
			footerData: [],
			showpage:1, //显示页面
			count: 1, //页码总数
			showAdd: false, //显示添加框
		}
		this.currentPage = 1
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.refresh) this.userList(this.currentPage , this.state.filterlist , nextProps.searchphone)
	}

	//请求数据
	userList(page, filter = this.state.filterlist ,username="") {
		this.currentPage = page
		Model.userList(page,filter,username,  res => {
			this.setState({
				showpage:page,
				footerData: res.data,
				count:res.amount_page,
				filterlist:filter
			}, () => {
			this.clearData()

			}) //获取成功后，顺便清空下一编辑输入框
		})
	}

	//删除点击事件
	deleteClick(username) {
		Model.deleteUser(username, res => {
			this.userList(this.currentPage)
		})
	}

	//编辑框确认事件
	editComplete() {
		let _type= this.state.typycheck == 0 ? "staff":"agency"
		let _edittype = this.state.edittype 
		Model.editComplete(this,_type,_edittype, res => {
			this.setState({
				showAdd: false 
			}, this.userList(this.currentPage))
		})	
	}

	//删除添加用户框内容
	clearData() {
		this.refs.name.value = ""
		this.refs.phone.value = ""
		this.refs.department.value = ""
		this.refs.role.value = ""
		this.refs.award.value = ""
		this.refs.promote.value = ""
	}

	//选择部门 选择角色 选择
	chooseType (type) {
		if (type == "department" ) {
			this.setState({
				showdepartment:true,
				showrole:false 
			})
		}else{
			this.setState({
				showdepartment:false,
				showrole:true
			})
		}
	}

	inputShow(){
		this.setState({
			inputshow:true
		})
	}

	mouseleave(type){
		if (type == "department" ) {
			if (this.state.inputshow==false) {
				this.setState({
					showdepartment:false,
					inputshow:false
				})
			}			
		}else{
			this.setState({
				showrole:false,
				inputshow:false
			})
		}
	}

	//组件回调 处理显示
	backChoose(type,value,e){
		if (type == "typedepartment") {
			this.setState({
				titledepartment:value, 
				showdepartment:false,
			})
		}else{
			this.setState({
				titlerole:value,
				showrole:false, 
			})
		}
		  e.stopPropagation();
	}

	//类型组件
	btnType(){
		let _data = ["公司内部","代理商"]
		let _type = _data.map((item,index)=>{
			let _class = index == this.state.typycheck ? "edit-list-btnchecked":"edit-list-btn"
			return (
				<div key={index} className={_class} onClick={this.typeCheck.bind(this,index)}>{item}</div>
			)
		})

		return _type
	}

	typeCheck(index){
		this.setState({
			typycheck:index,
			titlerole:"选择角色"
		})
	}

	//列表点击 编辑 资料
	editInfo(type,_item){
		let _phone = ""
		let _fullname = ""
		let _typycheck = 0
		let _coms_register = "" 
		let _coms_pay = "" 
		let _titlerole = "选择角色"
		let _titledepartment = "选择部门"

		if (type != "normal") {
			_phone = _item.username
			_fullname = _item.full_name
			_typycheck = _item.account_type == "staff" ? 0 : 1
			_titlerole = _item.role
			_titledepartment = _item.department
			_coms_register = _item.coms_register + "%" 
			_coms_pay = _item.coms_pay + "%" 
		}

		this.refs.phone.value = _phone
		this.refs.name.value = _fullname

		// 新加有效奖励 销售
		this.refs.award.value = _coms_register
		this.refs.promote.value = _coms_pay

		this.setState({
			showAdd: true,
			edittype:type,
			editusername:_phone,
			typycheck:_typycheck,
			titlerole:_titlerole,
			titledepartment:_titledepartment,			
		})
	}

	//绑定信息 body 传参数
	bindinfo(type,username){
		let _url = `${hostPort}/link_007account`
		let _obj = {
				username:username
			}
		$.ajax({
			url: _url,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(_obj),
			success:function(res){
				alert(res.msg)
			}
		})
	}

	//添加过滤功能

	filterClick(index){
		this.setState({
			filterlist:index
		},()=>{
			if(this.currentPage !=1 ){
				this.update(1)
			}else{
				this.userList(1,index)
			}
		})

	}

	render() {
		let _footerData = this.state.footerData
    	let _editClick = this.props.editClick
    	let _deleteClick = this.deleteClick.bind(this)
    	let _userList = this.userList.bind(this)
    	let _editComplete = this.editComplete.bind(this)
    	let _editinfo = this.editInfo.bind(this)
    	let _bindinfo = this.bindinfo.bind(this)
    	
    	let _show = this.props.show
    	let _listshow = this.state.listshow
    	let _showdepartment = this.state.showdepartment
    	let _showrole = this.state.showrole
    	let _titledepartment = this.state.titledepartment
    	let _titlerole = this.state.titlerole
    	let _list = [ "全部","公司内部","代理商"]
		let _typelist = _list.map((item,index)=>{
			let _class = index == this.state.filterlist ? "add":"filterlist"
			return (
				<input key={index} 
					type="button" 
					className={_class} 
					value={item} 
					onClick={this.filterClick.bind(this,index)} />
			)
		})

    	let _titleedit = this.state.edittype == "normal" ? "添加用户" : "修改用户信息"
    	let _phonedisabled = this.state.edittype == "normal" ? <input ref="phone" 
																		className="info" 
																		placeholder="请输入手机号"  
																		/> :
																	<input ref="phone" 
																		className="info" 
																		placeholder="请输入手机号" 
																		disabled />

		return (
			<div className="container-list"  style={{display: _show ? "block" : "none"}}>
				<div className="util">
					<input className="add" type="button" value="添加用户" onClick={this.editInfo.bind(this,"normal","")} />
					{_typelist}					
					<span className="initial">*初始密码：peipeiyun123</span>
				</div>
				<div className="head">
					<div className="item1">序号</div>
					<div className="item2">用户名</div>
					<div className="item7">类型</div>
					<div className="item5">部门</div>
					<div className="item6">角色</div>
					<div className="item3">手机号</div>
					<div className="item8">有效奖励</div>
					<div className="item9">销售促进</div>
					<div className="item4">操作</div>
				</div>
				<ListFooter data={_footerData}
					edit={_editClick}
					delete={_deleteClick}
					bindinfo={_bindinfo}
					editinfo={_editinfo}/>

					<div className="container-pagination">
					{this.state.pagelist}
					<Pagination
						count={this.state.count}
						groupCount={5}
						selectedCount={1}
						setUpdate={handle => this.update = handle}
						callback={page => _userList(page)}/>
				</div>
				<div className="edit" style={{display: this.state.showAdd ? "flex" : "none"}}>
					<div className="edit-title">{_titleedit}</div>

					<div className="edit-list">
						<div className="edit-list-title">用户名</div>
						<input ref="name" className="info" placeholder="请输入用户名" />
					</div>
					<div className="edit-list">
						<div className="edit-list-title">手机号</div>
						{_phonedisabled}
					</div>

					<div className="edit-list">
						<div className="edit-list-title">有效奖励</div>
						<input ref="award" className="info" placeholder="输入百分比" />
					</div>
					<div className="edit-list">
						<div className="edit-list-title">销售促进</div>
						<input ref="promote" className="info" placeholder="输入百分比" />
					</div>

					<div className="edit-list">
						<div className="edit-list-title">类别</div>
						<div className="info-btn">{this.btnType()}</div>						
					</div>
					<div className="edit-list" onMouseLeave={this.mouseleave.bind(this,"department")}>
						<div className="edit-list-title">部门</div>
						<input ref="department" value={_titledepartment} style={{display:"none"}} />
						<div className="info-div" 
						
						onClick={this.chooseType.bind(this,"department")}>
							{_titledepartment}
							<div className="triangle"></div>
							<Checklist typedepartment={true} 
									show={_showdepartment} 
									inputshow={this.inputShow.bind(this)}
									typycheck={this.state.typycheck} 
									backChoose={this.backChoose.bind(this)} />
						</div>
						
					</div>
					<div className="edit-list" onMouseLeave={this.mouseleave.bind(this,"role")}>
						<div className="edit-list-title">角色</div>
						<input ref="role" value={_titlerole} style={{display:"none"}} />
						<div className="info-div" 
						
						onClick={this.chooseType.bind(this,"role")}>
							{_titlerole}
							<div className="triangle"></div>
							<Checklist typedepartment={false} 
							show={_showrole}
							inputshow={this.inputShow.bind(this)} 
							typycheck={this.state.typycheck} 
							backChoose={this.backChoose.bind(this)} />
						</div>
						
					</div>
					
					<div className="container-buttons">
						<input type="button" className="button" value="取消" onClick={() => this.setState({showAdd: false}, this.clearData)} />
						<input type="button" className="button" value="确认" onClick={_editComplete} />
					</div>
				</div>
			</div>
		)
	}
}

class Checklist extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	department:["管理部","技术部","运营部","技术部"]
	  };
	  this.role = ["TeamMember","TeamLeader","Manager","Administrator"]
	}

	listChoose(value,e){
		let _type = this.props.typedepartment ? "typedepartment" : "role"
		this.props.backChoose(_type,value,e)
	}

	componentDidMount(){
		if (this.props.typedepartment) {
			Model.department({},res=>{
				this.setState({
					department:res.data
				})
			})
		}
	}

	inputChange(){
		this.props.inputshow()
	}
	
	addDepartment(e){
		let _data = JSON.parse(JSON.stringify(this.state.department))
		let _refsdata = this.refs.adddepartment.value
		if (_refsdata.length>0) {
			_data.push(_refsdata)
			this.refs.adddepartment.value = ""
			this.setState({
				department:_data
			})
			this.props.backChoose("typedepartment",_refsdata,e)
		}

	}
	render (){
			let _listChoose = this.listChoose.bind(this)
			let _addDepartment = this.addDepartment.bind(this)
			let _childlist = <div></div>
			if (this.props.typedepartment) {
				_childlist = this.state.department.map((item,index)=> {
					return (
						<div  key={index} className="edit-checklist" onClick={(e)=>_listChoose(item,e)}>{item}</div>
					)	
				})
			}else {
				let _role = this.props.typycheck == 0 ? ["TeamMember","TeamLeader","Manager","Administrator"] : ["TeamMember","TeamLeader"]
				_childlist = _role.map((item,index)=> {
					return (
						<div  key={index} className="edit-checklist" onClick={(e)=>_listChoose(item,e)}>{item}</div>	
					)
				})
			}
			let _inputshow = this.props.typedepartment ? "flex" : "none"
			let _listshow = this.props.show ? "block":"none"

		return (
			<div className="edit-list-content" style={{display:_listshow}}>
				<div className="edit-addlist" style={{display:_inputshow}}>
					<input className="edit-addlist-input" ref="adddepartment" placeholder="输入新增部门" />
					<div className="edit-addlist-surebtn" onClick={(e)=>_addDepartment(e)}>添加</div>
				</div>
					{_childlist}	
			</div>
		)
	}
}

class ListFooter extends Component {
	getItems() {
		let _items = this.props.data.map((item, index) => {
			return (
				<ListFooterItem key={index} item={item} {...this.props} />
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

class ListFooterItem extends Component {
	constructor() {
		super()
		this.state = {
			showRemind: false
		}
	}
	
	render() {
		let _item = this.props.item
		let _showRemind = this.state.showRemind
		let _classname = _item.status == 1 ? "footer" : "footer footerhidden"
		let _type = _item.account_type == "staff" ? "公司内部" : "代理商"

		return (
			<div className={_classname}>
				<div className="item1">{_item.index}</div>
				<div className="item2">{_item.full_name}</div>
				<div className="item7">{_type}</div>
				<div className="item5">{_item.department}</div>
				<div className="item6">{_item.role}</div>
				<div className="item3">{_item.username}</div>
				<div className="item8">{_item.coms_register}%</div>
				<div className="item9">{_item.coms_pay}%</div>
				<div className="item4">
					<span onClick={() => this.props.edit(_item)}>权限修改</span>
					<span onClick={() => this.props.editinfo("editinfo",_item)}>资料修改</span>
					<span onClick={() => this.props.bindinfo("bindinfo",_item.username)}>绑定</span>
					<span onClick={() => this.setState({showRemind: true})}>关闭</span>
					<div className="ctrl" style={{display: _showRemind ? "flex" : "none"}}>
						<span onClick={() => this.setState({showRemind: false})}>取消</span>
						<span onClick={() => {
							this.setState({showRemind: false}, () => this.props.delete(_item.username))
							}}>确定</span>
					</div>
				</div>
			</div>
		)
	}
}

class Edit extends Component {
	constructor() {
		super()
		this.state = {
			count: 1
		}
		this.permission = {} //初始化，最后传给服务端的权限列表
	}

	//设置权限，需要传给服务器的数据
	setPermission(key, permission) {
		this.permission[key] = permission
		// console.log(this.permission)
	}

	save() {
		Model.save(this, res => {
			// console.log(res)
			this.props.back(true)
		})
	}

	back() {
		this.props.back()
	}

	render() {
		let _show = this.props.show
		let _user = this.props.user
		let _footerData = _user.permission || []
		let _setPermission = this.setPermission.bind(this)
		let _save = this.save.bind(this)
		let _back = this.back.bind(this)

		return (
			<div className="container-edit" style={{display: _show ? "block" : "none"}}>
				<div className="container-buttons">
					<input className="back" type="button" defaultValue="返回"
						onClick={_back}/>
					<input className="save" type="button" defaultValue="保存"
						onClick={_save}/>
				</div>
				<div className="container-user">
					<span className="name">{_user.full_name || _user.username}</span>
					<span className="department">{_user.department}</span>
				</div>
				<div className="head">
					<div className="item1">序号</div>
					<div className="item2">名称</div>
					<div className="item3">查看</div>
					<div className="item4">操作</div>
				</div>
				<EditFooter data={_footerData}
					setPermission={_setPermission}/>
			</div>
		)
	}
}

class EditFooter extends Component {
	getItems() {
		let _items = this.props.data.map((item, index) => {
			return (
				<EditFooterItem key={index} permission={item} {...this.props} />
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

class EditFooterItem extends Component {
	//查看 CheckBox 点击
	readableChange(index) {
		this.props.setPermission(index, Model.getPremission(this))
	}

	//操作 CheckBox 点击
	writableChange(index) {
		this.props.setPermission(index, Model.getPremission(this))
	}

	render() {
		let _readableChange = this.readableChange.bind(this)
		let _writableChange = this.writableChange.bind(this)
		let _permission = this.props.permission
		let _index = _permission.index
		let _per = _permission.per

		return (
			<div className="footer">
				<div className="item1">{_index}</div>
				<div className="item2">{_permission.name}</div>
				<div className="item3">
					<input ref="readable" type="checkbox" defaultChecked={(_per == 1 || _per == 4) ? true : false} 
						onChange={e => _readableChange( _index)}/>
				</div>
				<div className="item4">
					<input ref="writable" type="checkbox" defaultChecked={(_per == 2 || _per == 4) ? true : false}
						onChange={e => _writableChange(_index)}/>
				</div>
			</div>
		)
	}
}

class Model {
	static userList(page,filter,username, callback) {
		let _url = `${hostPort}/permissionedit`
		let _filter = "all"
			if (filter == 1) {
				_filter = "staff"
			}else if (filter ==2) {
				_filter = "agency"
			}else{
				_filter = "all"
			}
		let _obj = {
			page: page,
			account_type:_filter 
		}
		if (username.length == 11) {
			_obj.username = username
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}

	//删除用户
	static deleteUser(username, callback) {
		let _url = `${hostPort}/deletemanager`
		let _obj = {
			username: username
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	//添加用户
	static editComplete(v,typecheck,edittype, callback) {
		let _urlold = `${hostPort}/addmanager`
		let _urledit = `${hostPort}/editmanagerprofile`

		let _coms_register = v.refs.award.value.replace(new RegExp("%",'g'),"")
		let _coms_pay = v.refs.promote.value.replace(new RegExp("%",'g'),"")

		let _objold = {
			coms_register:_coms_register,
			coms_pay:_coms_pay,
			phone: v.refs.phone.value,
			name: v.refs.name.value,
			department: v.refs.department.value,
			role:v.refs.role.value,
			account_type:typecheck
		}

		let _objedit = {
			coms_register:_coms_register,
			coms_pay:_coms_pay,
			username: v.refs.phone.value,
			new_name: v.refs.name.value,
			new_department: v.refs.department.value,
			new_role:v.refs.role.value,
			new_account_type:typecheck
		}

		let _url = edittype == "normal" ? _urlold : _urledit
		let _obj = edittype == "normal" ? _objold : _objedit

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static getPremission(v) {
		let _readable = v.refs.readable.checked
		let _writable = v.refs.writable.checked
		let _permission = 0

		if(_readable) {
			if(_writable) _permission = 4
			else _permission = 1
		}else {
			if(_writable) _permission = 2
		}
		return _permission
	}
	

	//修改资料
	static department({}, callback) {
		let _url = `${hostPort}/department_list`
		let _obj = {}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static save(v, callback) {
		let _url = `${hostPort}/permissionedit`
		let _obj = {
			username: v.props.user.username,
			permission_index: JSON.stringify(v.permission)
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
