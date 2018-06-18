
import modelExtend from 'dva-model-extend';
import { model } from './common.js';
import { browserHistory } from 'react-router';
import { login, register, resetPassword } from '../services/user.js';
import Storage from '../utils/storage';
import { Toast } from 'antd-mobile'


export default modelExtend(model, {

	namespace: 'user',

	state: {
		registerUser: null,
		registerPassword: null,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// 已登录，跳到首页
			//  if(Storage.get('token')){
			//   browserHistory.push('/');
			//  }
		},
	},

	effects: {
		// 登录
		* login({ payload }, { call, put }) {
			Toast.loading('登入中', 3);
			const { code, data, msg } = yield call(login, payload);
			if (code == 200) {
				setTimeout(() => {
					Toast.success("登入成功！", 1);
					browserHistory.push('/');
				}, 500);

				setTimeout(() => {
					window.location.reload();
				}, 600);
			}
		},

		// 注册
		* register({ payload }, { call, put }) {
			Toast.loading('创建中', 3)
			const { code, data, msg } = yield call(register, payload);

			if (code == 200) {
				Toast.loading('创建成功,登入中', 3)

				// 登录
				const { code, data, msg } = yield call(login, { name: payload.email, password: payload.password });
				if (code == 200) {
					setTimeout(() => {
						Toast.success("登入成功！", 1);
						browserHistory.push('/');
					}, 1000);

					setTimeout(() => {
						window.location.reload();
					}, 1100);
				}
			}
		},

		// 修改密码
		* resetPassword({ payload }, { call, put }) {
			const { code, data, msg } = yield call(resetPassword, payload);
			if (code == 200) {
				Toast.success("密码已重置，请查看邮箱", 1);
				yield put({ type: 'updateState', payload: { data: data } });
			}
		},

	},

	reducers: {

	},

})
