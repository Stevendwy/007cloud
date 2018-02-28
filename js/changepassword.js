import React, {Component} from "react"
import VerificationCode from "verification-code-react"

export default class ChangePassword extends Component {
	constructor() {
		super()
		this.m = new Model()

		this.state ={
			restart: false
		}
	}

	phoneChange(e) {
		let _value = e.target.value
		e.target.value = _value.replace(/\D/g, "")
	}

	verifyChange(e) {
		let _value = e.target.value
		e.target.value = _value.replace(/\D/g, "")
	}

	getVerificationCode() {
		this.m.getVerificationCode(this.refs.phone.value, res => {
			if(res.code != 1) this.restart()
			alert(res.msg)
		})
	}

	restart() {
		this.setState({restart: true}, this.state.restart = false)
	}

	submit() {
		let _params = {
			phone: this.refs.phone.value,
			sms_code: this.refs.verify.value,
			password: this.refs.password.value
		}

		this.m.submit(_params, res => {
			alert(res.msg)
		})
	}

	render() {
		let _phoneChange = this.phoneChange.bind(this)
		let _verifyChange = this.verifyChange.bind(this)
		let _getVerificationCode = this.getVerificationCode.bind(this)
		let _submit = this.submit.bind(this)

		return (
			<div className="container-changepassword">
				<div className="container-title">
					<span className="title">
						7.1修改登录密码
					</span>
				</div>
				<div className="util"></div>
				<div className="content">
					<div className="changepassword">
						<input ref="phone" placeholder="手机号" onChange={_phoneChange} />
						<div className="container-count-down">
							<input ref="verify" placeholder="验证码" onChange={_verifyChange} />
							<div className="count-down">
								<VerificationCode 
									startTime={60}
									autoStart={false}
									holdString="验证码"
									restart={this.state.restart}
									callback={_getVerificationCode}/>
							</div>
						</div>
						<input ref="password" type="password" placeholder="密码" />
						<input className="submit" type="button" defaultValue="确认修改" onClick={_submit} />
					</div>
				</div>
			</div>
		)
	}
}

class Model {
	getVerificationCode(phone, callback) {
		let _url = `${hostPort}/changepwd_sms`
		let _obj = {
			phone: phone
		}

		getAjax(_url, _obj, res => {
			console.log(res)
			callback(res)
		}, true)
	}

	submit(params, callback) {
		let _url = `${hostPort}/changepwd`
		let _obj = {
			phone: params.phone,
			sms_code: params.sms_code,
			password: params.password
		}

		postAjax(_url, _obj, res => {
			console.log(res)
			callback(res)
		})
	}
}
