import modelExtend from 'dva-model-extend';
import { model } from './common.js';
import { browserHistory } from 'react-router';
import { Toast } from "antd-mobile";
import { publish, uploadImg, getTags, getDreamDetail } from '../services/fly.js';

import Storage from '../utils/storage'

export default modelExtend(model, {
	namespace: 'fly',
	state: {
		images: [],
		tags: [],

		imagesEdit: [],
		tagsEdit: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// dispatch({
			// 	type: 'getTags',
			// 	payload: {},
			// })
		},
	},

	effects: {

		//发梦
		*publishDream(action, { call, put, select }) {

			let { payload, callback } = action;

			Toast.loading("发送中");
			const { data, code, msg } = yield call(publish, payload);
			if (code == 200) {

				yield put({
					type: 'updateState',
					payload: {
						images: [],
						tags: []
					}
				});

				callback && callback();
			} else {
				Toast.info(msg || '有问题，可能不支持emoji', 1);
			}
		},

		// 上传图片
		*uploadImg({ payload, callback }, { call, put }) {
			const data = yield call(uploadImg, payload);

			if (data.code === 200) {
				callback && callback(data)
			}
		},

		// 上传图片,编辑页面
		*uploadImgEdit({ payload, callback }, { call, put }) {
			const data = yield call(uploadImg, payload);
			if (data.code === 200) {
				callback && callback(data)
			}
		},

		// 更新梦境
		*updateDream({ payload, callback }, { call, put }) {
			Toast.loading("更新中");

			const data = yield call(publish, payload);
			if (data.code == 200) {
				callback && callback(data);
			}
		},

		// 获取梦境
		*editDetail({ payload, callback }, { call, put }) {
			yield put({ type: 'updateState', payload: { detailLoading: false, detail: null, } });
			const data = yield call(getDreamDetail, payload);
			if (data.code == 200) {
				callback && callback(data)
			} else {
				Toast.info('服务器异常，请稍后重试', 1);
			}
		},


		// 获取标签
		*getTags({ payload }, { call, put }) {
			const { data, code, msg } = yield call(getTags, payload);
			if (code === 200) {
				yield put({ type: 'updateState', payload: { tags: data } });
			}
		},

	},

	reducers: {
		// addImages(state, { payload: image }) {

		// 	const images = state.images.concat(image);
		// 	return { ...state, images: images };
		// },
		// removeImages(state, { payload: index }) {
		// 	debugger
		// 	state.images.splice(index, 1);
		// 	return { ...state, images: state.images };
		// },

		// addImagesEdit(state, { payload: image }) {
		// 	const images = state.imagesEdit.push({ id: 1, url: image });
		// 	return { ...state, images };
		// },
		// removeImagesEdit(state, { payload: index }) {
		// 	state.imagesEdit.splice(index, 1);
		// 	return { ...state, imagesEdit: state.imagesEdit };
		// },

	},

});
