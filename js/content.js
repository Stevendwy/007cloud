import React, {Component} from "react"

export default class Content extends Component {
	constructor() {
		super()
		this.initialType = '-1'
		this.state = {
			type: '7.1'
		}
		this.toggleOffCanvasClick = false //判断是否已经点击过
	}

	componentWillReceiveProps(props) {
		//处理目录点击 刷新问题
		if (this.toggleOffCanvasClick != props.toggleOffCanvasClick) {
			this.toggleOffCanvasClick = props.toggleOffCanvasClick
			return
		}
		//处理重复点击相同的问题
		if(props.type == this.state.type) {
			this.setState({
				type: this.initialType
			}, () => this.setState({
				type: props.type
			}))
		}else {
			this.setState({
				type: props.type
			})
		}
	}

	render() {
		return (
			<div className="container-content">
				{ContentSelector.getContent(this.state.type)}
			</div>
		)
	}
}

import SalesVolume from './salesbolume'    							//销售团队明细 4.2
import ThirdApi from './thirdapi'  									//第三方接口
import InquireErrorBack from './inquireerrorback' 					//查询错误反馈
import NumberCollection from './numbercollection' 					//运营数据统计
import InquirePerson from './inquireperson' 						//个人查询量统计
import InquireBrand from './inquirebrand' 							//个人查询量统计
import InquireBrandError from './inquirebranderror' 				//个人查询量统计
import AccountManage from './accountmanage' 						//用户管理
import BrandUpdateManage from './brandupdatemanage' 				//品牌上下线管理
import FeedbackManage from './feedbackmanage' 						//用户反馈管理
import ChangePassword from './changepassword' 						//修改密码
import Messages from './messages' 									//消息管理
import HandleManage from './handlemanage' 							//系统管理
import AddAccount from './addaccount' 								//开通账户
import BrandDataChange from './branddatachange'
import Pay from './pay'
import AddAlias from './addalias'
import Cash from './cash' 											//现金记录
import Saleroom from './saleroom' 									//销售数据
import Saledata from './saledata' 									//销售额

class ContentSelector {

	//这个函数专门用来处理替换内容的逻辑
	static getContent(type) {
        switch (type) {
        	case "1.1": return <ThirdApi />

            case "2.1": return <NumberCollection />          
            case "2.2": return <InquireBrand />
            case "2.3": return <InquireBrandError /> 
            case "2.4": return <Saledata />          
            case "2.5": return <Saleroom />         
            // case "2.4": return <InquirePerson />
			
			



            case "3.1": return <AddAccount />
            case "3.2": return <AccountManage />

        	case "4.1": return <Pay />
        	case "4.2": return <SalesVolume />
        	case "4.3": return <Cash />
        	
        	case "5.1": return <FeedbackManage />
            case "5.2": return <InquireErrorBack />
        	case "5.3": return <BrandDataChange />
        	case "5.4": return <BrandUpdateManage />
        	case "5.5": return <Messages />
        	case "5.6": return <AddAlias />

        	case "6.1": return <HandleManage />

        	case "7.1": return <ChangePassword />

        	default: return <div></div>
        }
	}
}
