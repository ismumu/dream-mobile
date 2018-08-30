import React from "react";
import { connect } from "dva";
import {
	List,
	TextareaItem,
	NavBar,
	Icon,
	Button,
	Toast,
	ImagePicker,
	Tag,
	Modal,
	InputItem,
} from "antd-mobile";
import styles from "./index.less";
import { createForm } from 'rc-form';
import Storage from '../../utils/storage'
import TagModel from "./Model";


// 富文本编辑器
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'


import { browserHistory } from 'react-router';


class Fly extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			files: [],
			selectTags: [],

			defaultTitle: '',
			editorContent: '',
		};
	}

	// 发布
	handlePublish = () => {

		let titleDom = document.getElementById("titleId");

		let { editorContent } = this.state;


		const title = titleDom.value;


		if (title == "") {
			Toast.info('题梦：简明扼要', 1);
		} else if (editorContent == "") {
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
				type: 'fly/publishDream',
				payload: {
					'title': title,
					'content': editorContent,
					'img_url': imgStr,
					'tags': tagStr
				},
				callback: () => {

					Storage.remove('title');
					Storage.remove('content');
					Storage.remove('files');
					Storage.remove('tags');

					this.setState({
						files: [],
						selectTags: [],

						defaultTitle: '',
						editorContent: '',
					});

					Toast.success("发布成功", 1);
					browserHistory.push('/');

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

		let { defaultTitle, editorContent, files, selectTags } = this.state;
		let timer = 1000 * 60 * 60 * 24; // 存储时间，24小时


		if (defaultTitle) {
			Storage.set('title', defaultTitle, timer)
		}
		if (editorContent) {
			Storage.set('content', editorContent, timer)
		}
		if (files && files.length > 0) {
			Storage.set('files', JSON.stringify(files), timer)
		}
		if (selectTags && selectTags.length > 0) {
			Storage.set('tags', JSON.stringify(selectTags), timer)
		}
	}

	// 获取缓存的数据
	autoSaveGet = () => {

		const title = Storage.get('title'),
			content = Storage.get('content'),
			files = Storage.get('files'),
			tags = Storage.get('tags');

		if (title) {
			this.setState({
				defaultTitle: title,
			})

		}
		if (content) {
			this.setState({
				editorContent: content,
			})
			// 回填值
			this.editorInstance.setContent(content, 'html');
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

		this.props.dispatch({
			type: 'fly/getTags',
			payload: {
				uid: Storage.get('uid'),
			},
		})

		// 获取未发布的信息
		this.autoSaveGet()

		// 每隔50秒自动保存一次
		setInterval(() => {
			this.autoSaveSet();
		}, 1000 * 50);

	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.images.length > 0) {

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


		const { files, selectTags, defaultTitle } = this.state;

		return (
			<div className={styles.flyWrap}>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => history.back()}
					rightContent={[
						<i key="icon" className='icon-paper-plane icon-idream-small icon-idream-black' onClick={this.handlePublish} ></i>
					]}
					style={{ borderBottom: "0px solid #eee" }}
				>iDream</NavBar>

				<InputItem
					placeholder="题梦"
					id="titleId"
					value={defaultTitle}
					autoHeight
					className={styles.title}
					onChange={(value) => {
						this.setState({
							defaultTitle: value,
						})
					}}
				/>


				<div className={styles.textarea}>
					<BraftEditor
						ref={instance => this.editorInstance = instance}
						controls={[]}
						height='300'
						contentFormat='html'
						placeholder="梦境内容"
						pasteMode="text" // 指定粘贴模式，如果为text，则粘贴的时候会过滤掉HTML格式，默认为空
						onChange={(html) => {
							this.setState({
								editorContent: html,
							})
						}}
					/>
				</div>


				<ImagePicker
					files={files}
					onChange={this.onChange}
					// onImageClick={(index, fs) => console.log(index, fs)}
					selectable={files.length < 3}
					multiple={false}
				/>

				<TagModel
					selectTags={selectTags}
					onAddTag={this.onAddTag}
					onClose={this.onClose}
				/>

				<p ref="tipMsg" className={styles.autoSaveMsg}>
					系统每50秒自动保存 <br />
					可用3幅插画展现你梦境 <br />
					插图审核后呈上（感谢你支持过虑不良图片）
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
