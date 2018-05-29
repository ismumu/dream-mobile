/**
 * 用户主页
 * author: zch
 */
import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView, Toast, Tag, ActionSheet} from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import Storage from '../../utils/storage';
import styles from "./userinfo.less";
import Util from "../../utils/util";
import NavBarPage from "../../components/NavBar"
import CollectList from "./collect/collectList"
import ListPage from '../../components/List'

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
			height: document.documentElement.clientHeight - (50 + 43.5),
			currentPage: 1,
			hasMore: true,
		};
	}

	componentDidMount() {
		// 获取用户信息
		const uid = Storage.get('uid');
		this.props.dispatch({ type: 'my/getUserHome', payload: { uid: uid, page: 1 } });

	}

	componentWillReceiveProps(nextProps) {
		if (this.state.list !== nextProps.list) {
			this.setState({
				list: [...this.state.list, ...nextProps.list],
			})

			setTimeout(() => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.state.list),
					isLoading: false,
				});
			}, 500)

			// 不足10条，最后一页
			if (nextProps.list < 10) {
				this.setState({
					hasMore: false
				})
			}
		} else {
			this.setState({
				isLoading: false,
			});
		}
	}

	// 拉倒底部，再次获取数据
	onEndReached = (event) => {
		if (this.state.isLoading) {
			return;
		}

		if (this.state.hasMore) {
			Toast.info("没有更多了", 1);
			return;
		}

		this.setState({ isLoading: true });
		this.state.currentPage = this.state.currentPage + 1;
		const uid = Storage.get('uid');
		this.props.dispatch({ type: 'my/getUserHome', payload: { uid: uid, page: this.state.currentPage } });
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
		const tabs = [
			{
				title: <b className={styles.colorBlack}>我的梦境</b>
			},
			// 暂时隐藏我的收藏
			// {
			// 	title: <b className={styles.colorBlack}>收藏夹</b>
			// }
		];

		const { tags } = this.props;

		const handleInitTabs = (val) => {
			const tabsInitPage = this.props.userInfoInitTabs;
			this.props.dispatch({
				type: 'my/changeUserInfoInitTabs',
				payload: {
					userInfoInitTabs: tabsInitPage == 0 ? 1 : 0
				}
			})
		}

		let _user = {
			...this.props.user,
		}

		return (
			<div className={styles.userinfoWrap}>

				<NavBarPage iconType="back" isSearch='true' isFixed="true" />

					<div className={styles.userinfo}>
						<div className={styles.title}>
							<div className={styles.img}>
								<img src={_user.avatar || Util.defaultImg} alt={_user.uname} />
							</div>
							<div>
								<b>{_user.uname}</b>
							</div>
						</div>
						<div className={styles.opinion}>{_user.intro}</div>
						<ul>
							<li>
								<i className={styles.iconfont}>&#xf226;</i><span>{this.sexsRender(_user.sex)}</span></li>
							<li>
								<i className={styles.iconfont}>&#xe806;</i><span>{_user.location}</span></li>
							<li>
								<i className={styles.iconfont}>&#xf32d;</i><span>{_user.job}</span></li>
							<li>
								<i className={styles.iconfont}>&#xf252;</i><span>{_user.age}</span></li>
						</ul>
						<div className={styles.tagsBox}>
							{
								Object.keys(tags).map((tag) => (<span className={styles.tag} key={tag}>{tags[tag]}</span>))
							}
						</div>
					</div>

				<div className={styles.dreamWrap}>
					<StickyContainer>
						<Tabs tabs={tabs} initialPage={this.props.userInfoInitTabs} swipeable={false} onChange={handleInitTabs}>
							<div>
								{
									this.state.list.length > 0 ?
										<ListPage
											dataSource={this.state.dataSource}
											isLoading={this.state.isLoading}
											onEndReached={this.onEndReached}
											isUseBodyScroll={true}
											isShare={false}
										/>
										: <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: 30 }}>开展你的梦</div>
								}
							</div>
							<div>
								<CollectList />
							</div>

						</Tabs>
					</StickyContainer>
				</div>
			</div>
		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my,
		tags: state.fly.tags
	};
}
export default connect(mapStateToProps)(Userinfo);
