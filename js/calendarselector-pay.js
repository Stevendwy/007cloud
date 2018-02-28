import React, {Component} from "react"
import PropTypes from "prop-types"
import {Calendar} from "react-date-range"

export default class CalendarSelectorPay extends Component {

	handleSelect(date) {
		this.props.callback(date)
	}

	render() {
		let _show = this.props.show
		let _handleSelect = this.handleSelect.bind(this)
		let _style = _show ? styles.date_range : styles.date_range_hidden

		return (
			<div style={_style}>
				<Calendar
					onInit={_handleSelect}
					onChange={_handleSelect}
					lang="cn"/>
			</div>
		)
	}
}

let styles = {
	date_range: {
		position: "absolute",
		left: "0",
		top: "40px",
		boxShadow: "0 0 4px #d8d8d8",
		display: "block",
		zIndex: "1"
	},
	date_range_hidden: {
		position: "absolute",
		left: "0",
		top: "40px",
		display: "none"
	}
}

CalendarSelectorPay.propTypes = {
	callback: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
}