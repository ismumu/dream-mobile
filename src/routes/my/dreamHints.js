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
					提示文字
				</div>
			</div>
		)
	}

}
