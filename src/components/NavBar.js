import React from 'react'
import { Link, browserHistory } from 'dva/router'
import { NavBar, Icon, ActionSheet } from 'antd-mobile'
import styles from '../assets/styles/base.less'


class NavBarPage extends React.Component {

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


	componentWillUnmount () {
		let { isSearch } = this.props;
		if(isSearch == "true") {
			ActionSheet.close()
		}
	}

	render() {

		let {
			iconType,
			isFixed,
			isFly,
			isLogin,
			isSearch,
			isOther,
			isTopic,
			title,
			addBlackList,
			isSetup,
			logout,
		} = this.props;


		let _rightContent = '';

		if ( isFly == 'true' ) {
			_rightContent = <Link to="/fly"><i className={styles.iconfontBlack}>&#xe80a;</i></Link>;
		} else if ( isLogin == 'true' ) {
			_rightContent = <Link to="/login">登入</Link>;
		} else if ( isSearch == 'true' ) {
			_rightContent = <i onClick={this.showActionSheet} className={styles.iconfontBlack}>&#xf008;</i>
		} else if ( isOther == 'true' ) {
			_rightContent = <i onClick={addBlackList} className={styles.iconfontBlack}>&#xf008;</i>
		} else if ( isTopic == 'true' ) {
			_rightContent = '';
		} else if ( isSetup == 'true' ) {
			_rightContent = <i onClick={logout} className={styles.iconfontBlack}>&#xe809;</i>
		}

		return (
			<NavBar
				mode="light"
				icon={iconType == "back" ? < Icon type="left" onClick={() => history.go(-1)} /> : <i className={styles.iconfontBlue}></i>}
				rightContent={ _rightContent }
				className={isFixed ? styles.navBar : styles.navBar2}
			>{title ? title : 'iDream'}</NavBar>
		);
	}
};

export default NavBarPage;
