import React from "react";
import {
	List,
} from "antd-mobile";
import styles from "./dreamHints.less";
import NavBarPage from "../../components/NavBar"


const Item = List.Item;
const Brief = Item.Brief;

export default class DreamHints extends React.Component {
	render() {
		return (
			<div>
				<NavBarPage title="解梦提示" iconType="back" />
				<div className={styles.dreamHints}>
				<br></br>
				<br></br>
				<br></br>
				<p>我们正在筛选一些学科上的建议</p>
				<br></br>
				<p>给大家借鉴</p>
				<br></br>
				<p>用来揭开自己的一些迷雾</p>
				<br></br>
				<br></br>

				<p>【Dreamers need to stick together】</p>
				<p>find the ones who haven't given up</p>
				<p>they are the future</p>

				</div>
			</div>
		)
	}

}
