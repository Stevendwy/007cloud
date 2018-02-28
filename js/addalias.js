import React, {Component} from "react"
import Pagination from 'pagination-react'

export default class AddAlias extends Component {
	constructor() {
		super()
		this.state = {
			footerData: [], count: 1, //页码总数
			showAdd: false //显示添加框
		}
		this.currentPage = 1
		this.currentItem = null //当前选中的item，来用保存传值
        this.isEdit = false //默认是添加
	}

	//请求数据
	aliasList(page, searchValue = "") {
		this.currentPage = page
		Model.aliasList(page, res => {
			//console.log(res)
			this.setState({
				footerData: res.data,
				count: res.amount_page
			}, this.clearData) //获取成功后，顺便清空下一编辑输入框
		}, searchValue)
	}

	addAlias() {
        this.isEdit = false
		this.setState({
			showAdd: true
		}, () => {
            this.clearData() //清空输入框的预设值内容
        })
	}

	editAlias(item) {
		this.currentItem = item
        this.isEdit = true
		this.setState({
			showAdd: true
		}, () => {
			this.presetData(item) //修改输入框的预设值内容
		})
	}

    deleteAlias(item) {
        this.currentItem = item
        Model.deleteAlias(this, res => {
            this.aliasList(this.currentPage)
        })
    }

	//编辑框确认事件
	editComplete() {
	    let callback = (
            res => {
                this.setState({
                    showAdd: false
                }, () => this.aliasList(this.currentPage))
            }
        )

	    if(this.isEdit) {
            Model.editComplete(this, callback)
        }else {
            Model.addAlias(this, callback)
        }
	}

	presetData(alias) {
		// console.log(alias)
		this.refs.code.value = alias.pid || ""
		this.refs.name.value = alias.formal_name || ""
		this.refs.alias.value = alias.informal_name || ""
	}

	//删除添加用户框内容
	clearData() {
		this.refs.code.value = ""
		this.refs.name.value = ""
		this.refs.alias.value = ""
	}

	search() {
		this.aliasList(this.currentPage, this.refs.search.value)
	}

    render() {
    	let _footerData = this.state.footerData
    	let _addAlias = this.addAlias.bind(this)
    	let _showEdit = this.state.showEdit
        let _editAlias = this.editAlias.bind(this)
        let _deleteAlias = this.deleteAlias.bind(this)
    	let _refresh = this.state.refresh
    	let _editComplete = this.editComplete.bind(this)
    	let _aliasList = this.aliasList.bind(this)
		let _search = this.search.bind(this)

        return (
            <div className="container-addalias">
				<div className="container-title">
					<span className="title">
						5.6零件别名录入
					</span>
					<div className="container-search">
						<input ref="search" className="search-input" placeholder="零件号" />
						<input className="search-button" type="button" defaultValue="搜索" onClick={_search}/>
					</div>

				</div>
				<div className="content">
					<div className="util">
						<input className="add" type="button" value="添加" onClick={_addAlias} />
					</div>
					<div className="head">
						<div className="item1">序号</div>
						<div className="item2">零件号</div>
						<div className="item3">零件名称</div>
                        <div className="item4">别称</div>
                        <div className="item5">品牌</div>
						<div className="item6">录入人</div>
						<div className="item7">创建时间</div>
						<div className="item8">操作</div>
					</div>
					<Footer data={_footerData}
						edit={_editAlias}
                        delete={_deleteAlias}/>
						<div className="container-pagination">
						<Pagination
							count={this.state.count}
							groupCount={5}
							selectedCount={1}
							callback={page => _aliasList(page)}/>
					</div>
					<div className="edit" style={{display: this.state.showAdd ? "flex" : "none"}}>
						<input ref="code" className="info" placeholder="请输入零件号（选填）" />
						<input ref="name" className="info" placeholder="请输入零件名称（必填）" />
						<input ref="alias" className="info" placeholder="请输入别称（必填）" />
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
					<div className="item2">{item.pid}</div>
					<div className="item3">{item.formal_name}</div>
                    <div className="item4">{item.informal_name}</div>
                    <div className="item5">{item.brandCode}</div>
					<div className="item6">{item.editor}</div>
					<div className="item7">{item.create_time}</div>
					<div className="item8">
                        <span onClick={() => this.props.edit(item)}>修改</span>
                        <span onClick={() => this.props.delete(item)}>删除</span>
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
	static aliasList(page, callback, searchValue) {
		let _url = `${hostPort}/informal_name_list`
		let _obj = {
			page: page,
            formal_name: searchValue
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}

    static addAlias(v, callback) {
        let _url = `${hostPort}/informal_name_add`
        let _refs = v.refs
        let _obj = {
            pid: _refs.code.value,
            new_formal_name: _refs.name.value,
            new_informal_name: _refs.alias.value,
            // brandCode: v.currentItem.brandCode,
        }

        postAjax(_url, _obj, res => {
            callback(res)
        })
    }

	static editComplete(v, callback) {
		let _url = `${hostPort}/informal_name_edit`
		let _refs = v.refs
		let _obj = {
            pid: _refs.code.value,
            new_formal_name: _refs.name.value,
            new_informal_name: _refs.alias.value,
            original_formal_name: v.currentItem.formal_name,
            original_informal_name: v.currentItem.informal_name,
            brandCode: v.currentItem.brandCode,
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

    static deleteAlias(v, callback) {
        let _url = `${hostPort}/informal_name_delete`
        let _refs = v.refs
        let _obj = {
            original_formal_name: v.currentItem.formal_name,
            original_informal_name: v.currentItem.informal_name,
            brandCode: v.currentItem.brandCode,
        }

        postAjax(_url, _obj, res => {
            callback(res)
        })
    }
}
