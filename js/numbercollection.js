import React, {Component} from 'react'
import Typedownload from './numbercollecdownload'
import Contentlist from './numbercolleccontentlist'

export default class NumberCollection extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	typechoose:"daily",
	  	getData:[],//发成列表
	  	gettime:{timestart:"",timeend:""}//生成时间
	  };
	  this.headname="2.1运营数据统计"
	}
	typeChoose(type){
		this.ajaxget(type)
	}
	ajaxget(type){
		let _url=`${hostPort}/operation_data`
		let _obj={time_format:"daily"}
		if (type == "weekly") {
			_obj = {time_format:"weekly"}
		} else if (type == "monthly") {
			_obj = {time_format:"monthly"}
		}else{
			_obj={time_format:"daily"}
		}
		postAjax(_url,_obj, response => {
			let _times={
				timestart:response.start_date_db,
				timeend:response.end_date_db
			}
			this.setState({
				getData:response.data || [],
				gettime:_times
			})
		})
	}
	componentWillMount(){
		this.ajaxget("daily")
	}
	render(){
		let _list=this.state.getData
		let _date= this.state.gettime
		return(
			<div className="nInclude">
				<div className="nIncludeHead"><h1>{this.headname}</h1></div>
				<Typedownload typeChoose={this.typeChoose.bind(this)} gettime={_date}/>
				<Contentlist getlist={_list}/>
			</div>
		)
	}
}
