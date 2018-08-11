
import React from "react";
import { connect } from "dva";
import { Link } from "dva/router"
import { ListView, Icon, NavBar, Tabs } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import styles from "./index.less";
import Util from "../../utils/util";
import Storage from '../../utils/storage';

import NavBarPage from "../../components/NavBar"
import List from '../../components/List'
import IndexNotLogin from './index-not-login'

import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';

const UID = Storage.get('uid');

// 内容高度
const contentHeight = document.body.clientHeight - 95;

class Index extends React.Component {
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
		this.props.dispatch({
			type: 'home/getDreamList',
			payload: {
				page: 1
			}
		});
	}

	componentWillMount() {
		//this.props.dispatch({ type: 'home/getDreamList', payload: { page: 1 } });
	}

	componentWillReceiveProps(nextProps) {

		if (this.state.list !== nextProps.list) {

			this.setState({
				list: [...this.state.list, ...nextProps.list],
				height: contentHeight,
				dataSource: this.state.dataSource.cloneWithRows([...this.state.list, ...nextProps.list]),
				isLoading: false,
			});

		}
	}

	// 列表拉倒底部，获取下一页数据
	onEndReached = (event) => {
		if (this.state.isLoading && !this.state.hasMore) {
			return;
		}
		this.setState({ isLoading: true });
		this.state.currentPage = this.state.currentPage + 1;
		this.props.dispatch({
			type: 'home/getDreamList',
			payload: {
				page: this.state.currentPage
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

		return (
			<div className={styles.chatWrap}>
				<NavBarPage />
				<List
					dataSource={this.state.dataSource}
					isLoading={this.state.isLoading}
					height={this.state.height}
					onEndReached={this.onEndReached}
					imageView={this.imageViewClick}
				/>
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
		...state.home
	};
}
export default connect(mapStateToProps)(Index);
