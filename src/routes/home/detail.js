import React from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import { browserHistory } from 'react-router';
import {
	NavBar,
	TextareaItem,
	Icon,
	Button,
	Toast,
	Modal,
	ActionSheet,
	InputItem,
} from "antd-mobile";
import { createForm } from 'rc-form';
import Clipboard from 'react-clipboard.js';

import styles from "./detail.less";
import Util from "../../utils/util";
import Storage from '../../utils/storage';
import NavBarPage from "../../components/NavBar"
import DetailNotLogin from "./detail-not-login"


import { initList } from "../../utils/topic";

import defaultAvatar from '../../assets/images/avatar.png';


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
	wrapProps = {
		onTouchStart: e => e.preventDefault(),
	};
}

const UID = Storage.get('uid');

class Detail extends React.Component {
	constructor(props, context) {

		super(props, context);

		this.state = {

			placeholder: '回复原文',
			review_id: 0,

			delReviewState: 'none',
			editDreamState: 'none',

			shareModal: false,

			// 回复
			isShowReviewModal: false,
			reviewTextAreaVal: '',

			isShowErrorTip: false,
			errorTipText: '',
		};

	}

	componentWillMount() {

		let _this = this;
		this.inputFocus = false;

		const query = this.props.location.query;
		if (query) {
			this.props.dispatch({
				type: 'home/getDetail',
				payload: {
					feed_id: query.id,
					page: 1
				}
			});
		}
	}


	// 回复输入框
	showModal = (name, review_id) => (e) => {

		e.preventDefault(); // 修复 Android 上点击穿透

		// 点击到了话题先跳转去话题，不弹评论
		let dom = e.target;
		let _class = dom.getAttribute('class');
		if ( _class && !_class.includes('J-topic') ) {
			this.setState({
				isShowReviewModal: true,
				review_id: review_id ? review_id : 0,
				placeholder: name ? '回复 @' + name : '回复原文',
			},() => {
				this.autoFocusInst.focus();
			});
		}
	}

	// 回复
	onReview = () => {

		let { reviewTextAreaVal, isShowErrorTip } = this.state;

		if ( isShowErrorTip || !reviewTextAreaVal ) {
			return ;
		}

		const { id } = this.props.location.query; //this.props.location.state;

		this.props.dispatch({
			type: 'home/review',
			payload: {
				feed_id: id,
				content: reviewTextAreaVal,
				review_id: this.state.review_id,
			},
			callback: (d) => {

				if ( d == 'success' ) {
					this.setState({
						placeholder: '回复原文',
						review_id: 0,
						isShowReviewModal: false,
						reviewTextAreaVal: '',

						isShowErrorTip: false,
						errorTipText: '',
					});
				} else {
					this.setState({
						isShowErrorTip: true,
						errorTipText: d,
					});
				}
			}
		});

	}

	// 点赞
	handleUpdatedigg = () => {
		const { id } = this.props.location.query;
		this.props.dispatch({
			type: 'home/updatedigg',
			payload: {
				feed_id: id,
			}
		});
	}



