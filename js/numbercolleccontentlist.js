import React, {Component} from 'react'
import {render} from "react-dom"

export default class NumberCollection extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	getData:[]
	  };
	  this.indexlist=["序号",
					  "100",
					  "101",
					  "102",
					  "103",

					  "110",
					  "120",
					  "130",
					  "140",
					  "160",
					  "170",
					  "180",

					  "190",
					  "191",

					  "200",
					  "201",
					  "202",

					  "210",
					  "211",
					  "212",
					  "213",
					  ]
	  this.namelist=["时间/类型",
	  				  "总查询量",
	  				  "总查询量－错误",
					  "总查询量－WEB",
					  "总查询量－APP",

					  "车架号查询量",
					  "车型查询量",
					  "分组查询量",
					  "零件页面查询量",
					  "零件搜索量",
					  "零件号复制量",
					  "品牌号查询量",

					  "报价单数量",
					  "报价单金额",

					  "总用户量",
					  "访问用户量",
					  "独立IP量",

					  "新增用户量",
					  "新增用户量－销售",
					  "新增用户量－WEB",
					  "新增用户量－APP"]
		this.meslist=[
					"data_time",
					"total_query_vol",
					"total_query_vol_error",
					"total_query_vol_web",
					"total_query_vol_app",

					"vin_query_vol",
					"model_query_vol",
					"subgroup_query_vol",
					"part_query_vol",
					"spec_parts_searching_vol",
					"part_copy_vol",
					"article_query_vol",
					
					"quotation_amount",
					"quotation_value_amount",

					"users_amount",
					"visted_users_amount",
					"unique_ip_amount",

					"new_users",
					"new_users_sellers",
					"new_users_web",
					"new_users_app"
				]
	}
	render(){
		// 生成index
		let _indexlist=this.indexlist.map((item,i)=>{
			return(
				<div key={i} className="nContentList">{item}</div>
			)
		})
		// 生成目录
		let _namelist = this.namelist.map((item,index)=>{
			return (
				<div key={index} className="nContentList">{item}</div>
			)
		})
		// 生成列表
		let _rightchild = <div></div>
		if (this.props.getlist.length>0) {
			_rightchild=this.props.getlist.map((mes,index)=>{
				let _childlist=this.indexlist.map((item,i)=>{
					let _keys=this.meslist[i]
					let _timespecial = i==0 ? mes["time_desc"]:""
					return(
						<div key={i} className="nContentList">
							<span>{_timespecial}</span>							
							<span>{mes[_keys]}</span>
						</div>
					)
				})
				return (
					<div key={index} className="nBodyPortait nBodyPortaitRight">
						{_childlist}
					</div>
				)
			})
		}
		// 横向布局 设计

		// let _contentlist=this.indexlist.map((itemc,ic)=>{
		// 	let _rightlist = <div></div>
		// 	if (this.props.getlist.length>0) {
		// 		_rightlist=this.props.getlist.map((mesc,indexc)=>{
		// 			let _keyc=this.meslist[ic]
		// 			let _timespecial = ic==0 ? mesc[_keyc]:""
		// 			return (
		// 				<div key={indexc} className="nContentList">
		// 					<span>{mesc[_keyc]}</span>
		// 					<span>{_timespecial}</span>
		// 				</div>
		// 			)
		// 		})
		// 	}
		// 	return(
		// 		<div key={ic} className="nBodyPortait nBodyPortaitIndex" >
		// 			<div className="nContentList">{itemc}</div>
		// 			<div className="nContentList">{this.namelist[ic]}</div>
		// 			{_rightlist}
		// 		</div>
		// 	)
		// })


		
		return(
			<div className="nBody">
				<div className="nBodyLeft">
					<div className="nBodyPortait nBodyPortaitIndex">{_indexlist}</div>
					<div className="nBodyPortait nBodyPortaitName">{_namelist}</div>
				</div>
				<div className="nBodyRight">
					{_rightchild}
				</div>
				{/*{_contentlist}*/}
			</div>
		)

	}
}
