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
				<p>“我们说对于梦的阐述不应有先入为主、教条主义的偏见，这是重要的前提因素。一旦出现某种“单性的解释现象”就能知道该解释已经变成了教条，因而也就徒劳无功了。”</p>
				<br></br>
				<p>——荣格C G Jung</p>
				<br></br>
				<br></br>
				<p></p>
				<br></br>
				<p>【释梦现支持iOS苹果App】</p>
				<p>【网页版和Andriod安卓筹备当中】</p>
				<br></br><br></br>
				</div>
			</div>
		)
	}

}
