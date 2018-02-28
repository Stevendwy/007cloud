/*
* @Author: steven
* @Date:   2017-12-13 14:23:19
* @Last Modified by:   steven
* @Last Modified time: 2018-01-26 20:31:15
*/
import React, {Component} from "react"
import CalendarSelector from "./calendarselector"
import {Prompt} from 'dialog-react'


export default class Cityselect extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  		showul:false,  		//是否显示选择列表
			titlelist:['省份'], 		//头部信息
			titleclick:0,   	//头部点击记录
			datalist:[], 		//数据数组
			clickList:[], 		//点击情况记录
			clicklistshow:[],   //点击index记录
			cityvalue: '选择城市', 		//选择内容展示
	  };
	}

	getData (fatherindex=0,selectindex=0, item){
		// fatherindex 选择主类
		// code 传的对应参数
		// 本身第几个点击
		let _showul = false

		let _datalist = JSON.parse(JSON.stringify(this.state.datalist))
		let _clicklistshow = JSON.parse(JSON.stringify(this.state.clicklistshow))
        let _clickList = JSON.parse(JSON.stringify(this.state.clickList))

        	_clicklistshow[fatherindex] = item.name   			//点击后名字列表
        	_clickList[fatherindex] = selectindex   			//点击index列表

       	let _titleclick = fatherindex
       	let _titlelist = ['省份', '城市', '区县']
       	let _city_value = ""

       	let _splictitle = _titlelist.slice(0, fatherindex + 1)
		let _clicklistlength = _clickList.slice(0,fatherindex + 1)
		let _clicklength = _clicklistshow.slice(0,fatherindex + 1)


		for (let i = 0; i < _clicklength.length; i++) {
			if (i == _clicklength.length - 1) {
				_city_value += _clicklength[i]
			}else {
				let _add =  _clicklength[i] + "-"
				_city_value += _add
			}
		}
		if (fatherindex < 2) {				       	
			Model.city(item.code,res=>{
				let _resdata = res.data	
				if (_resdata.length > 0) {
					_titleclick = fatherindex + 1
					_datalist[fatherindex + 1] = _resdata
					_splictitle = _titlelist.slice(0, fatherindex + 2)
					_showul = true
				}else{
					this.props.backcode(item.code)
				}
				this.setState({
					cityvalue:_city_value ,
					clicklistshow:_clicklistshow ,
					titleclick: _titleclick,
					titlelist:_splictitle,
					clickList:_clicklistlength ,
					datalist: _datalist,
					showul:_showul
		        })
			})
		}else{
			this.props.backcode(item.code)
			this.setState({
				cityvalue:_city_value ,
				clicklistshow:_clicklistshow ,
				titleclick: _titleclick,
				titlelist:_splictitle,
				clickList:_clickList ,
				datalist: _datalist,
				showul:_showul
	        })
		}
	}

	showUl (){
		this.setState({
			showul:true
		})
	}

	handleTitle(index){
		this.setState({
			titleclick:index
		})
	}
	
	componentDidMount(){
		let _code = "+86"
		Model.city(_code,res=>{
				let _data = []
					_data.push(res.data)
				this.setState({
					datalist:_data ,
	            })
			})
	}

	render() {
		let _datalist = this.state.datalist.map((item, index) => {
			let _ulclass = this.state.titleclick == index ? "ul" : "hidden"
			let _itemData = item.map((itemchild, indexchild) => {
				let _liclass = this.state.clickList[index] == indexchild ? "liclicked" : 'li'
				return <div className={_liclass} key={indexchild} onClick={this.getData.bind(this,index,indexchild,itemchild)}>{itemchild.name}</div>
			})
			return (
				<div className={_ulclass} key={index}>{_itemData}</div>
			)
		})

		let _titlelist = this.state.titlelist.map((items,indexs) => {
			let _titleclass = this.state.titleclick == indexs ? "city_title_click" : "city_title_list"
			return (
				<div className={_titleclass} key={indexs} onClick={this.handleTitle.bind(this,indexs)}>{items}</div>
			)
		})
		let _showul = this.state.showul ? 'city_list' : "hidden"
		let _imgclass = this.state.showul ? 'city_img_bottom' : 'city_img_top'

		return (
			<div className="city_select" >
				<div className="city_value" onClick={this.showUl.bind(this)}>{this.state.cityvalue}</div>
				<span className={_imgclass}></span>
				<div className={_showul}>
					<div className="city_title">{_titlelist}</div>
					{_datalist}
				</div>
			</div>
		)
	}
}



class Model {
	static city(code,callback){
		let _url = `${hostPort}/city_list`
		let _obj = {
			'city_code':code
		}

		getAjax(_url, _obj, res => {
			callback(res)
		})
	}

}