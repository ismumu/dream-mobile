import React from "react";
import { connect } from "dva";
import {
	ImagePicker,
	List,
	Picker,
	DatePicker,
	InputItem,
	NavBar,
	Icon,
	Button,
	Radio,
	TextareaItem,
	Toast
} from "antd-mobile";

import { createForm } from 'rc-form';
import Storage from '../../utils/storage';
import styles from "./edit.less";
import Util from "../../utils/util";
import Cropper from 'react-cropper';
import NavBarPage from "../../components/NavBar"

import 'cropperjs/dist/cropper.css';

import SexM from './image/sex_m.png';
import SexW from './image/sex_w.png';
import SexMM from './image/sex_mm.png';
import SexWW from './image/sex_ww.png';
import SexYx from './image/sex_yx.png';
import SexNo from './image/sex_no.png';
import SexWn from './image/sex_wn.png';

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;



const UID = Storage.get('uid');


// 性别列表
const sexs = [
	{
		value: 0,
		label: '男',
		icon: SexM,
	}, {
		value: 1,
		label: '女',
		icon: SexW,
	}, {
		value: 2,
		label: '男男',
		icon: SexMM,
	}, {
		value: 3,
		label: '女女',
		icon: SexWW,
	}, {
		value: 4,
		label: '异性',
		icon: SexYx,
	}, {
		value: 5,
		label: '双性',
		icon: SexWn
	}, {
		value: 6,
		label: '无性',
		icon: SexNo
	}
];


class Edit extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			sex: null,
			img_url: null,
			cropper_img: null,
			files: [],
			multiple: false,
			cropperVisible: false,
		}
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'my/getUserHome',
			payload: {
				uid: UID,
				page: 1
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		this.state.sex = nextProps.user ? nextProps.user.sex : null
	}

	// 裁剪函数
	_crop() {
		//console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
		this.setState({
			cropper_img: this.refs.cropper.getCroppedCanvas().toDataURL()
		})
	}

	// 提交
	submit = () => {

		const name = document.getElementById('inputUsername').value;
		const profession = document.getElementById('inputProfession').value;
		const address = document.getElementById('inputAddress').value;
		const age = document.getElementById('inputAge').value;
		const intro = document.getElementById('inputIntroId').value;
		const sex = this.state.sex;

		Toast.loading('保存中', 5);

		this.props.dispatch({
			type: 'my/editUser', payload: {
				avatar: this.state.img_url,
				uname: name,
				sex: sex,
				location: address,
				job: profession,
				age: age,
				intro: intro,
			}
		})
	}

	// 选择图片
	onUpdateImg = () => {
		document.getElementById('fileId').click();
	}

	// 上传图片
	fileChange = (v) => {

		const that = this;
		let file = document.getElementById('fileId').files[0];

		//用size属性判断文件大小不能超过5M ，前端直接判断的好处，免去服务器的压力。
		if (file.size > 5 * 1024 * 1024) {
			Toast.info('图片过大');
			return;
		}

		var reader = new FileReader();
		reader.onload = function () {
			// 通过 reader.result 来访问生成的 base64 DataURL
			var base64 = reader.result;
			that.setState({
				img_url: base64,
				cropperVisible: true
			})

			//上传图片
			//base64_uploading(base64);
		}

		reader.readAsDataURL(file);
	}

	// 裁剪图片
	handleCropperImg = () => {
		this.setState({
			cropperVisible: false,
			img_url: this.state.cropper_img
		});

	}

	// 选择性别
	onSelectSex = (val) => {
		this.setState({ sex: val });
	}


	render() {

		const { files } = this.state;


		let _user = {
			...this.props.user
		}

		return (
			<div className={styles.editWrap}>
				<NavBarPage iconType="back" isFly='false' title="编辑个人信息" isFixed="true"/>


				<div className={styles.head}>
					<div className={styles.img}>
						<img src={this.state.img_url == null ? (_user.avatar || Util.defaultImg) : this.state.img_url} onClick={this.onUpdateImg} />
					</div>
					<InputItem type="file" id="fileId" onChange={this.fileChange.bind(this)} />
				</div>


				<List>
					<InputItem
						id="inputUsername"
						clear
						defaultValue={_user.uname}
						placeholder="名称">
						<i className={styles.iconfont}>&#xe80d;</i>
					</InputItem>
					<InputItem
						id="inputAddress"
						clear
						defaultValue={_user.location}
						placeholder="地域">
						<i className={styles.iconfont}>&#xe806;</i>
					</InputItem>
					<InputItem
						id="inputProfession"
						clear
						defaultValue={_user.job}
						placeholder="职业习惯影响梦境">
						<i className={styles.iconfont}>&#xe805;</i>
					</InputItem>
					<InputItem
						type="number"
						maxLength={2}
						id="inputAge"
						clear
						defaultValue={parseInt(_user.age || 0)}
						placeholder="剩下多少生命">
						<i className={styles.iconfont}>&#xf252;</i>
					</InputItem>
				</List>

				<List renderHeader={() => '状态'}>
					{sexs.map(i => (
						<RadioItem
							key={i.value}
							checked={this.state.sex === i.value}
							onChange={() => this.onSelectSex(i.value)}>
							<img src={i.icon} style={{ marginRight: 10 }} />
							{i.label}
						</RadioItem>
					))}
				</List>

				<List renderHeader={() => ''}>
					<TextareaItem
						defaultValue={_user.intro}
						id="inputIntroId"
						rows={4}
						placeholder="你怎么看待梦境?"
						style={{ fontSize: 16, }}
					/>
				</List>

				{
					this.state.cropperVisible ?
						<div className={styles.cropperImg}>
							<div>
								<Cropper
									ref='cropper'
									src={this.state.img_url}
									className={styles.cropper}
									aspectRatio={10 / 10}
									guides={false}
									crop={this._crop.bind(this)}
								/>
								<Button type="primary" onClick={this.handleCropperImg} style={{ margin: '20px' }}>裁剪</Button>
							</div>

						</div> : null
				}


				<Button
					onClick={this.submit.bind(this)}
					type="primary"
					style={{
						margin: 20
					}}>保存</Button>
			</div>
		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my
	};
}

const form = createForm()(Edit)
export default connect(mapStateToProps)(form);
