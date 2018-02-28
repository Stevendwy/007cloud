import React, {Component} from "react"
import Pagination from 'pagination-react'

export default class BrandUpdateManage extends Component {
	constructor() {
		super()
		this.m = new Model()
		this.state = {
			footerData: [],
			count: 1
		}

		this.feedback = {} //反馈消息集合
		this.currentPage = 1
	}

	//获取列表
	ajaxData(page) {
		this.currentPage = page
		// console.log(page)
		this.m.ajaxData(page, res => {
			this.setState({
				footerData: res.data || [],
				count: res.amount_page || 1
			})
		})
	}

	//上下线状态修改
	changeStatus(isOnline, brand, saved) { //这里 saved 是针对保存事件的，其他情况不用传
		this.m.changeStatus(isOnline, brand, this.feedback[brand.code], res => {
			this.ajaxData(this.currentPage)
			if(saved) saved()
		})
	}

	//文字反馈内容更变
	feedbackChange(value, code) {
		this.feedback[code] = value
		// console.log(JSON.stringify(this.feedback))
	}

	render() {
		let _footerData = this.state.footerData
		let _ajaxData = this.ajaxData.bind(this)

		return (
			<div className="container-brandupdatemanage">
				<div className="container-title">
					<span className="title">
						5.4品牌上下线
					</span>
				</div>
				<div className="content">
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">品牌</div>
						<div className="item3">状态</div>
						<div className="item4">操作</div>
						<div className="item5">文字反馈</div>
						<div className="item6">编辑</div>
					</div>
					<Footer data={_footerData} changeStatus={this.changeStatus.bind(this)} feedbackChange={this.feedbackChange.bind(this)} />
				</div>
				<div className="container-pagination">
					<Pagination
                        count={this.state.count}
                        selectedCount={1}  
                        groupCount={10}
                        callback={index => this.ajaxData(index)} />
				</div>
			</div>
		)
	}
}

class Footer extends Component {
	getItems() {
		let _items = this.props.data.map((item, index) => {
			return (
				<ItemFooter brand={item} key={index} {...this.props} />
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

class ItemFooter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isEditing: false,
			feedback: props.brand.text_feedback
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			feedback: nextProps.brand.text_feedback
		})
	}

	//反馈信息更变事件
	feedbackChange(item, e) {
		let _value = e.target.value
		this.setState({
			feedback: _value
		}, () =>{
			this.props.feedbackChange(_value, item.code)
		})
	}

	//保存点击事件
	feedbackSave() {
		this.props.changeStatus(false, this.props.brand, () => {
			this.setState({
				isEditing: false
			})
		})
	}

	render() {
		let _brand = this.props.brand
		let _isOffline = _brand.status != 1
		let _isEditing = this.state.isEditing
		let _feedback = this.state.feedback

		return (
			<div className="footer">
				<div className="item1">{_brand.index}</div>
				<div className="item2">{_brand.name}</div>
				<div className="item3">
					<div className={_isOffline ? "footer3-offline" : "footer3-online"}>
						{_isOffline ? "已下线" : "正常"}
					</div>
				</div>
				<div className="item4">
					<div className={_isOffline ? "footer4-offline" : "footer4-online"} onClick={() => this.props.changeStatus(_isOffline, _brand)}>
						{_isOffline ? "上线" : "下线"}
					</div>
				</div>
				<div className="item5 footer5">
					<input ref="feedback" className="feedback" style={{display: _isOffline ? "block" : "none"}}
						placeholder="输入反馈信息"
						value={_feedback || ""}
						onChange={this.feedbackChange.bind(this, _brand)}
						onFocus={() => this.setState({isEditing: true})} />
				</div>
				<div className="item6">
					<div className="footer6" style={{display: _isOffline ? "flex" : "none"}}>
						<span style={{display: _isEditing ? "none" : "block"}}
							onClick={() => this.setState({isEditing: true})}>编辑</span>
						<span style={{display: _isEditing ? "block" : "none"}}
							onClick={() => this.setState({isEditing: false})}>取消</span>
						<span style={{display: _isEditing ? "block" : "none"}}
							onClick={this.feedbackSave.bind(this)}>保存</span>
					</div>
				</div>
			</div>
		)
	}
}

class Model {
	//获取列表
	ajaxData(page, callback) {
		// console.log(page)
		let _url = `${hostPort}/brand_management_operation`
		let _obj = {
			page: page
		}

		getAjax(_url, _obj, res => {
			console.log(res)
			callback(res)
		})
	}

	//上下线状态修改
	changeStatus(isOnline, brand, feedback, callback) {
		let _url = `${hostPort}/brand_management_operation`
		let _obj = {
			name: brand.name,
			code: brand.code,
			status: isOnline ? 1 : 2,
			text_feedback: feedback
		}

		postAjax(_url, _obj, res => {
			// console.log(res)
			callback(res)
		})
	}
}
