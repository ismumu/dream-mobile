import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView, ActionSheet, Toast } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import Storage from '../../utils/storage';
import styles from "./userinfo.less";
import Util from "../../utils/util";
import NavBarPage from "../../components/NavBar"
import UserInfoNotLogin from "./userinfoOther-not-login"
import ListPage from '../../components/List'

import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';

// 登录id
const UID = Storage.get('uid');


class Userinfo extends React.Component {
	constructor(props, context) {
		super(props, context);

		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			dataSource,
			list: [],
			isLoading: true,
			height: document.body.clientHeight * 3 / 4,
			currentPage: 1,
			hasMore: true,

			// 用户信息
			userinfo: '',

			// ImageView
			showViewer: false,
			imagelist: null,
			imagelistCurrent: 0,

		};

	}

	componentDidMount() {

		const uid = this.props.location.state;

		// 登录状态，并且有要查看的人的id
		if (uid && UID) {
			// 如果是自己
			if (uid == UID) {
				// browserHistory.push('my/userinfo');
			} else {
				this.props.dispatch({
					type: 'my/getOtherInfo',
					payload: {
						uid: uid,
						page: 1
					},
					callback: (d) => {
						this.setData(d);
					}
				});
			}

		}
	}

	// 处理搜索数据
	setData = (data) => {

		const hei = document.body.clientHeight;

		// 不足10条，最后一页
		if (data.data.feed.length < 15) {
			this.setState({
				hasMore: false
			})
		}


		let { list } = this.state;

		let _list = list.concat(data.data.feed);

		this.setState({
			list: _list,
			dataSource: this.state.dataSource.cloneWithRows(_list),
			isLoading: false,
			height: hei,
			userinfo: data.data.user,
		});

	}

	// 拉到底部刷新
	onEndReached = (event) => {

		let { isLoading, hasMore, currentPage } = this.state;

		if ( isLoading) {
			return;
		}

		if ( !hasMore ) {
			return;
		}

		this.setState({
			isLoading: true,
			currentPage: currentPage + 1,
		});

		this.props.dispatch({
			type: 'my/getOtherInfo',
			payload: {
				uid: this.props.location.state,
				page: currentPage + 1,
			},
			callback: (d) => {
				this.setData(d);
			}
		});
	}

	// 拉黑
	addBlackList = (isBlack) => {

		let BUTTONS = ['添加黑名单'];

		if (isBlack == true) {
			BUTTONS = ['解除黑名单'];
		}

		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS,
			maskClosable: true,
		},
			(buttonIndex) => {
				// 拉黑 or 解除 点击事件
				if (buttonIndex === 0) {
					this.props.dispatch({
						type: isBlack ? 'my/delBlack2' : 'my/setBlack',
						payload: {
							black_uid: this.props.location.state
						}
					});
				}
			});
	}

	// 性别识别
	sexsRender = (sex) => {

		switch (parseInt(sex)) {
			case 0:
				return "男";
			case 1:
				return "女";
			case 2:
				return "男男";
			case 3:
				return "女女";
			case 4:
				return "异性";
			case 5:
				return "双性";
			case 6:
				return "无性";
		}
	}


	componentWillUnmount () {
		ActionSheet.close()
	}


	// imageView
	imageViewClick = (data) => {
		this.setState({
			showViewer: data.showViewer,
			imagelist: data.imagelist,
			imagelistCurrent: data.imagelistCurrent,
		})
	}
	closeImageView = () => {
		this.setState({
			showViewer: false,
		})
	}

	render() {

		let _otherInfo = {
			...this.state.userinfo,
		}

		const tabs = [
			{
				title: <b className={styles.colorBlack}> {_otherInfo.uname}的梦</b>
			}
		];



		return (
			<div>
				{
					UID ?
						<div className={styles.userinfoWrap}>
							<NavBarPage iconType="back" isFly='false' isFixed="true" isOther="true" title={_otherInfo.uname} addBlackList={this.addBlackList.bind(this, _otherInfo.is_black || null)} />
							<div className={styles.userinfo}>
								<div>
									<div className={styles.title}>
										<div className={styles.img}>
											<img src={_otherInfo.avatar || Util.defaultImg} alt={_otherInfo.uname} />
										</div>
										<div>
											<b>{_otherInfo.uname}</b>
										</div>
									</div>
									<div className={styles.opinion}>{_otherInfo.intro}</div>
									<ul>
										<li><i className={styles.iconfont}>&#xf226;</i><span>{this.sexsRender(_otherInfo.sex)}</span></li>
										<li><i className={styles.iconfont}>&#xe80c;</i><span>{_otherInfo.location}</span></li>
										<li><i className={styles.iconfont}>&#xe807;</i><span>{_otherInfo.job}</span></li>
										<li><i className={styles.iconfont}>&#xe813;</i><span>{_otherInfo.age}</span></li>
									</ul>
								</div>
							</div>
							<div className={styles.dreamWrap}>
								<Tabs
									tabs={tabs}
									swipeable={false}
								>
									<ListPage
										dataSource={this.state.dataSource}
										isLoading={this.state.isLoading}
										onEndReached={this.onEndReached}
										isUseBodyScroll={true}
										imageView={this.imageViewClick}
									/>
								</Tabs>
							</div>
						</div>
						:
						<UserInfoNotLogin uid={this.props.location.state} />
				}

				{
					this.state.showViewer &&
					<ImageView
						imagelist={this.state.imagelist}
						current={this.state.imagelistCurrent}
						close={this.closeImageView}
					/>
				}

			</div>

		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my
	};
}

export default connect(mapStateToProps)(Userinfo);
