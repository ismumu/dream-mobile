import React from 'react'
import { Link, browserHistory } from 'dva/router'
import { NavBar, Icon, ActionSheet, Modal } from 'antd-mobile'
import styles from '../assets/styles/base.less'


class NavBarPage extends React.Component {

	constructor () {
		super();
		this.state = {
			showModal: false,
		}
	}

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

	closeModal = () => {
		this.setState({
			showModal: false,
		})
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
			_rightContent = <Link to="/fly"><i className='icon-paper-plane icon-idream-small icon-idream-black'></i></Link>;
		} else if ( isLogin == 'true' ) {
			_rightContent = <Link to="/login">登入</Link>;
		} else if ( isSearch == 'true' ) {
			_rightContent = <i onClick={this.showActionSheet} className='icon-menu icon-idream-small icon-idream-black'></i>
		} else if ( isOther == 'true' ) {
			_rightContent = <i onClick={addBlackList} className='icon-menu icon-idream-small icon-idream-black'></i>
		} else if ( isTopic == 'true' ) {
			_rightContent = '';
		} else if ( isSetup == 'true' ) {
			_rightContent = <i onClick={() => {
				this.setState({
					showModal: true,
				})
			}} className='icon-logout icon-idream-small icon-idream-black'></i>
		}

		return (
			<div>
				<NavBar
					mode="light"
					icon={iconType == "back" ? < Icon type="left" onClick={() => history.go(-1)} /> : <i className='icon-idream-blue'></i>}
					rightContent={ _rightContent }
					className={isFixed ? styles.navBar : styles.navBar2}
				>{title ? title : 'iDream'}</NavBar>
				<Modal
					visible={this.state.showModal}
					transparent
					maskClosable={true}
					footer={[
						{
							text: '取消',
							onPress: () => {
								this.closeModal();
							}
						},
						{
							text: '确认',
							onPress: () => {
								logout();
							}
						}
					]}
					onClose={this.closeModal}
				>
					<div style={{fontSize: 20, color: '#000'}}>退出账号？</div>
				</Modal>
			</div>
		);
	}
};

export default NavBarPage;