	// 二级评论操作
	delReview = (feedId, reviewId) => {
		const BUTTONS = ['删除', '取消'];
		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS,
			cancelButtonIndex: BUTTONS.length - 1,
			destructiveButtonIndex: BUTTONS.length - 2,
			message: null,
			maskClosable: true,
			//wrapProps,
		},
			(buttonIndex) => {
				// 删除
				if (buttonIndex === 0) {
					this.props.dispatch({
						type: 'home/delDreamReview',
						payload: {
							feed_id: feedId,
							review_id: reviewId
						}
					})
				}
			});
	}

	// 梦境编辑、设置
	editDream = () => {
		// show_type：1（公开），2（私密）
		let { show_type } = this.props.detail.info;
		show_type = parseInt(show_type);

		const BUTTONS2 = ['编辑',
			show_type == 1 ? '设为私密' : '设为公开',
			'删除'];

		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS2,
			cancelButtonIndex: -1,
			destructiveButtonIndex: 2,
			message: null,
			maskClosable: true,
			//wrapProps,
		},
			(buttonIndex) => {
				this.setState({ editDreamState: BUTTONS2[buttonIndex] });
				//const feed_id = this.props.location.state;
				const { id } = this.props.location.query;

				// 编辑
				if (buttonIndex === 0) {
					// 跳转到编辑
					browserHistory.push('/fly/edit/' + id);
				}
				else if (buttonIndex === 2) {
					// 删除
					this.props.dispatch({
						type: 'home/delDream',
						payload: {
							feed_id: id,
						}
					});
				}
				else if (buttonIndex === 1) {
					// 设为私密
					this.props.dispatch({
						type: 'home/setSecret',
						payload: {
							show_type: show_type == 1 ? 2 : 1,
							feed_id: id,
						}
					});
				}
			});
	}

	// 梦境收藏
	collectShow = () => {

		const query = this.props.location.query;

		this.props.dispatch({
			type: 'home/colletDream',
			payload: {
				feed_id: query.id
			}
		});

		this.setState({
			shareModal: false
		})

	}

	// 分享
	onShowShareModal = () => {

		this.setState({ shareModal: true })

		setTimeout(() => {
			let shareUrl = window.location.href;
			// 分享配置
			window.socialShare('#socialShare', {
				// 这里配置各种参数
				sites: ['weibo', 'douban', 'qq'],
				mode: 'prepend',
				description: 'iDream',
				url: shareUrl,
				title: `【${this.props.detail.info.title}】${shareUrl}（食梦者iDream）`,
				wechatQrcodeTitle: "微信扫一扫分享",
				wechatQrcodeHelper: '',//'<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
			});
		}, 100);


	}

	// 复制
	onSuccess = () => {
		this.setState({ shareModal: false })
		Toast.success('复制成功！', 1);
	}

	handleCloseShareModal = () => {
		this.setState({ shareModal: false })
	}


	componentDidMount () {
		// 采用browserHistory跳转链接
		document.onclick = function (e) {
			let dom = e.target;
			let _class = dom.getAttribute('class');
			if ( _class && _class.includes('J-topic') ) {
				browserHistory.push(dom.getAttribute('to'));
			}

		}
	}


	render() {

		let { isShowErrorTip, errorTipText } = this.state;
		let { info, review } = this.props.detail || {};



		let _info = {}, _review = [];

		// 话题相关
		if ( info ) {
			_info = {
				...initList([info])[0],
			}
		}
		if ( review ) {
			_review = initList(review);

			// 遍历二级评论
			if ( _review.length > 0 ) {
				_review.map((d) => {
					d.reply = initList(d.reply)
				})
			}

		}


		return (
			<div>
				{
					UID ?
						// 已登录
						<div className={styles.detailWrap}>
							<NavBarPage iconType="back" isFixed="true" title="梦境" />
							{
								this.props.detail && !this.props.detailLoading
									?
									<div>
										<div className={styles.item}>
											<div className={styles.head}>
												<div className={styles.img}>
													<Link to={{ pathname: _info.uid == UID ? "/my/userinfo" : "/my/other", 'state': + _info.uid }}>
														<img src={_info.avatar
															? _info.avatar
															: defaultAvatar} alt={_info.uname} />
													</Link>
												</div>
												<span className={styles.name}>
													<Link className={styles.bold} to={{ pathname: _info.uid == UID ? "/my/userinfo" : "/my/other", 'state': + _info.uid }}>{_info.uname}</Link>
													{
														// 是登录账户的梦境时才能删除跟编辑
														_info.uid == UID ?
															<Icon className={styles.fr} type="ellipsis" size="xxs" onClick={this.editDream} />
															: <span></span>
													}
													{
														// 是否隐私
														_info.uid == UID && _info.show_type == '2' ?
															<i className='icon-eye-off icon-idream-small'></i>
															: <span></span>
													}
												</span>
												<span className={styles.time}>{_info.publish_time}</span>
											</div>
											<div className={styles.itemContent}>
												<h1 className={styles.title}>{_info.title}</h1>
												<div className={styles.des} dangerouslySetInnerHTML={{
													__html: _info.content
												}}></div>
												<div className={styles.imgs}>
													{
														_info.imgInfo && _info.imgInfo.map((img, index) => (
															<img src={img} key={index} alt="" />
														))
													}
												</div>
											</div>

											<div className={styles.icons}>
												<span className={styles.praise} onClick={this.handleUpdatedigg}>
													{
														_info.hasDigg == 1
														?
														<i className='icon-heart icon-idream-small icon-idream-blue'></i>
														:
														<i className='icon-heart icon-idream-small'></i>
													}
													<label>{_info.digg_count > 0 ? _info.digg_count : null}</label>
												</span>
												<span className={styles.review} onClick={this.showModal()}>
													<i className='icon-comment icon-idream-small'></i>
													<label>{_info.comment_all_count > 0 ? _info.comment_all_count : null}</label>
												</span>
												<span>
													<i className='icon-forward icon-idream-small' onClick={this.onShowShareModal}></i>
												</span>

											</div>


											<div className={styles.reviewList}>
												{
													_review.map((item, index) => (
														<div className={styles.reviewItem} key={index}>
															<div className={styles.head}>
																<div className={styles.img}>
																	<Link to={{ pathname: item.uid == UID ? "/my/userinfo" : "/my/other", 'state': + item.uid }}>
																		<img src={item.avatar ? item.avatar : defaultAvatar} alt={item.uname} />
																	</Link>
																</div>
															</div>
															<div className={styles.itemContent}>
																<div className={styles.cnWrap} onClick={this.showModal(item.uname, item.review_id)}>
																	<span className={styles.name}>{item.uname}</span>
																	<div className={styles.des} dangerouslySetInnerHTML={{
																		__html: item.content
																	}}></div>
																</div>
																<div className={`${styles.time} ${styles.clear}`}>
																	<span className={styles.fl}>{item.ctime}</span>

																	{
																		// 添加删除评论，只有自己或梦住才能删除
																		item.uid == UID || _info.uid == UID ?
																			<Icon className={` ${styles.more} ${styles.fl}`} type="ellipsis" size="xxs"
																				onClick={this.delReview.bind(this, _info.feed_id, item.review_id)} />
																			: null
																	}

																</div>

															</div>
															{
																// 二级评论
																item.reply.length > 0 ?
																	<div className={styles.reviewItemList}>
																		{
																			item.reply.map((item2, index2) => (
																				<div className={styles.reviewItem2} key={index + "_" + index2}>
																					<div className={styles.itemContent}>
																					<Link to={{ pathname: item.uid == UID ? "/my/userinfo" : "/my/other", 'state': + item2.uid }}>
																						<img className={styles.reviewFace} src={item2.avatar || defaultAvatar } />
																					</Link>

																						<div className={styles.des} onClick={this.showModal(item2.uname, item2.review_id)}>
																							{item2.uname}
																							{
																								item2.to_uname == item2.uname || item2.to_uname == item.uname
																								?
																								null
																								:
																								<span> | 回复@{item2.to_uname}：</span>
																							}
																							<br />
																							<div dangerouslySetInnerHTML={{
																								__html: item2.content
																							}}></div>
																						</div>
																						<div className={styles.clear}>
																							<span className={`${styles.time} ${styles.fl}`}>{item2.ctime}</span>
																							{
																								// 添加删除评论，只有自己或梦住才能删除
																								item2.uid == UID || _info.uid == UID ?
																									<Icon className={` ${styles.more} ${styles.fl}`} type="ellipsis" size="xxs"
																										onClick={this.delReview.bind(this, _info.feed_id, item2.review_id)} />
																									: null
																							}
																						</div>
																					</div>
																				</div>
																			))
																		}
																	</div>
																	: null
															}

														</div>
													))
												}
											</div>
										</div>

									</div>
									:
									this.props.detail == false ?
										<div
											style={{
												textAlign: 'center',
												marginTop: 50,
												lineHeight: '100px',
												fontSize: '12px',
												color: '#999'
											}}>
											找不到此梦境 (꒦_꒦)
                						</div>
										:
										<div className={styles.null}>
											<Icon type="loading" size='md' />
										</div>
							}

						</div>
						:
						// 未登录
						<DetailNotLogin feedId={this.props.location.query.id} />
				}

				<Modal
					popup
					visible={this.state.shareModal}
					onClose={() => {
						this.setState({
							shareModal: false
						})
					}}
					animationType="slide-up"
				>
					<div>
						<Clipboard data-clipboard-text={window.location.href} onSuccess={this.onSuccess} style={{ width: '100%', border: 0, background: 'white', padding: 0 }}>
							<Button type="default">复制链接</Button>
						</Clipboard>
						{/* <Button type="default" style={{ marginTop: -1 }} onClick={this.collectShow}>添加到收藏夹</Button> */}
						<div style={{ padding: 10 }} id="socialShare"></div>
					</div>
				</Modal>
				<Modal
					className={styles.reviewModal}
					visible={this.state.isShowReviewModal}
					transparent
					closable={true}
					maskClosable={false}
					onClose={() => {
						this.setState({
							isShowReviewModal: false,
							isShowErrorTip: false,
							errorTipText: '',
						})
					}}
					title={this.state.placeholder}
					footer={[
						{
							text: <i
								onClick={() => {

									if ( !this.state.reviewTextAreaVal ) {
										this.setState({
											isShowErrorTip: true,
											errorTipText: '回复内容',
										})

										return ;
									}

									this.onReview();

								}}
								className='icon-paper-plane icon-idream-small icon-idream-black'></i>,
						}
					]}
					wrapProps={{ onTouchStart: this.onWrapTouchStart }}
				>
					<TextareaItem
						ref={ref => this.autoFocusInst = ref}
						className={styles.modalReviewTextArea}
						autoHeight
						placeholder='内容'
						onChange={(value) => {
							if ( !value ) {
								this.setState({
									isShowErrorTip: true,
									errorTipText: '回复内容',
									reviewTextAreaVal: value,
								})
							} else {
								this.setState({
									reviewTextAreaVal: value,
									isShowErrorTip: false,
									errorTipText: '',
								})
							}
						}}
					/>
					{ isShowErrorTip && <div className={styles.errorTip}>{errorTipText}</div> }
				</Modal>


			</div>

		);
	}

}

function mapStateToProps(state) {
	return {
		...state.home
	};
}

const form = createForm()(Detail)
export default connect(mapStateToProps)(form);
