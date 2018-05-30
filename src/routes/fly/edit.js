import React from "react";
import { connect } from "dva";
import { List, TextareaItem, NavBar, Icon, Button, Toast, ImagePicker, Tag, Modal } from "antd-mobile";
import styles from "./index.less";
import { createForm } from 'rc-form';
import TagModel from "./Model";

class FlyEdit extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
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
			}
		});

	}

	componentWillReceiveProps(props) {

		if (props.images) {
			this.setState({
				files: props.imagesEdit,
				selectTags: props.tagsEdit
			})
		}
	}


	// 发梦
	handlePublish = () => {

		const id = this.props.params.id;
		const title = document.getElementById("titleId").value;
		const content = document.getElementById("txtId").value;
		const feeling = this.state.feeling;

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
				type: 'fly/updateDream', payload: {
					'title': title,
					'content': content,
					'feed_id': id,
					'feeling': null,
					'img_url': imgStr,
					'tags': tagStr
				}
			})
		}
	}

	// 选择图片
	onChange = (files, type, index) => {

		this.setState({
			files,
		});

		if (type == "add") {
			const len = files.length - 1;
			this.props.dispatch({
				type: 'fly/uploadImgEdit',
				payload: {
					img: files[len].url
				}
			});
		} else if (type == "remove") {
			this.props.dispatch({
				type: 'fly/removeImagesEdit',
				payload: {
					index: index
				}
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

		return (
			<div className={styles.flyWrap}>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => history.back()}
					style={{ borderBottom: "1px solid #eee" }}
				>iDream</NavBar>
				<div>
					{
						this.props.editDetail ?
							<div>
								<TextareaItem
									{...getFieldProps('note0', { initialValue: this.props.editDetail.title })}
									placeholder="梦境标题"
									data-seed="logId"
									id="titleId"
									autoHeight
									className={styles.title}
									ref={el => this.customFocusInst = el}
								/>
								<TextareaItem
									{...getFieldProps('note1', { initialValue: this.props.editDetail.content })}
									rows={10}
									id="txtId"
									className={styles.textarea}
									placeholder="真诚面对梦境，记下吧~~"

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
							: null
					}
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
