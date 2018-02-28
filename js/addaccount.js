import React, {Component} from "react"
import Pagination from "pagination-react"
import Cityselect from './cityselect'

export default class AddAccount extends Component {
	render() {
		return (
			<div className="container-addaccount">
				<div className="container-title">
					<span className="title">
						3.1开通账户
					</span>
				</div>
				<div className="content">
					<Add />
					<Record />
				</div>
			</div>
		)
	}
}

class Add extends Component {
	constructor() {
        super()
        this.state = {
        	sourceclick:0, //默认选中
        	sourcelist:[], 		//用户来源列表
            office: "汽配商", //默认是汽配商
            officelist:[true,false,false,false,false,false]
        }
        this.city_code = ""
    }

	sourceClick(k) {
		let _officelist = ["汽配商","修理厂","4S店", "保险公司", "个人", "其他"]
		let _list = [false, false, false, false, false, false]
			_list[k] = true
        this.setState({
            office: _officelist[k],
            officelist:_list
        })
	}

	backCode(code){
		// console.log(code)
		this.city_code = code
	}

	submit() {
		let _refs = this.refs

		let _phone = _refs.phone.value
		let _name = _refs.name.value
		let _company = _refs.company.value
		let _remark = _refs.remark.value

		if(_phone.length < 1) alert("请输入手机号")
		else if(_name.length < 1) alert("请输入姓名")
		else if(_company.length < 1) alert("请输入公司名")
		else if(this.city_code == "") alert("请选择城市")	
		else {
			Model.dredge({
				city_code:this.city_code, //城市code
				username: _phone, //用户名
				full_name: _name, //姓名
				company: _company,
				office: this.state.office,
				source:_remark //来源
			}, () => {
				this.clearInfo()
				alert("开通成功")
			})
		}
	}

	clearInfo() {
		this.setState({
			office: "汽配商",
			officelist:[true,false,false,false,false,false]
		}, () => {
			let _refs = this.refs
			_refs.phone.value = ""
			_refs.name.value = ""
			_refs.company.value = ""
			_refs.remark.value = ""
			this.upSource()
		})
	}

	componentDidMount(){
		this.upSource()
	}

	upSource(){
		Model.getSource({},res=>{
			this.setState({
				sourcelist:res.data || []
			})
			if (res.data!=[]) {
				this.refs.remark.value = res.data[0]
			}
		})
	}
	

	toggleType(index){
		this.refs.remark.value = this.state.sourcelist[index]
		this.setState({
			sourceclick:index
		})
	}


	render() {
        let _office = this.state.office
        let _submit = this.submit.bind(this)
        let _officelist = this.state.officelist


        let _result = <div></div>
		let _data = this.state.sourcelist
		if (_data!=[]) {
			_result = _data.map((item,index)=>{
				let _classname = this.state.sourceclick == index ? "type selected" : "type"
				return (
					<input className={_classname} type="button" defaultValue={item} onClick={this.toggleType.bind(this,index)} />
				)
			})
		}

		return (
			<div className="container-add">
				<div className="head">
					<span>开通账户</span>
				</div>
				<div className="body">
					<div className="container-info">
						<div className="title">手机号</div>
						<input ref="phone" className="info" placeholder="" />
						<span className="remind">*</span>
					</div>
					<div className="container-info">
						<div className="title">姓名</div>
						<input ref="name" className="info" placeholder="" />
						<span className="remind">*</span>
					</div>
					<div className="container-info">
						<div className="title">公司</div>
						<input ref="company" className="info" placeholder="" />
						<span className="remind">*</span>
					</div>

					<div className="container-info">
						<div className="title">选择城市</div>
						<Cityselect backcode={this.backCode.bind(this)} />
						<span className="remind">*</span>
					</div>

					<div className="container-info">
						<div className="title">来源</div>
						<input ref="remark" className="info" placeholder="" />
						<span className="remind">*</span>
					</div>

					

					<div className="container-type">{_result}</div>
					{/*<div className="container-info">
											<input ref="city" className="info" placeholder="城市" />
											<span className="remind">*</span>
										</div>
										<div className="container-info">
											<input ref="remark" className="info" placeholder="备注" />
											<span className="remind"> </span>
										</div>*/}
					<div className="container-source">
						<div className="title">类型</div>
						<div className="radio-content">
							<span>
								<input  type="radio" className="source" value="汽配商"
									checked={_officelist[0]==true?true:false} 
									onClick={this.sourceClick.bind(this,0)} />
									汽配商
							</span>
							
							<span>
								<input  type="radio" className="source" value="修理厂"
									checked={_officelist[1]==true?true:false} 
									onClick={this.sourceClick.bind(this,1)} />
								修理厂
							</span>
							
							<span>
								<input  type="radio" className="source" value="4S店"
									checked={_officelist[2]==true?true:false} 
									onClick={this.sourceClick.bind(this,2)} />
								4S店
							</span>
							
							<span>
								<input  type="radio" className="source" value="保险公司"
									checked={_officelist[3]==true?true:false} 
									onClick={this.sourceClick.bind(this,3)} />
								保险公司
							</span>
							
							<span>
								<input  type="radio" className="source" value="个人"
									checked={_officelist[4]==true?true:false} 
									onClick={this.sourceClick.bind(this,4)} />
								个人
							</span>
							
							<span>
								<input  type="radio" className="source" value="其他"
									checked={_officelist[5]==true?true:false} 
									onClick={this.sourceClick.bind(this,5)} />
								其他
							</span>
							
						</div>
						
					</div>
					<input className="submit" type="button" defaultValue="确认开通（试用三天）" onClick={_submit}/>
				</div>
			</div>
		)
	}
}

