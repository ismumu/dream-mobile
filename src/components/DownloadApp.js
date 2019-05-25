import React from 'react'
import { Modal } from 'antd-mobile'

import styles from './DownloadApp.less';


export default class DownloadApp extends React.Component {

	constructor () {
		super();
		this.state = {
			showModal: false,
		}
	}

	closeModal = () => {
		this.setState({
			showModal: false,
		})
	}

	render() {

		let { domClass } = this.props;

		// app内打开不展示 下载app
		if ( window.location.href.includes('mode=webview') ) {
			return <span></span>;
		}

		return (
			<div>
				<p onClick={() => {
					this.setState({
						showModal: true,
					})
				}} className={domClass}>App下载</p>
				<Modal
					visible={this.state.showModal}
					transparent
					closable={true}
					maskClosable={true}
					onClose={this.closeModal}
				>
					<div className={styles.box}>
						<p>现已支持手机软件</p>
						<p>iOS在AppStore搜iDream食梦</p>
						<p className={styles.downloadTip}>Andriod安卓点击[下载]安装</p>
						<a target="_blank" href="/iDream.apk" className={styles.downloadBtn}>下载</a>
						<p className={styles.downloadIosTip}><br/></p>
					</div>
				</Modal>
			</div>
		);
	}
};
