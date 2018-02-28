import React, {Component} from "react"
import PropTypes from "prop-types"

export default class Navi extends Component {
	logout() {
		getAjax(`${hostPort}/logout`, {}, res => {
			location.href = "/login"
		})
	}

	render() {
		let _toggle = this.props.toggle
		let _logout = this.logout.bind(this)

		return (
			<div className="container-navi">
				<div className="util-navi">
					<input className="input-navi-ctrl" type="button" defaultValue="目录" onClick={_toggle} />
					<input className="input-navi-ctrl logout" type="button" defaultValue="退出" onClick={_logout} />
				</div>
				<div className="container-navi-title">
					<input className="input-navi-title" type="button" />
					<span>管理平台</span>
				</div>
			</div>
		)
	}
}

Navi.propTypes = {
	toggle: PropTypes.func.isRequired
}