class Record extends Component {
	constructor() {
		super()
		this.state = {
			footerData: [],
			count: 1
		}
	}

	itemClick(page) {
		this.getRecords(page)
	}

	getRecords(page) {
		this.currentPage = page
		Model.records(page, res => {
//			console.log(res)
			this.setState({
				footerData: res.data,
				count: res.amount_page
			})
		})
	}

	refresh() {
		this.getRecords(this.currentPage)
	}

	search() {
		console.log("search")
	}

	render() {
		let _footerData = this.state.footerData
		let _itemClick = this.itemClick.bind(this)
		let _refresh = this.refresh.bind(this)
		let _search = this.search.bind(this)

		return (
			<div className="container-record">
				<div className="head">
					<span className="title"> 
						个人开通账号记录 
						<span className="refresh"onClick={_refresh}>刷新</span>
					</span>
					{/*<div className="refresh"onClick={_refresh}></div>*/}

					<div className="container-search" style={{display:"none"}}>
						<input ref="phone" className="search-input" placeholder="手机号" />
						<input className="search-button" type="button" defaultValue="搜索" onClick={_search}/>
					</div>
				</div>
				<div className="body">
			        <div className="head">
			            <div className="item1">序号</div>
			            <div className="item2">姓名</div>
			            <div className="item3">手机号</div>
			            <div className="item4">公司</div>
			            <div className="item5">开通时间</div>
			            <div className="item6">到期日期</div>
			            <div className="item7">备注</div>
			            <div className="item8">营业执照</div>
			        </div>
			        <Footer data={_footerData} click={_itemClick} refresh={this.refresh.bind(this)} />
			    </div>
			    
			    <div className="container-world">
			    	{/*<div className="container-world">*目前营业执照仅支持电脑上传</div>*/}					
					<div className="world">黄色账号：已支付账号</div>
					<div className="container-wrold-bottom">
						红色品牌：15天内到期预警
					</div>
					<div className="container-world-top">
						{/*<div className="bluebox"></div>*/}
						<div >[ ]: 已上传营业执照</div>
					</div>
					
				</div>
			    <div className="container-pagination">
			        <Pagination
			            count={this.state.count}
			            groupCount={5}
			            selectedCount={1}
			            callback={page => _itemClick(page)}/>
			    </div>
			</div>
		)
	}
}

