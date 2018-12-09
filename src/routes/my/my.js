import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import {
	ImagePicker,
	List,
	Picker,
	DatePicker,
	WhiteSpace,
	NavBar
} from "antd-mobile";
import styles from "./my.less";
import NavBarPage from "../../components/NavBar"
import Storage from '../../utils/storage';

import defaultAvatar from '../../assets/images/avatar.png';
import DownloadApp from '../../components/DownloadApp';

const Item = List.Item;
const Brief = Item.Brief;

class My extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			user: {}
		}
	}

	componentWillMount() {
		const uid = Storage.get('uid');
		this.props.dispatch({
			type: 'my/getUserHome',
			payload: {
				uid: uid,
				page: 1
			},
			callback: (data) => {
				this.setState({
					user: data.data.user,
				})
			}
		});
	}

	render() {

		let { user } = this.state;

		return (
			<div className={styles.myWrap}>
				<NavBarPage isFly="true" />
				<List className={styles.listItem} style={{ marginTop: '-1px' }}>
					<Link to="/my/userinfo">
						<Item
							arrow="horizontal"
							thumb={
								<div style={{ display: 'block', width: 40, height: 40, borderRadius: '50%', border: '0px solid #eee', overflow: 'hidden' }}>
									{
										user.avatar ?
											<img style={{ width: '100%', height: 'auto' }} src={user.avatar} />
											:
											<img style={{ width: '100%', height: 'auto' }} src={defaultAvatar} />
									}
								</div>
							}
							multipleLine
							style={{ minHeight: 78 }}
							onClick={() => { }}
						>
							{user.uname}
							<Brief>我的主页</Brief>
						</Item>
					</Link>
				</List>
				<List className={styles.listItem}>
					<Link to="/my/setup">
						<Item
							arrow="horizontal"
							multipleLine
						>
							设置
                        </Item>
					</Link>
				</List>
				<List className={styles.listItem}>
					<Link to="/my/about">
						<Item
							arrow="horizontal"
							multipleLine
							onClick={() => { }}>
							关于
                        </Item>
					</Link>
				</List>
				<List className={styles.listItem}>
					<Link to="/my/dreamHints">
						<Item
							arrow="horizontal"
							multipleLine
						>
							释梦
                        </Item>
					</Link>
				</List>
				<DownloadApp domClass={styles.downloadAppStyle} />
			</div>
		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my
	};
}
export default connect(mapStateToProps)(My);
