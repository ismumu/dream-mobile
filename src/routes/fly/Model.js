import React from "react";
import { connect } from "dva";
import {
	Modal,
	Tag,
	TextareaItem,
	Toast,
	InputItem,
} from "antd-mobile";

import styles from "./index.less";



function closest(el, selector) {
	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
	while (el) {
		if (matchesSelector.call(el, selector)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}




class TagModel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal1: false,

			tagVal: '',

			isShowErrorTip: false,
			errorTipText: '',
		};
	}


	onWrapTouchStart = (e) => {
		// fix touch to scroll background page on iOS
		if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
			return;
		}
		const pNode = closest(e.target, '.am-modal-content');
		if (!pNode) {
			e.preventDefault();
		}
	}


	showModal = key => (e) => {
		// 修复 Android 上点击穿透
		e.preventDefault();


		const { selectTags } = this.props;

		if ( selectTags.length >= 7 ) {
			Toast.info('最多只能添加7个标签', 1);
			return false;
		}

		this.setState({
			[key]: true,
		});

	}

	// 中文算2个长度，数字 英文算1个长度
	checkStringLength = ( str ) => {
		var len = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			//单字节加1
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				len++;
			}
			else {
				len += 2;
			}
		}
		return len;
	}

	// 添加标签
	onAddTags = (event) => {

		const { selectTags } = this.props;

		let { tagVal, isShowErrorTip } = this.state;

		if ( isShowErrorTip ) {
			return ;
		}


		if (!selectTags.includes(tagVal) && tagVal) {
			this.props.onAddTag(tagVal);
		}

		this.setState({
			modal1: false,
		});

	}



	tagsOnClose = (index) => {
		this.props.onClose(index);
	}


	render() {

		const { selectTags } = this.props;

		let { isShowErrorTip, errorTipText } = this.state;

		return (
			<div>
				<p
					className={styles.tagWrap}
					onClick={this.showModal('modal1')}
				>
					<span className={styles.tagBtn}><i className='icon-tag icon-idream-small'></i> </span>
					<span className={styles.tagTip}>自定义标签(最多7个标签，每个标签最多7个中文字)</span>
				</p>


				<div style={{ margin: '10px 0 0 10px' }}>
					{
						selectTags.map((item, index) => {
							return <Tag closable key={Date.now() + index} style={{ marginRight: 5, marginBottom: 5 }} onClose={this.tagsOnClose.bind(this, index)}>{item}</Tag>
						})
					}
				</div>

				<Modal
					visible={this.state.modal1}
					transparent
					maskClosable={false}
					onClose={() => {
						this.setState({
							modal1: false,
							tagVal: '',

							isShowErrorTip: false,
							errorTipText: '',
						})
					}}
					footer={
						[
							{
								text: '取消',
								onPress: () => {
									this.setState({
										modal1: false,
										tagVal: '',
										isShowErrorTip: false,
										errorTipText: '',
									})
								}
							},
							{
								text: '确定',
								onPress: this.onAddTags
							},
						]
					}
					wrapProps={{ onTouchStart: this.onWrapTouchStart }}
				>

					<InputItem
						className={styles.tagInput}
						type="text"
						placeholder="输入标签"
						onChange={(value) => {

							if ( !/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(value) ) {
								this.setState({
									isShowErrorTip: true,
									errorTipText: '只能输入中文英文和数字',
								});

							} else {
								if ( this.checkStringLength( value ) <= 14 ) {
									// 验证成功
									this.setState({
										tagVal: value,
										isShowErrorTip: false,
										errorTipText: '',
									})

								} else {
									this.setState({
										isShowErrorTip: true,
										errorTipText: '最多只能输入7个中文',
									});
								}
							}
						}}
					/>
					{ isShowErrorTip && <div className={styles.errorTip}>{errorTipText}</div> }
				</Modal>
			</div>
		)
	}
}


/**
 * 数组操作：判断元素是否在素组里面
 * @param  {[type]} val [元素1]
 * @return {[type]}     [description]
 */
Array.prototype.contains = function (val) {
	var len = this.length;
	while (len--) {
		if (this[len] === val) {
			return true;
		}
	}
	return false;
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


/**
 * 数组操作：删除元素
 * @param  {[type]} val [元素]
 * @return {[type]}     [description]
 */
Array.prototype.remove = function (val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

export default TagModel;
