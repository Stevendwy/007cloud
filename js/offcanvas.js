import React, {Component} from "react"

export default class OffCanvas extends Component {
	constructor(props) {
		super(props)
		this.state = {
			foldsData: [],
			selectedType: props.type || "7.1"
		}
	}

	componentDidMount() {
		Model.getList(res => {
			this.setState({
				foldsData: res.data
			})
		})
	}

	getClassName() {
		let _show = this.props.show
		let _className = "container-offcanvas offcanvas-hidden"
		if(_show) _className = "container-offcanvas offcanvas-show"

		return _className
	}

	getFolds() {
		let _selectType = this.selectType.bind(this)
		let _folds = this.state.foldsData.map((item, index) => {
			return (
				<Fold key={index} selectedType={this.state.selectedType} item={item} click={_selectType}/>
			)
		})
		return _folds
	}

	selectType(type) {
		this.setState({
			selectedType: type
		}, () => {
			this.props.click(type)
		})
	}

	render() {
		return (
			<div className={this.getClassName()}>
				{this.getFolds()}
			</div>
		)
	}
}

class Fold extends Component {
	constructor() {
		super()

	}

	logout() {
		let _url = `${hostPort}/logout`

		getAjax(_url, {}, res => {
			location.href = "/login"
		})
	}

	click(type) {
		//console.log(type)
		if(type != "7.2") {
			this.setState({
				selected: type
			}, () => this.props.click(type))

		}
		else this.logout()
	}

	getList() {
		let _selected = this.props.selectedType
		let _items = this.props.item.subgroup.map((item, index) => {
			let _code = item.code
			return (
				<div key={index} className={_selected == _code ? "item selected" : "item"} onClick={() => this.click(_code)}>
					{`${_code} ${item.name}`}
				</div>
			)
		})
		return _items
	}
			
	render() {
		let _types = this.types
		let _item = this.props.item

		return (
			<div className="fold">
				<div className="title">
					{`${_item.index}.${_item.name}`}
				</div>
				<div className="container-list">
					{this.getList()}
				</div>
			</div>
		)
	}
}

class Model {
	static getList(callback) {
		let _url = `${hostPort}/menu_bar`
		let _obj = {}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}
}
