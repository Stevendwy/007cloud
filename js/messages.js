import React, {Component} from 'react'
import {Prompt, Confirm} from "dialog-react"
import Pagination from 'pagination-react'

export default class Messages extends Component {
	constructor() {
		super()
		this.model = new Model()
		this.state = {
			promptTitle: "", //选择弹框内容
			showPrompt: false, //选择弹框是否显示
			fun: this.recall.bind(this), //选择弹框绑定的函数
			showConfirm: false, //确认弹框是否显示
			confirmTitle: "", //确认弹框显示内容
            news: [], //消息列表
            count: 1, //消息总数
            currentNews: {} //当前查看的消息
		}

		this.currentPage = 1
		this.isRecall = false //是否为撤回模式，控制显示发送与撤回
        this.isSending = false //是否发送状态中
	}

	//请求消息列表
	newsList(page) {
		this.currentPage = page

    	this.model.newsList(this.currentPage, res => {
    		this.setState({
                news: res.data,
                count: res.length,
                amount_page: res.amount_page
            })
    	})
    }

    createNews() {
    	this.isRecall = false
    	this.setState({
    		showDetail: true
    	})
    }

    //打开列表消息事件
    openNews(item) {
    	this.isRecall = true
    	this.setState({
            showDetail: true,
            currentNews: item
        }, () => {
        	this.refs.title.value = item.title
        	this.refs.text.value = item.text
        })
    }
    
    //点击发送事件
    writeNews() {
	    if(this.isSending) return

    	let params = {
    		title: this.refs.title.value,
    		text: this.refs.text.value,
    		isNotification: this.refs.notification.checked
    	}
        
    	this.model.writeNews(this, params, res => {
    		this.setState({
                showDetail: false
            }, () => {
                this.isSending = false
            	this.clearValues()
            })
    	})
    }

    //撤回事件
    recall() {
    	this.model.recall(this.state.currentNews, res => {
    		this.setState({
                showDetail: false
            },() => {
                this.clearValues()
            })
    	})
    }

    //返回事件
    back() {
    	this.setState({
    		showDetail: false
    	}, () => {
    		this.clearValues()
    	})
    }

    //返回或发送成功后，清空问题输入记录
    clearValues() {
    	this.refs.title.value = ""
        this.refs.text.value = ""
        this.refs.notification.checked = false
        this.newsList(this.currentPage)
    }

    //消息列表生成器
    getNews() {
        let _list = this.state.news.map((item, index) => {
            return (
                <div key={index} className="item" onClick={this.openNews.bind(this, item)}>
                    <div className="container-head">
                        <span className="title">{item.title}</span>
                        <span className="time">{item.register_datetime}</span>
                    </div>
                    <div className="body">
                        <div className="summary">{item.text}</div>
                    </div>
                </div>
            )
        })
        return _list
    }

	render() {
        let _showDetail = this.state.showDetail

		return (
			<div className="container-messages">
				<div className="container-title">
					<span className="title">
						5.5发送群发消息
					</span>
				</div>
				<div className="content">
                    <div className="choose" style={{display: !_showDetail ? "flex" : "none"}}>
                        <input className="new" type="button" value="新建消息" onClick={this.createNews.bind(this)} />
                        <div className="container-list">
                            {this.getNews()}
                        </div>
                        <div className="container-pagination">
                            <Pagination
                                count={this.state.count}
                                selectedCount={1}  
                                groupCount={5}
                                callback={index => this.newsList(index)} />
                        </div>
                    </div>
                    <div className="send" style={{display: _showDetail ? "flex" : "none"}}>
                        <div className="container-buttons">
                        	<input className="back" type="button" value="返回" onClick={this.back.bind(this)} />
                        	<input className="recall" style={{display: this.isRecall ? "block" : "none"}} type="button" value="撤回" onClick={this.recall.bind(this)} />
                        </div>
    					<input ref="title" className="title" autoFocus placeholder="消息标题：" />
    					<textarea ref="text" className="text" placeholder="消息内容："></textarea>
    					<div className="container-checkboxs" style={{display: this.isRecall ? "none" : "flex"}}>
    						<input ref="notification" className="notification" type="checkbox"/>
    						<span>弹框提示</span>
    					</div>
    					<div className="container-submit" style={{display: this.isRecall ? "none" : "flex"}}>
    						<input className="submit" type="button" value="发送" onClick={this.writeNews.bind(this)} />
    					</div>
                    </div>
				</div>
				<Prompt
					content={this.state.promptTitle}
					confirm="取消"
					other="确定"
					show={this.state.showPrompt}
					fun={this.state.fun}
					close={() => this.setState({showPrompt: false})} />
				<Confirm
					content={this.state.confirmTitle}
					confirm="好的"
					show={this.state.showConfirm}
					close={() => this.setState({showConfirm: false})} />
			</div>
		)
	}
}

class Model {

	newsList(page, callback) {
        let _url = `${hostPort}/notification_list`
        let _obj = {
            page: page
        }

        getAjax(_url, _obj, (res) => {
            //console.log(res)
            callback(res)
        })
    }

    writeNews(v, params, callback) {
		if(params.title.length < 1) {
			alert("请输入标题")
			return
		}else if(params.text.length < 1) {
			return
			alert("请输入内容")
		}

		v.isSending = true

        let _url = `${hostPort}/new_notification`
        let _obj = {
        	title: params.title,
        	text: params.text,
        	message_type: params.isNotification ? "popup" : "usual"
        }

        postAjax(_url, _obj, res => {
            // console.log(res)
            callback(res)
        })
    }

    recall(news, callback) {
        let _url = `${hostPort}/notification_edit`
        let _obj = {
            text: news.text,
            title: news.title,
            register_datetime: news.register_datetime
        }

        postAjax(_url, _obj, res => {
        	// console.log(res)
        	callback(res)
        })
    }
}