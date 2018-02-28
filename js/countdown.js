import React, {
	Component
} from "react"
import PropTypes from "prop-types"

export default class Countdown extends Component {
	constructor(props) {
		super(props)

		this.startTime = props.startTime
		this.holdString = props.autoStart ? props.startTime + "s" : props.holdString
		this.timer = null
		this.isRuning = false
		this.style = props.autoStart ? styles.container_countdown : styles.container_countdown_stop

		this.state = {
			currentTime: props.startTime,
			holdString: this.holdString
		}
		
		this.createKeyFrames()
	}

	componentDidMount() {
		if(this.props.autoStart) this.restart(false)
	}

	createKeyFrames() {
		let style = document.createElement('style')
		style.type = 'text/css'
		var keyFrames = `
			@-webkit-keyframes count_down {
			    to {
					background-color: #D8D8D8;
				}
			}`
		style.innerHTML = keyFrames
		document.getElementsByTagName('head')[0].appendChild(style)
	}

	restart(isFromClick) {
		if(this.isRuning) {
			return
		} else {
			//do anything in a loop just one time...
			this.props.callback()
		}

		//click should change value intime
		if(isFromClick) {
			this.setState({
				currentTime: this.startTime,
				holdString: null
			})
			this.style = styles.container_countdown
		}

		this.isRuning = true
		this.timer = setInterval(() => {
			let _currentTime = this.state.currentTime
			let _state = null

			if(_currentTime > 1) {
				_state = {
					currentTime: _currentTime - 1,
					holdString: null
				}
			} else {
				_state = {
					holdString: this.holdString,
					currentTime: this.startTime
				}
				clearInterval(this.timer)
				this.isRuning = false
				this.style = styles.container_countdown_stop
			}

			this.setState(_state)
		}, 1000)
	}

	render() {
		let _currentTime = this.state.currentTime
		let _holdString = this.state.holdString
		let _defaultValue = _holdString ? _holdString : _currentTime + "s"

		let _restart = this.restart.bind(this, true)
		
		return(
			<input
				style={this.style}
				onClick={_restart}
				type="button"
				defaultValue= {_defaultValue} />
		)
	}
}

let styles = {
	container_countdown: {
		width: "100%",
		height: "100%",
		backgroundColor: "#bfbfbf",
		color: "white",
		animation: "count_down 1s ease-in-out 30 alternate",
		boxShadow: ""
	},
	container_countdown_stop: {
		width: "100%",
		height: "100%",
		backgroundColor: "#c8372b",
		color: "white",
		animation: "",
		boxShadow: ""
	}
}

Countdown.propTypes = {
	startTime: PropTypes.number.isRequired,
	holdString: PropTypes.string.isRequired,
	callback: PropTypes.func.isRequired,
	autoStart: PropTypes.bool.isRequired
}