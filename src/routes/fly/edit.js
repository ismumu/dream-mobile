import React from "react";
import { connect } from "dva";
import { List, TextareaItem, NavBar, Icon, Button, Toast, ImagePicker, Tag, Modal } from "antd-mobile";
import styles from "./index.less";
import { createForm } from 'rc-form';
import TagModel from "./Model";

import { browserHistory } from 'react-router';

class FlyEdit extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			editDetail: '', // 详情信息

			files: [],
			selectTags: [],
		};
	}


	componentWillMount() {
		const id = this.props.params.id;
		this.props.dispatch({
			type: 'fly/editDetail',
			payload: {
				feed_id: id,
				page: 1
			},
			callback: (editDetail) => {
				let _array = [];

				editDetail.data.info.imgInfo.map((url) => {
					_array.push({
						url: url,
					})
				})
				this.setState({
					editDetail: editDetail,
					files: _array,
					selectTags: editDetail.data.info.tags,
				})
			}
		});

	}

	// 发梦
	handlePublish = () => {

		const id = this.props.params.id;

		let titleDom =  document.getElementById("titleId");
		let contentDom =  document.getElementById("txtId");

		const title = titleDom.value;
		const content = contentDom.value;

		if ( !title ) {
			Toast.info('题梦：简明扼要', 1);
		} else if ( !content ) {
			Toast.info('梦境内容：详细情景', 1);
		}
		else {



			let _array = [];
			this.state.files.map((obj) => {
				_array.push(obj.url);
			})

			let imgStr = _array.join(',');
			let tagStr = this.state.selectTags.join(' ');

			this.props.dispatch({
				type: 'fly/updateDream', payload: {
					'title': title,
					'content': content,
					'feed_id': id,
					'img_url': imgStr,
					'tags': tagStr
				},
				callback: () => {

					titleDom.value = '';
					contentDom.value = '';
					Toast.success("更新成功!", 1);

					history.go(-1);

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
				type: 'fly/uploadImgEdit',
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

			let { files } = this.state;
			files.splice(index, 1);

			_this.setState({
				files: files,
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

		let tags = this.state.selectTags;

		tags.splice(index, 1);

		this.setState({
			selectTags: tags,
		})
	}


	render() {

		const { getFieldProps } = this.props.form;
		const { files, selectTags } = this.state;

		let { info = {} } = this.state.editDetail && this.state.editDetail.data;

		return (
			<div className={styles.flyWrap}>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => history.back()}
					style={{ borderBottom: "1px solid #eee" }}
				>iDream</NavBar>
				<div>
				<div>
					<TextareaItem
						{...getFieldProps('note0', { initialValue: info.title })}
						placeholder="题梦"
						data-seed="logId"
						id="titleId"
						autoHeight
						className={styles.title}
						ref={el => this.customFocusInst = el}
					/>
					<TextareaItem
						{...getFieldProps('note1', { initialValue: info.content })}
						rows={10}
						id="txtId"
						className={styles.textarea}
						placeholder="梦境内容"

					/>
					<ImagePicker
						files={files}
						onChange={this.onChange}
						// onImageClick={(index, fs) => console.log(index, fs)}
						selectable={files.length < 3}
						multiple={true}
					/>

					<TagModel
						selectTags={selectTags}
						onAddTag={this.onAddTag}
						onClose={this.onClose}
					/>
					<Button icon={<span className={styles.icon}></span>} type="primary" onClick={this.handlePublish} className={styles.flyUpdateBtn}>更新</Button>
				</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		...state.fly
	};
}

const form = createForm()(FlyEdit)
export default connect(mapStateToProps)(form);
