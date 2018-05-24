import React from 'react'
import { Link, browserHistory } from 'dva/router'
import { NavBar, Icon, ActionSheet } from 'antd-mobile'
import styles from '../assets/styles/base.less'


class NavBarPage extends React.Component {

	componentDidMount() {}

	showActionSheet = () => {

		const BUTTONS = ['编辑我的信息', '搜索我的梦'];
		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS,
			maskClosable: true,
		},
		(buttonIndex) => {
			if ( buttonIndex == 0 ) {
				browserHistory.push('/my/edit');
			}
			if ( buttonIndex == 1 ) {
				browserHistory.push('/search?isMe=true');
			}
		});

	}

	render() {
		return (
			<NavBar
				mode="light"
				icon={this.props.iconType == "back" ? < Icon type="left" onClick={() => history.go(-1)} /> : <i className={styles.iconfontBlue}></i>}
				rightContent={
					this.props.isFly == "true" ?
						<Link to="/fly"><i className={styles.iconfontBlack}>&#xf1d8;</i></Link>
						: this.props.isLogin == "true" ? <Link to="/login">登录</Link>
							: this.props.isSearch == "true" ? <i onClick={this.showActionSheet} className={styles.iconfontBlack}>&#xf141;</i>
								: null
				}
				className={this.props.isFixed ? styles.navBar : styles.navBar2}
			>{this.props.title ? this.props.title : 'iDream'}</NavBar>
		);
	}
};

export default NavBarPage;
