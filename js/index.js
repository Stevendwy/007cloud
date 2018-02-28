import React, {Component} from "react"
import {render} from "react-dom"
import Navi from './navi'
import OffCanvas from './offcanvas'
import Content from './content'

class Page extends Component {
	constructor() {
		super()
		this.state = {
			toggleOffCanvasClick:false, //是否目录点击
			showOffCanvas: true,
			contentType:"7.1" //内容类型，用于修改 content，这里可以设置初始值
		}
	}

	toggleOffCanvas() {
		this.setState({
			showOffCanvas: !this.state.showOffCanvas,
			toggleOffCanvasClick:!this.state.toggleOffCanvasClick
		})
	}

	changeContentType(type) {
		this.setState({
			contentType: type,			
		})
	}

	render() {
		let _toggleOffCanvas = this.toggleOffCanvas.bind(this)
		let _showOffCanvas = this.state.showOffCanvas
		let _contentType = this.state.contentType
		let _toggleOffCanvasClick = this.state.toggleOffCanvasClick

		return (
			<div className="container-page">
				<Navi toggle={_toggleOffCanvas} />
				<div className="container-page-content">
					<OffCanvas
						show={_showOffCanvas} 
						type={_contentType}
						click={this.changeContentType.bind(this)} />
					<Content type={_contentType} toggleOffCanvasClick={_toggleOffCanvasClick} />
				</div>
			</div>
		)
	}
}

render(<Page />, document.getElementById("root"))
