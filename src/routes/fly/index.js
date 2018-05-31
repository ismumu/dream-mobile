import React from "react";
import { connect } from "dva";
import { List, TextareaItem, NavBar, Icon, Button, Toast, ImagePicker, Tag, Modal } from "antd-mobile";
import styles from "./index.less";
import { createForm } from 'rc-form';
import Storage from '../../utils/storage'
import TagModel from "./Model";

import { browserHistory } from 'react-router';

class Fly extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			files: [],
			selectTags: [],
		};
	}

	// 发布
	handlePublish = () => {

		let titleDom =  document.getElementById("titleId");
		let contentDom =  document.getElementById("txtId");


		const title = titleDom.value;
		const content = contentDom.value;


		if (title == "") {
			Toast.info('请先填写标题', 1);
		} else if (content == "") {
			Toast.info('请多少输入一点吧~~', 1);
		}
		else {

			let _array = [];
			this.state.files.map((obj) => {
				_array.push(obj.url);
			})

			let imgStr = _array.join(',');
			let tagStr = this.state.selectTags.join(' ');

			this.props.dispatch({
				type: 'fly/publishDream',
				payload: {
					'title': title,
					'content': content,
					'img_url': imgStr,
					'tags': tagStr
				},
				callback: () => {
					Toast.success("发送成功!", 1);
					browserHistory.push('/');

					Storage.remove('title');
					Storage.remove('content');
					Storage.remove('files');
					Storage.remove('tags');

					this.setState({
						files: [],
					});

					titleDom.value = '';
					contentDom.value = '';

				}
			})



		}
	}

	// 选择图片
	onChange = (files, type, index) => {

		let _this = this;

		if (type == "add") {

			const len = files.length - 1;

			_this.props.dispatch({
				type: 'fly/uploadImg',
				payload: {
					img: files[len].url
				},
				callback: (data) => {

					let _files = _this.state.files;

					_files.push({
						url: data.data.url,
					})

					_this.setState({
						files: _files,
					});

				}
			});
		} else if (type == "remove") {

			let { files } = _this.state;
			files.splice(index, 1);

			_this.setState({
				files: files,
			});
		}
	}

	// 自动缓存到本地
	autoSaveSet = () => {

		const title = document.getElementById("titleId") ? document.getElementById("titleId").value : '',
			content = document.getElementById("txtId") ? document.getElementById("txtId").value : '',
			files = this.state.files,
			tags = this.state.selectTags,
			timer = 1000 * 60 * 60 * 24;// 存储时间，24小时

		if (title !== "") {
			Storage.set('title', title, timer)
		}
		if (content !== "") {
			Storage.set('content', content, timer)
		}
		if (files && files.length > 0) {
			Storage.set('files', JSON.stringify(files), timer)
		}
		if (tags && tags.length > 0) {
			Storage.set('tags', JSON.stringify(tags), timer)
		}
	}

	// 获取缓存的数据
	autoSaveGet = () => {

		const title = Storage.get('title'),
			content = Storage.get('content'),
			files = Storage.get('files'),
			tags = Storage.get('tags');

		if (title) {
			document.getElementById("titleId").value = title;
		}
		if (content) {
			document.getElementById("txtId").value = content;
		}
		if (files) {
			this.setState({
				files: JSON.parse(files),
			});
		}
		if (tags) {
			this.setState({
				selectTags: JSON.parse(tags)
			});
		}
	}

	componentDidMount() {

		// 获取未发布的信息
		this.autoSaveGet()

		// 每隔50秒自动保存一次
		setInterval(() => {
			this.autoSaveSet();
		}, 1000 * 50);
	}

	componentWillReceiveProps(nextProps) {

		if ( nextProps.images.length > 0 ) {

			let _files = this.state.files;

			_files.push({
				url: nextProps.images[0]
			})

			this.setState({
				files: _files,
			});
		}
	}

	onAddTag = (val) => {
		let tags = this.state.selectTags;

		tags.push(val);

		this.setState({
			selectTags: tags,
		})
	}
	onClose = (index) => {
		let tags = this.state.selectTags

		tags.splice(index, 1);

		this.setState({
			selectTags: tags,
		})
	}

	render() {

		const { getFieldProps } = this.props.form;
		const { files, selectTags } = this.state;

		return (
			<div className={styles.flyWrap}>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => history.back()}
					rightContent={[
						<i key="icon" className={styles.iconfontBlack} onClick={this.handlePublish} >&#xf1d8;</i>
					]}
					style={{ borderBottom: "1px solid #eee" }}
				>
				iDream
        		</NavBar>

				<TextareaItem
					placeholder="梦境标题"
					data-seed="logId"
					id="titleId"
					autoHeight
					className={styles.title}
					ref={el => this.customFocusInst = el}
				/>

				<TextareaItem
					rows={10}
					id="txtId"
					className={styles.textarea}
					placeholder="真诚面对梦境，记下吧~~"
					ref={el => this.customFocusInst = el}
				/>

				<ImagePicker
					files={files}
					onChange={this.onChange}
					// onImageClick={(index, fs) => console.log(index, fs)}
					selectable={files.length < 3}
					multiple={1}
				/>

				<TagModel
					selectTags={selectTags}
					onAddTag={this.onAddTag}
					onClose={this.onClose}
				/>

				<p className={styles.autoSaveMsg}>
					系统每50秒自动保存一次 <br />
					可用3张图片展示你的梦境内容 <br />
					图片通过审核后呈上（感谢你支持过虑不良相关图片）
				</p>

			</div>
		)
	}
}


/**
 * 数组操作：获取元素下标
 * @param  {[type]} val [元素]
 * @return {[type]}     [description]
 */
Array.prototype.indexOf = function (val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};


function mapStateToProps(state) {
	return {
		...state.fly
	};
}


const form = createForm()(Fly)
export default connect(mapStateToProps)(form);
