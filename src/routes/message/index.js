import React from "react";
import { connect } from "dva";
import { Link } from "dva/router"
import { ListView, Icon, NavBar, Tabs, PullToRefresh, List, Modal } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import NavBarPage from "../../components/NavBar"
import styles from "./index.less";

import Util from "../../utils/util";

import logoFace from '../../assets/images/logo_face.png';

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
			height: document.body.clientHeight - 95,
			currentPage: 1,

			showModal: false,
		};
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'message/getMessageList',
			payload: {
				page: 1
			}
		});
	}

	componentWillReceiveProps(nextProps) {

		if (this.state.msgList !== nextProps.msgList && nextProps.msgList !== undefined) {

			this.setState({
				msgList: [...this.state.msgList, ...nextProps.msgList],
				height: document.body.clientHeight - 95,
			})

			setTimeout(() => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.state.msgList),
					isLoading: false,
					height: document.body.clientHeight - 95,
				});
			}, 500)
		} else {
			this.setState({
				isLoading: false
			})
		}
	}

	row = (rowData, sectionID, rowID) => {

		if ( rowData.type == '建议回复' ) {
			return (
				<div className={styles.message} onClick={ () => {
					this.setState({
						showModal: true,
						modalText: rowData.opinion_review,
					})
				}}>
					{rowData.is_open == '0' && <i className={styles.msgOrange}></i>}
					<img className={styles.avatar} src={logoFace} />
					<div className={styles.msgContent} style={{width: 'calc(100% - 65px)'}}>
						<p className={styles.head}><span className={styles.time}>{rowData.fromUser.add_time}</span>系统消息 | 建议回复</p>
						<p className={styles.des} dangerouslySetInnerHTML={{__html: rowData.opinion_review}}></p>
					</div>
				</div>
			)
		} else if ( rowData.type == '注册通知' ) {
			return (
				<div className={styles.message} onClick={ () => {
					this.setState({
						showModal: true,
						modalText: rowData.sys_content,
					})
				}}>
					{rowData.is_open == '0' && <i className={styles.msgOrange}></i>}
					<img className={styles.avatar} src={logoFace} />
					<div className={styles.msgContent} style={{width: 'calc(100% - 65px)'}}>
						<p className={styles.head}><span className={styles.time}>{rowData.fromUser.add_time}</span>欢迎来到iDream食梦</p>
						<p className={styles.des} dangerouslySetInnerHTML={{__html: rowData.sys_content}}></p>
					</div>
				</div>
			)
		} else {
			return (
				<div className={styles.message}>
					{rowData.is_open == '0' && <i className={styles.msgOrange}></i>}
					<Link to={{ pathname: "/my/other", 'state': + rowData.fromUser.uid }}><img className={styles.avatar} src={rowData.fromUser.avatar || Util.defaultImg} /></Link>
					<Link to={{ pathname: "/home/detail", query: { id: rowData.feed.feed_id } }}>
						<div className={styles.msgContent} style={{width: 'calc(100% - 65px)'}}>
							<p className={rowData.fromUser.reviewContent ? styles.head : styles.head + ' ' + styles.noReviewContent }><span className={styles.time}>{rowData.fromUser.add_time}</span>{rowData.fromUser.uname} | {rowData.type}你梦境</p>
							{rowData.fromUser.reviewContent && <p className={styles.des} dangerouslySetInnerHTML={{__html: rowData.fromUser.reviewContent}} ></p>}
						</div>
					</Link>
				</div>
			)
		}
	};



	closeModal = () => {
		this.setState({
			showModal: false,
		})
	}

	render() {
		const separator = (sectionID, rowID) => (
			<div
				key={`${sectionID}-${rowID}`}
				style={{
					backgroundColor: 'rgb(245, 245, 249)',
					height: 1,
					borderTop: '0px solid #ECECED',
					borderBottom: '0px solid #ECECED',
				}}
			/>
		);


		let { showModal, modalText, isLoading, height, dataSource } = this.state;


		return (
			<div className={styles.chatWrap}>
				<NavBarPage />
				<StickyContainer>
					<ListView
						ref={el => this.lv = el}
						dataSource={dataSource}
						renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
							{isLoading ? "读取中" : ''}
						</div>)}
						renderRow={this.row}
						renderSeparator={separator}
						style={{
							height: height,
							overflow: 'auto',
						}}
						pageSize={4}
						// onScroll={() => { console.log('scroll'); }}
						scrollRenderAheadDistance={500}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={10}
					/>
				</StickyContainer>
				<Modal
					visible={showModal}
					transparent
					maskClosable={true}
					footer={[
						{
							text: '确认',
							onPress: () => {
								this.closeModal();
							}
						}
					]}
					onClose={this.closeModal}
					>
					<div className={styles.modal} dangerouslySetInnerHTML={{__html: modalText}}></div>
				</Modal>
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
