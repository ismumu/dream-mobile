
import React from "react";
import { connect } from "dva";
import { ListView } from "antd-mobile";
import styles from "./topic.less";

import NavBarPage from "../../components/NavBar"
import List from '../../components/List'

import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';


// 内容高度
const contentHeight = document.body.clientHeight - 95;

class Topic extends React.Component {
	constructor(props, context) {
		super(props, context);

		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			currentPage: 1,
			dataSource,
			list: [],
			isLoading: true,
			height: contentHeight > 500 ? contentHeight : 800,

			// ImageView
			showViewer: false,
			imagelist: null,
			imagelistCurrent: 0,
		};
	}

	componentDidMount() {

		let { topicText } = this.props;

		this.props.dispatch({
			type: 'home/getTopicList',
			payload: {
				page: 1,
				topic_name: topicText,
			},
			callback: (data) => {
				this.setData(data);
			}
		});
	}


	/**
	 * 处理搜索数据
	 */
	setData = (data) => {

		const hei = document.body.clientHeight;

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

	// 列表拉倒底部，获取下一页数据
	onEndReached = () => {

		let { isLoading, hasMore, currentPage } = this.state;
		let { topicText } = this.props;

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
			type: 'home/getTopicList',
			payload: {
				page: currentPage + 1,
				topic_name: topicText,
			},
			callback: (data) => {
				this.setData(data);
			}
		});
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


		let { topicText } = this.props;
		let { list, dataSource, isLoading, height, showViewer, imagelist, imagelistCurrent } = this.state;

		return (
			<div className={styles.chatWrap}>
				<NavBarPage iconType="back" title={'#' + topicText} isTopic="true" />
				{
					list.length > 0
					?
					<List
						dataSource={dataSource}
						isLoading={isLoading}
						height={height}
						onEndReached={this.onEndReached}
						imageView={this.imageViewClick}
					/>
					:
					<div
						style={{
							textAlign: 'center',
							marginTop: 50,
							lineHeight: '100px',
							fontSize: '12px',
							color: '#999'
						}}>
						该话题暂无相关内容 (꒦_꒦)
					</div>
				}

				{
					showViewer &&
					<ImageView
						imagelist={imagelist}
						current={imagelistCurrent}
						close={this.closeImageView}
					/>
				}
			</div>
		)
	}
}


export default connect(state => ({...state.home}))(Topic);
