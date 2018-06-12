import React from "react";
import { connect } from "dva";
import { Link } from "dva/router"
import { ListView, Icon, NavBar, Tabs, ActionSheet, Toast, Modal, Button } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import { browserHistory } from 'react-router';
import Clipboard from 'react-clipboard.js';



import styles from "./List.less";
import Util from "../utils/util";
import Storage from '../utils/storage';


const UID = Storage.get('uid');

class List extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			height: this.props.height ? this.props.height : 1000,
			shareModal: false,
			shareId: null,
		}



	}

	// 编辑梦境
	editDream = (feedId, show_type) => {


		// show_type：1（公开），2（私密）

		let showTypeKey = 'showTypeId' + feedId;

		if ( !this[showTypeKey] ) {
			this[showTypeKey] = parseInt(show_type);
		}

		const BUTTONS2 = ['编辑',
			this[showTypeKey] == 1 ? '设为私密' : '设为公开',
			'删除'];

		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS2,
			cancelButtonIndex: - 1,
			destructiveButtonIndex: 2,
			message: null,
			maskClosable: true,
		},
			(buttonIndex) => {
				// 编辑
				if (buttonIndex === 0) {
					// 跳转到编辑
					browserHistory.push('/fly/edit/' + feedId);
				}
				else if (buttonIndex === 2) {
					// 删除
					this.props.dispatch({
						type: 'home/delDream2',
						payload: {
							feed_id: feedId,
						}
					});
				}
				else if (buttonIndex === 1) {
					// 设为私密

					let newTpye = (this[showTypeKey] == 1 ? 2 : 1);
					this[showTypeKey] = newTpye;

					this.props.dispatch({
						type: 'home/setSecretInList',
						payload: {
							show_type: newTpye,
							feed_id: feedId,
						},
						callback: () => {
							if ( this[showTypeKey] == 1 ) {
								document.getElementById('secret' + feedId).style.display = 'none';
							} else {
								document.getElementById('secret' + feedId).style.display = 'block';
							}
						}
					});
				}
			});
	}

	// 梦境收藏、分享
	collectShow = () => {

		this.props.dispatch({
			type: 'home/colletDream',
			payload: {
				feed_id: this.state.shareId
			}
		})

		this.setState({ shareModal: false })
	}

	// 分享
	onShowShareModal = (item) => {

		if (!UID) {
			Toast.info("请先登入！", 1);
			return;
		}

		const { feed_id, title, content } = item;

		this.setState({
			shareModal: true,
			shareId: feed_id
		});

		setTimeout(() => {
			// 分享配置
			window.socialShare('#socialShare', {
				sites: ['weibo', 'wechat', 'douban', 'qq'],
				mode: 'prepend',
				url: `h5.xiaoyiwo.net/#/home/detail?id=${feed_id}`,
				description: 'IDream梦食者',
				title: `【${title}】${content.substr(0, 10)}... http://${window.location.host}/#/home/detail?id=${feed_id}（来自IDream梦境网）`,
				wechatQrcodeTitle: "微信扫一扫分享",
				wechatQrcodeHelper: '',//'<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
			});
		}, 100);


	}

	// 复制
	onSuccess = () => {
		this.setState({
			shareModal: false
		})
		Toast.success('复制成功！', 1);
	}

	// 拉入黑名单后的提醒
	blackClick = () => {
		Toast.info('sorry,他设置了不开放', 1);
	}

	// 内容展开与隐藏
	handleContentSlide = (feed_id) => {

		let id = 'desShowAll' + feed_id;
		let dom = document.getElementById(id);


	// 双击
		if(Date.now() - this.time < 200) {
			dom.setAttribute('style','max-height: 40px');
		} else {
			dom.setAttribute('style','max-height: none');
		}

		this.time = Date.now();

	}

	// 点赞
	handleUpdatedigg = (id, count) => {

		count = count * 1;

		if (!UID) {
			Toast.info("请先登入！", 1);
			return;
		}

		this.props.dispatch({
			type: 'home/updateListDigg',
			payload: {
				feed_id: id,
			},
			callback: (msg) => {


				let likeIcon = document.getElementById('likeIcon' + id);
				let likeCountLabel = document.getElementById('likeCount' + id);
				let likeCountNum = document.getElementById('likeCount' + id).innerHTML || 0;


				if ( msg == '点赞成功' ) {

					let newCount = likeCountNum * 1 + 1;

					likeIcon.style.color = '#05bcff';
					if ( newCount <= 0 ) {
						likeCountLabel.innerHTML = '';
					} else {
						likeCountLabel.innerHTML = newCount;
					}

				} else {

					let newCount = likeCountNum * 1 - 1;

					likeIcon.style.color = '#afaeae';
					if ( newCount <= 0 ) {
						likeCountLabel.innerHTML = '';
					} else {
						likeCountLabel.innerHTML = newCount;
					}

				}

			}
		});

	}

	// 行
	row = (rowData, sectionID, rowID) => {

		const obj = rowData;

		let secretDom = ''
		if ( obj.uid == UID && obj.show_type == '2' ) {
			secretDom = <i id={'secret' + obj.feed_id} className={styles.iconfont} style={{ float: 'right', 'fontWeight': 'normal' }}>&#xe80b;</i>;
		} else {
			secretDom = <i id={'secret' + obj.feed_id} className={styles.iconfont} style={{ float: 'right', 'fontWeight': 'normal', display: 'none' }}>&#xe80b;</i>;
		}

		return (
			<div>
				{
					<div className={styles.item}>
						<div className={styles.head}>
							<div className={styles.img}>
								<Link to={{ pathname: obj.uid == UID ? "/my/userinfo" : "/my/other", 'state': + obj.uid }}>
									<img src={obj.avatar ? obj.avatar : Util.defaultImg} alt={obj.uname} />
								</Link>
							</div>
							<div className={styles.name}>
								{obj.uid === UID && <Icon className={styles.fr} type="ellipsis" size="xxs" onClick={this.editDream.bind(this, obj.feed_id, obj.show_type)} />}
								<Link className={styles.userName} to={{ pathname: obj.uid == UID ? "/my/userinfo" : "/my/other", 'state': + obj.uid }}>{obj.uname}</Link>
								<span className={styles.time}>{obj.publish_time}</span>
							</div>
						</div>
						<div className={styles.itemContent}>
							<div className={styles.title}>
								{ secretDom }
								<Link to={{ pathname: "/home/detail", query: { id: obj.feed_id } }}>{obj.title}</Link>
							</div>
							<div
								className={ styles.des}
								id={'desShowAll' + obj.feed_id}
								dangerouslySetInnerHTML={{
									__html: obj.content
								}}
								onClick={this.handleContentSlide.bind(this, obj.feed_id)}
							>
							</div>
							{
								obj.imgInfo && obj.imgInfo.length > 0 ?
									<div className={styles.imgs}>
										{
											obj.imgInfo.map((img, index) => (
												// 最多只显示3张图片
												index <= 2 ?
													<div className={styles.imgbox} key={index}>
														<img
															src={img}
															onClick={() => {
																this.props.imageView({
																	showViewer: true,
																	imagelist: obj.imgInfo,
																	imagelistCurrent: index
																})
															}}
														/>
													</div>
													: null
											))
										}
									</div>
									: null
							}
						</div>
						<div className={styles.icons}>
							<span className={styles.praise} onClick={this.handleUpdatedigg.bind(this, obj.feed_id, obj.digg_count)}>
								{
									obj.has_digg == 1
									?
									<i id={'likeIcon' + obj.feed_id} className={styles.iconfontSmall} style={{ color: '#05bcff' }}>&#xe808;</i>
									:
									<i id={'likeIcon' + obj.feed_id} className={styles.iconfontSmall}>&#xe808;</i>
								}
								<label id={"likeCount" + obj.feed_id}>{obj.digg_count > 0 ? obj.digg_count : null}</label>
							</span>
							<span className={styles.review}>
								<Link to={{ pathname: "/home/detail", query: { id: obj.feed_id } }}>
									<i className={styles.iconfontSmall}>&#xe810;</i>
									<label>{obj.comment_all_count > 0 ? obj.comment_all_count : null}</label>
								</Link>
							</span>

							{(this.props.isShare !== false) && <span><i className={styles.iconfontSmall} onClick={this.onShowShareModal.bind(this, obj)}>&#xe811;</i></span>}
						</div>
					</div>
				}
			</div>


		);
	};


	render() {

		const separator = (sectionID, rowID) => (
			<div
				key={`${sectionID}-${rowID}`}
				style={{
					backgroundColor: '#F5F5F9',
					height: 7,
					borderTop: '1px solid #ECECED',
					borderBottom: '1px solid #ECECED',
				}}
			/>
		);

		return (
			<div className={styles.chatWrap}>
				<ListView
					ref={el => this.lv = el}
					dataSource={this.props.dataSource}
					renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
						{this.props.isLoading ? "加载中..." : null}
					</div>)}
					renderRow={this.row}
					renderSeparator={separator}
					style={{
						height: this.props.height,
						overflow: 'auto',
					}}
					pageSize={4}
					scrollRenderAheadDistance={500}
					onEndReached={this.props.onEndReached}
					onEndReachedThreshold={10}
					useBodyScroll={this.props.isUseBodyScroll ? true : false}

				/>

				<Modal
					popup
					visible={this.state.shareModal}
					onClose={() => { this.setState({ shareModal: false }) }}
					animationType="slide-up"
				>
					<div>
						<Clipboard data-clipboard-text={window.location.origin + '/home/detail?id=' + this.state.shareId} onSuccess={this.onSuccess} style={{ width: '100%', border: 0, background: 'white', padding: 0 }}>
							<Button type="default">复制链接</Button>
						</Clipboard>
						<div style={{ padding: 10 }} id="socialShare"></div>
					</div>
				</Modal>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		...state.home
	};
}
export default connect(mapStateToProps)(List);

