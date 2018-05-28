import React from "react";
import { connect } from "dva";
import { Link } from "dva/router"
import { ListView, Icon, NavBar, Tabs, PullToRefresh, List } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import NavBarPage from "../../components/NavBar"
import styles from "./index.less";

import Util from "../../utils/util";

const Item = List.Item;
const Brief = Item.Brief;




class Index extends React.Component {
	constructor(props, context) {
		super(props, context);

		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			dataSource,
			msgList: [],
			isLoading: true,
			height: document.documentElement.clientHeight - 139,
			currentPage: 1,
		};
	}

	componentWillMount() {
		this.props.dispatch({ type: 'message/getMessageList', payload: { page: 1 } });
	}

	componentWillReceiveProps(nextProps) {
		const hei = document.documentElement.clientHeight - 139;
		if (this.state.msgList !== nextProps.msgList && nextProps.msgList !== undefined) {

			this.setState({
				msgList: [...this.state.msgList, ...nextProps.msgList],
				height: hei
			})

			setTimeout(() => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.state.msgList),
					isLoading: false,
					height: hei
				});
			}, 500)
		} else {
			this.setState({
				isLoading: false
			})
		}
	}

	row = (rowData, sectionID, rowID) => {

		return (
			<div className={styles.message}>
				{rowData.is_open == '0' && <i className={styles.msgOrange}></i>}
				<img className={styles.avatar} src={rowData.fromUser.avatar || Util.defaultImg} />
				<div className={styles.msgContent} style={{width: 'calc(100% - 65px)'}}>
					<p className={rowData.fromUser.reviewContent ? styles.head : styles.head + ' ' + styles.noReviewContent }><span className={styles.time}>{rowData.fromUser.add_time}</span>{rowData.fromUser.uname} | {rowData.type}你梦境</p>
					{rowData.fromUser.reviewContent && <p className={styles.des}>{rowData.fromUser.reviewContent}</p>}
				</div>
			</div>
		)

	};

	// 拉底刷新
	onEndReached = (event) => {
		/* if (this.state.isLoading && !this.state.hasMore) {
			return;
		}

		this.setState({ isLoading: true });
		this.state.currentPage = this.state.currentPage + 1;
		this.props.dispatch({ type: 'message/getMessageList', payload: { page: this.state.currentPage } }); */
	}

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
				<NavBarPage isFly="true" />
				<StickyContainer>
					<ListView
						ref={el => this.lv = el}
						dataSource={this.state.dataSource}
						renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
							{this.state.isLoading ? "加载中..." : ''}
						</div>)}
						renderRow={this.row}
						renderSeparator={separator}
						style={{
							height: this.state.height,
							overflow: 'auto',
						}}
						pageSize={4}
						// onScroll={() => { console.log('scroll'); }}
						scrollRenderAheadDistance={500}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={10}
					/>
				</StickyContainer>
			</div>
		)
	}

}


function mapStateToProps(state) {
	return {
		...state.message
	};
}
export default connect(mapStateToProps)(Index);
