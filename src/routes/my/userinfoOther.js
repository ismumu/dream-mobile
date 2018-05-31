import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView, ActionSheet } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import Storage from '../../utils/storage';
import styles from "./userinfo.less";
import Util from "../../utils/util";
import NavBarPage from "../../components/NavBar"
import UserInfoNotLogin from "./userinfoOther-not-login"
import ListPage from '../../components/List'

// 登陆id
const UID = Storage.get('uid');

function renderTabBar(props) {
	return (
		<Sticky>
			{({ style }) => <div
				style={{
					...style,
					zIndex: 1
				}}><Tabs.DefaultTabBar {...props} /></div>}
		</Sticky>
	);
}


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

		};

	}

	componentDidMount() {
		const uid = this.props.location.state;

		if (uid) {
			// 如果是自己
			if (uid == UID) {
				// browserHistory.push('my/userinfo');
			} else {
				this.props.dispatch({ type: 'my/getOtherInfo', payload: { uid: uid, page: 1 } });
			}

		}
	}

	componentWillReceiveProps(nextProps) {
		const hei = document.body.clientHeight;
		if (this.state.list !== nextProps.otherDream && nextProps.otherDream !== null) {
			this.setState({
				list: [...this.state.list, ...nextProps.otherDream],
			})

			setTimeout(() => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.state.list),
					isLoading: false,
					height: hei,
				});
			}, 500)
		}
	}

	// 拉到底部刷新
	onEndReached = (event) => {
		if (this.state.isLoading && !this.state.hasMore) {
			return;
		}

		this.setState({ isLoading: true });
		this.state.currentPage = this.state.currentPage + 1;
		this.props.dispatch({ type: 'my/getOtherInfo2', payload: { uid: this.props.location.state, page: this.state.currentPage } });
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

	render() {

		let _otherInfo = {
			...this.props.otherInfo,
		}


		const uname = _otherInfo.uname;
		const tabs = [
			{
				title: <b className={styles.colorBlack}> {uname}的梦境</b>
			}
		];

		return (
			<div>
				{
					UID ?
						<div className={styles.userinfoWrap}>
							<NavBarPage iconType="back" isFly='false' isFixed="true" isOther="true" title={uname} addBlackList={this.addBlackList.bind(this, _otherInfo.is_black || null)} />
							<div className={styles.userinfo}>
								{
									this.props.otherInfo ?
										<div>
											<div className={styles.title}>
												<div className={styles.img}>
													<img src={_otherInfo.avatar || Util.defaultImg} alt={uname} />
												</div>
												<div>
													<b>{uname}</b>
												</div>
											</div>
											<div className={styles.opinion}>{_otherInfo.intro}</div>
											<ul>
												<li><i className={styles.iconfont}>&#xf226;</i><span>{this.sexsRender(_otherInfo.sex)}</span></li>
												<li><i className={styles.iconfont}>&#xe806;</i><span>{_otherInfo.location}</span></li>
												<li><i className={styles.iconfont}>&#xf32d;</i><span>{_otherInfo.job}</span></li>
												<li><i className={styles.iconfont}>&#xf252;</i><span>{_otherInfo.age}</span></li>
											</ul>
										</div>
										: null
								}
							</div>
							<div className={styles.dreamWrap}>
								<Tabs tabs={tabs} initalPage={'t2'} swipeable={false}>
									<div>
										<ListPage
											dataSource={this.state.dataSource}
											isLoading={this.state.isLoading}
											onEndReached={this.onEndReached}
											isUseBodyScroll={true}
										/>
									</div>
								</Tabs>
							</div>
						</div>
						:
						<UserInfoNotLogin uid={this.props.location.state} />
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
