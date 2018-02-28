import React, {Component} from "react"
import Pagination from 'pagination-react'

export default class BrandDataChange extends Component {
	constructor() {
		super()
		this.state = {
			footerData: [],
			count: 1, //页码总数
			showAdd: false //显示添加框
		}
		this.currentPage = 1
		this.operation = ""
		this.id = -1
	}

	//请求数据
	brandList(page) {
		this.currentPage = page
		Model.brandList(page, res => {
			//console.log(res)
			this.setState({
				footerData: res.data,
				count: res.amount_page
			}, this.clearData) //获取成功后，顺便清空下一编辑输入框
		})
	}

	addBrand() {
		this.setState({
			showAdd: true
		}, () => this.operation = "add")
	}

	editBrand(item) {
		this.id = item.id
		this.setState({
			showAdd: true 
		}, () => {
			this.presetData(item)
			this.operation = "edit"
		})
	}

	//编辑框确认事件
	editComplete() {
		Model.editComplete(this, res => {
			this.setState({
				showAdd: false 
			}, () => this.brandList(this.currentPage))
		})
	}

	presetData(brand) {
		this.refs.brand.value = brand.brand_name
		this.refs.models.value = brand.amount_models
		this.refs.parts.value = brand.amount_parts
	}

	//删除添加用户框内容
	clearData() {
		this.refs.brand.value = ""
		this.refs.models.value = ""
		this.refs.parts.value = ""
	}

    render() {
    	let _footerData = this.state.footerData
    	let _addBrand = this.addBrand.bind(this)
    	let _showEdit = this.state.showEdit
    	let _editBrand = this.editBrand.bind(this)
    	let _refresh = this.state.refresh
    	let _editComplete = this.editComplete.bind(this)
    	let _brandList = this.brandList.bind(this)

        return (
            <div className="container-branddatachange">
				<div className="container-title">
					<span className="title">
						5.3品牌数据修改
					</span>
				</div>
				<div className="content">
					<div className="util">
						<input className="add" type="button" value="添加品牌" onClick={_addBrand} />
					</div>
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">品牌</div>
						<div className="item3">车型</div>
						<div className="item4">零件</div>
						<div className="item5">操作</div>
					</div>
					<Footer data={_footerData}
						edit={_editBrand}/>
						<div className="container-pagination">
						<Pagination
							count={this.state.count}
							groupCount={5}
							selectedCount={1}
							callback={page => _brandList(page)}/>
					</div>
					<div className="edit" style={{display: this.state.showAdd ? "flex" : "none"}}>
						<input ref="brand" className="info" placeholder="请输入品牌名" />
						<input ref="models" type="number" className="info" placeholder="请输入车型数" />
						<input ref="parts" type="number" className="info" placeholder="请输入零件数" />
						<div className="container-buttons">
							<input type="button" className="button" value="取消" onClick={() => this.setState({showAdd: false}, this.clearData)} />
							<input type="button" className="button" value="确认" onClick={_editComplete} />
						</div>
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
				<div className="footer" key={index}>
					<div className="item1">{item.index}</div>
					<div className="item2">{item.brand_name || item.brand}</div>
					<div className="item3">{item.amount_models}</div>
					<div className="item4">{item.amount_parts}</div>
					<div className="item5">
						<span onClick={() => this.props.edit(item)}>{index == 0 ? "" : "修改"}</span>
					</div>
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
	static brandList(page, callback) {
		let _url = `${hostPort}/brand_data_modification`
		let _obj = {
			page: page
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static editComplete(v, callback) {
		let _url = `${hostPort}/brand_data_modification`
		let _refs = v.refs
		let _obj = {
			id: v.id,
			brand_name: _refs.brand.value,
			amount_models: _refs.models.value,
			amount_parts: _refs.parts.value,
			operation: v.operation //add or edit
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
