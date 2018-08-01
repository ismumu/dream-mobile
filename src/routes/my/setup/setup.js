/**
 * 用户设置页面-通知模块
 * author: zch
 */
import React from "react";
import { connect } from "dva";
import { List, NavBar, Button, Checkbox, Icon, Toast, Tabs, WhiteSpace, Radio } from "antd-mobile";
import styles from "./setup.less";

import NavBarPage from "../../../components/NavBar"
import Account from "./account"
import Blacklist from "./blacklist"


const Item = List.Item,
	CheckboxItem = Checkbox.CheckboxItem,
	AgreeItem = Checkbox.AgreeItem,
	RadioItem = Radio.RadioItem;

class Setup extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			notice: {
				is_digg: '',
				is_review: '',
			},
			is_show: '',
		}
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'message/getTags',
			payload: {},
			callback: (d) => {
				let { notice } = this.state;
				notice.is_digg = d.userInfo.notice.is_digg;
				notice.is_review = d.userInfo.notice.is_review;

				this.setState({
					notice,
					is_show: d.userInfo.is_show || '1',
				})
			}
		});
	}

	onChange = (v) => {

		let { notice } = this.state;

		if ( v === 0 ) {
			if ( notice.is_review == 1 ) {
				notice.is_review = 2;
			} else {
				notice.is_review = 1;
			}
		} else if ( v === 2 ) {
			if ( notice.is_digg == 1 ) {
				notice.is_digg = 2;
			} else {
				notice.is_digg = 1;
			}
		}

		this.setState({
			notice,
		})

		this.props.dispatch({
			type: 'message/setNotice',
			payload: {
				is_review: notice.is_review,
				is_digg: notice.is_digg,
			}
		});

	}

	render() {

		const data = [
			{ value: 1, label: '公开我主页和梦境' },
			{ value: 2, label: '只有自己能查看' },
		];

		const tabs = [
			{
				title: <b className={styles.colorBlack}>通知</b>,
			},
			{
				title: <b className={styles.colorBlack}>隐私</b>,
			},
			{
				title: <b className={styles.colorBlack}>账户</b>,
			},
			{
				title: <b className={styles.colorBlack}>黑名单</b>,
			}
		];

		let { notice, is_show } = this.state;


		return (
			<div className={styles.editWrap}>

				<NavBarPage iconType="back" isFly='false' title="设置" />
				<Tabs tabs={tabs} swipeable={false}>
					<div>
						<WhiteSpace />
						{
							notice.is_review &&
							<List>
								<CheckboxItem defaultChecked={notice.is_review == 1 ? true : false} onChange={() => this.onChange(0)}>评论</CheckboxItem>
								<CheckboxItem defaultChecked={notice.is_digg == 1 ? true : false} onChange={() => this.onChange(2)}>点赞</CheckboxItem>
							</List>
						}
						<List className={styles.listItem}>
							<Item
								style={{
									marginTop: 10
								}}
								multipleLine
								onClick={() => { this.props.dispatch({ type: 'my/logout', payload: { token: null } }) }}>
								<div
									style={{
										textAlign: 'center',
										color: "#1F4BA5"
									}}>退出账户</div>
							</Item>
						</List>

					</div>
					<div>
						<WhiteSpace />
						{
							is_show &&
							<List>
								{data.map(i => (
									<RadioItem key={i.value} checked={is_show == i.value} onChange={() => {
										this.setState({
											is_show: i.value
										})

										this.props.dispatch({
											type: 'message/setSecrets',
											payload: {
												is_show: i.value
											}
										});
									}}>
										{i.label}
									</RadioItem>
								))}
							</List>
						}
					</div>
					<div>
						<Account />
					</div>
					<div>
						<Blacklist />
					</div>
				</Tabs>
			</div>
		)
	}
}

export default connect()(Setup);
