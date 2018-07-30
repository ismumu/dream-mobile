
import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView, Toast, Tag, ActionSheet } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import Storage from '../../utils/storage';
import styles from "./userinfo.less";
import Util from "../../utils/util";
import NavBarPage from "../../components/NavBar"
import CollectList from "./collect/collectList"
import ListPage from '../../components/List'


import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';


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
			height: document.body.clientHeight - 95,
			currentPage: 1,
			hasMore: true,

			userinfo: {},

			// tag
			tagText: '',
			tagPageIndex: 1,
			tagHasMore: true,
			tagIndex: '',


			type: '', // 类型，区分是否是tag过来的
			isFirst: '', // 是否第一次点击tag

			// ImageView
			showViewer: false,
			imagelist: null,
			imagelistCurrent: 0,
		};

		this.uid = Storage.get('uid');

	}


	defaultGetData = () => {
		this.props.dispatch({
			type: 'my/getUserHome',
			payload: {
				uid: this.uid,
				page: 1
			},
			callback: (data) => {
				this.setData(data);
			}
		});
	}

	componentDidMount() {
		this.defaultGetData();
	}


	/**
	 * 处理搜索数据
	 */
	setData = (data) => {

		const hei = document.body.clientHeight;

		let { type, isFirst } = this.state;

		if ( type == 'tag' ) {
			// 不足15条，最后一页
			if (data.data.feed.length < 15) {
				this.setState({
					tagHasMore: false
				})
			}

			let list = [];

			if ( !isFirst ) {
				list = this.state.list
			}

			let _list = list.concat(data.data.feed);

			this.setState({
				list: _list,
				dataSource: this.state.dataSource.cloneWithRows(_list),
				isLoading: false,
				height: hei,
				isFirst: false,
			});

		} else {
			// 不足15条，最后一页
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




	}

	onEndReached = (event) => {

		let { isLoading, hasMore, tagHasMore, currentPage, tagPageIndex, type, tagText } = this.state;
		let { dispatch } = this.props;

		if ( isLoading) {
			return;
		}

		if ( type == 'tag' ) {
			if ( !tagHasMore ) {
				return;
			}

			this.setState({
				isLoading: true,
				tagPageIndex: tagPageIndex + 1,
			});

			dispatch({
				type: 'my/getUserHome',
				payload: {
					uid: this.uid,
					tag_name: tagText,
					page: tagPageIndex + 1,
				},
				callback: (d) => {
					this.setData(d);
				}
			});
		} else {
			if ( !hasMore ) {
				return;
			}

			this.setState({
				isLoading: true,
				currentPage: currentPage + 1,
			});

			dispatch({
				type: 'my/getUserHome',
				payload: {
					uid: this.uid,
					page: currentPage + 1,
				},
				callback: (d) => {
					this.setData(d);
				}
			});
		}


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



	tagClick = (e, type, isFirst, tagIndex) => {
		let tagText = e.target.innerHTML;

		this.setState({
			tagText: tagText,
			type: type,
			isFirst: isFirst,
			tagIndex: tagIndex,
		})

		this.props.dispatch({
			type: 'home/getTagFeedList',
			payload: {
				uid: this.uid,
				tag_name: tagText,
				page: 1,
			},
			callback: (d) => {
				this.setData(d, 'tag', true);
			}
		});
	}

	// 获取所有梦境
	iDream = () => {
		this.setState({
			list: [],
			tagIndex: '',
		})
		this.defaultGetData();
	}

	render() {

		const { tags } = this.props;

		let _user = {
			...this.state.userinfo,
		}

		const tabs = [
			{
				title: <b className={styles.colorBlack}>我的梦境</b>
			},
		];

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
						<li><i className={styles.iconfont}>&#xf226;</i>{this.sexsRender(_user.sex) ? <span>{this.sexsRender(_user.sex)}</span> : <span className={styles.defaultTip}>未填写</span> }</li>
						<li><i className={styles.iconfont}>&#xe806;</i>{_user.location ? <span>{_user.location}</span> : <span className={styles.defaultTip}>未填写</span> }</li>
						<li><i className={styles.iconfont}>&#xe805;</i>{_user.job ? <span>{_user.job}</span> : <span className={styles.defaultTip}>未填写</span> }</li>
						<li><i className={styles.iconfont}>&#xf252;</i>{_user.age ? <span>{_user.age}</span> : <span className={styles.defaultTip}>未填写</span> }</li>
					</ul>
					<div className={styles.tagsBox}>
						{tags.map((text, index) => {

							let { tagIndex } = this.state;

							if ( tagIndex === index ) {
								return (
									<span
										className={styles.tagOn}
										key={index}
										onClick={ (e) => this.tagClick(e, 'tag', true, index )}
									>{text}</span>
								)
							} else {
								return (
									<span
										className={styles.tag}
										key={index}
										onClick={ (e) => this.tagClick(e, 'tag', true, index )}
									>{text}</span>
								)
							}

						})}
					</div>
				</div>

				<div className={styles.dreamWrap}>
					<Tabs
						tabs={tabs}
						swipeable={false}
						onTabClick={this.iDream}
					>
						{
							this.state.list.length > 0
								?
								<ListPage
									dataSource={this.state.dataSource}
									isLoading={this.state.isLoading}
									onEndReached={this.onEndReached}
									isUseBodyScroll={true}
									isShare={true}
									imageView={this.imageViewClick}
								/>
								:
								<div style={{ textAlign: 'center', color: '#757575', fontSize: '15px', marginTop: 30 }}>开展你的梦</div>
						}
					</Tabs>
				</div>

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
		...state.my,
		tags: state.fly.tags
	};
}
export default connect(mapStateToProps)(Userinfo);
