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
				<NavBarPage title="释梦" iconType="back" />
				<div className={styles.dreamHints}>
				<br></br>
				<br></br>
				<br></br>
				<p>我们正在收集一些学科上的见解</p>
				<br></br>
				<p>给大家参考</p>
				<br></br>
				<br></br>
				<p>【Dreamers need to stick together】</p>
				<br></br>
				<p>Find the ones who haven't given up</p>
				<p>They are the future</p>

				</div>
			</div>
		)
	}

}