class Footer extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	show:false, 				//是否显示处理
	  	imgshow:false, 				//已经上传图片显示
	  	imgsrc:"" ,  				//上传图片的的地址
	  	textareavalue:"", 			//输入框内容
	  };
	  this.username = "" 			//用户账户
	}

	showClick(type,textarea,textareavalue){
		this.username = textarea 
		this.setState({
			show:type,
			textareavalue:textareavalue
		})
	}

	hideClick(type,send=false){
		if (send==true) {			
			let _conmment = this.refs.inputbtn.value
			Model.update({
				username:this.username,
				comment:_conmment
			},(res)=>{
				this.props.refresh()
				this.setState({
					show:type,
					textareavalue:""
				})
			})
		}else{
			this.setState({
				show:type
			})
		}
	}

	ontextChange(e){
		this.setState({
			textareavalue:e.target.text
		})
	}



	getAlert(){
		let _ontextChange = this.ontextChange.bind(this)
		let _value = this.state.textareavalue
		return (
			<div className="alertmes" style={{display:this.state.show ? "block":"none"}}>
				<div className="alertconent">
					<textarea type="text" 
							ref="inputbtn" 
							value={_value}
							className="inputbtn" 
							placeholder="输入修改内容" 
							onChange={_ontextChange}/>
					<div className="back" onClick={this.hideClick.bind(this,false,false)} >取消</div>
					<div className="sure" onClick={this.hideClick.bind(this,false,true)} >确定</div>
				</div>
			</div>
		)
	}

	handleChange(){
        this.gen_base64();           
	}

    gen_base64() {
        var file = this.refs.upload_file.files[0];
        let  r = new FileReader();  //本地预览
        r.readAsDataURL(file);    //Base64
        r.onload = ()=>{
            // console.log(r.result)
            alert("上传成功")
        }       
    }

	imgShow(){
		// "../img/bossloginimg.jpg"
		return (
			<div className="imgshow" 
				style={{display:this.state.imgshow ? "block":"none"}}
				onClick={()=>{this.setState({imgshow:!this.state.imgshow})}}
				>
				<img src={this.state.imgsrc} alt=""/>
			</div>
		)
	}

	imgShowmes(imgsrc){
		this.setState({
			imgshow:true,
			imgsrc:imgsrc
		})
	}

	inputClick(){
		this.refs.upload_file.click()
	}

	getItems() {
		let _itemImg = <div className="item8">
						<input style={{display:"none"}}
							accept="image/*"
					    	ref="upload_file" 
					    	type="file"
					    	name="upimage" 
					    	onChange={this.handleChange.bind(this)} 
					    	 />
					    <div onClick={this.inputClick.bind(this)}> + </div>
				    	</div>
        let _items = this.props.data.map((item, index) => {
        	// imgsrc=item.license_url
        	let _itemnormal = <div className="item8" onClick={this.imgShowmes.bind(this,"../img/bossloginimg.jpg")}>查看</div>
        	let _itemlast = item.license == 0 ? _itemImg : _itemnormal
        	let _itemcolor = item.membership == 0 ? "item3  nopaid":"item3  haspaid"
            return (
                <div className="footer" key={index}>
                    <div className="item1">{item.index}</div>
                    <div className="item2">{item.full_name}</div>
                    <div className={_itemcolor}>{item.username}</div>
                    <div className="item4">{item.company}</div>
                    <div className="item5">{item.register_datetime}</div>
                    <div className="item6">{item.valid_datetime}</div>
                    <div className="item7" onClick={this.showClick.bind(this,true,item.username,item.comment)} >{item.comment}</div>
                    {_itemlast}
                </div>
            )
        })

        return _items
    }

    render() {
        return (
            <div className="container-footer">
                {this.getItems()}
                {this.getAlert()}
                {this.imgShow()}
            </div>
        )
    }
}

class Model {
	static dredge(params, callback) {
		let _url = `${hostPort}/create_account`
		let _obj = {
			city_code:params.city_code,
			full_name: params.full_name,
			username: params.username,
			company: params.company,
			office: params.office,
			source:params.source
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static records(params, callback) {
		let _url = `${hostPort}/account_createdBy_manager`
		let _obj = {
			page: params
		}
		// let _obj = {}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}
	
	static update(params, callback) {
		let _url = `${hostPort}/user_comment_update`
		let _obj = {
			username: params.username, 
			comment:params.comment 
		}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}

	static getSource(params, callback) {
		let _url = `${hostPort}/account_source_list`
		let _obj = {}

		postAjax(_url, _obj, res => {
			callback(res)
		})
	}



}
