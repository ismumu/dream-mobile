import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { hashHistory } from 'react-router';
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
			height: document.documentElement.clientHeight * 3 / 4,
			currentPage: 1,

		};

	}

	componentDidMount() {
		const uid = this.props.location.state;
		if (uid) {
			// 如果是自己
			if (uid == UID) {
				//hashHistory.push('my/userinfo');
			} else {
				this.props.dispatch({ type: 'my/getOtherInfo', payload: { uid: uid, page: 1 } });
			}

		}
	}

	componentWillReceiveProps(nextProps) {
		const hei = document.documentElement.clientHeight;
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

	// 行
	/* row = (rowData, sectionID, rowID) => {
	  const obj = rowData;
	  return (
		<div className={styles.item}>
		  <div className={styles.head}>
			<div className={styles.img}>
			  <Link to={{ pathname: "/my/other", 'state': + obj.uid }}>
				<img src={obj.avatar ? obj.avatar : Util.defaultImg} alt={obj.uname} />
			  </Link>
			</div>
			<span className={styles.name}><Link to={{ pathname: "/my/other", 'state': + obj.uid }}>{obj.uname}</Link></span>
			<span className={styles.time}>{obj.publish_time}</span>
		  </div>
		  <div className={styles.itemContent}>
			<Link to={{ pathname: "/home/detail", 'state': + obj.feed_id }}>
			  <div className={styles.title}>

				{obj.title}
			  </div>
			  <div className={styles.des}>{obj.content}</div>
			</Link>
		  </div>
		  <div className={styles.icons}>
			<span className={styles.praise}>
			  {
				obj.hasDigg == 1 ? <i className={styles.iconfont}>&#xe707;</i> : <i className={styles.iconfontSmall}>&#xe604;</i>
			  }
			  <label>{obj.digg_count>0?obj.digg_count:null}</label>
			</span>
			<span className={styles.review}>
			  <Link to={{ pathname: "/home/detail", 'state': + obj.feed_id }}>
				<i className={styles.iconfontSmall}>&#xe60f;</i>
				<label>{obj.comment_all_count>0?obj.comment_all_count:null}</label>
			  </Link>
			</span>

		  </div>
		</div>

	  );
	}; */

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
							<NavBarPage iconType="back" isFly='false' isFixed="true" title={uname} />
							<div className={styles.userinfo}>
								{
									this.props.otherInfo ?
										<div>
											<Icon style={{ position: 'absolute', right: 10 }} type="ellipsis" size="xxs"
												onClick={this.addBlackList.bind(this, _otherInfo.is_black || null)} />
											<div className={styles.title}>
												<div className={styles.img}>
													<img src={_otherInfo.avatar || Util.defaultImg} alt={uname} />
												</div>
												<div>
													<b>{uname}</b>
												</div>
											</div>

											<ul>
												<li>
													<i className={styles.iconfont}>&#xf226;</i><span>{this.sexsRender(_otherInfo.sex)}</span></li>
												<li>
													<i className={styles.iconfont}>&#xe806;</i><span>{_otherInfo.location}</span></li>
												<li>
													<i className={styles.iconfont}>&#xf32d;</i><span>{_otherInfo.job}</span></li>
												<li>
													<i className={styles.iconfont}>&#xf252;</i><span>{_otherInfo.age}</span></li>
											</ul>
											<div className={styles.opinion}>{_otherInfo.intro}</div>
										</div>
										: null
								}
							</div>

							{/* 梦境列表 */}
							<div className={styles.dreamWrap}>
								<Tabs tabs={tabs} initalPage={'t2'} swipeable={false}>
									<div>
										<ListPage
											dataSource={this.state.dataSource}
											isLoading={this.state.isLoading}
											onEndReached={this.onEndReached}
											isUseBodyScroll={true}
										/>
										{/* <ListView
                      ref={el => this.lv = el}
                      dataSource={this.state.dataSource}
                      renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
                        {this.state.isLoading ? "加载中..." : <span className={styles.f12}>我是有底线的</span>}
                      </div>)}
                      renderRow={this.row}
                      renderSeparator={separator}
                      className="am-list"
                      pageSize={4}
                      useBodyScroll
                      onScroll={() => {  }}
                      scrollRenderAheadDistance={500}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={10}
                    /> */}

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
