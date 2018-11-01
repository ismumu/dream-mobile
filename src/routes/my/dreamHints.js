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
				<p>我们正在筛选一些学科上的建议给大家揭开自己的一些迷雾</p>
				<p>揭开自己的一些迷雾</p>
				揭开自己的一些迷雾
				</div>
			</div>
		)
	}

}
