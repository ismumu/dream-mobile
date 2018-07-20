

module.exports = {
	initList(list, kw) {
		return list.map((i) => {
			if (i.content) {
				i.content = i.content.replace(/(^|.+?)\#([^\<\>\s\n]+)/g, (a, b, c) => {
					let mstr = c.replace('&nbsp;', '').replace(/^\s+|\s+$/, '');
					let act = (kw && kw == mstr) ? true : false;
					return b + '<a href="javascript:;" to="' + (act ? 'javascript:;' : '/topic?text=' + mstr) + '" class="topic J-topic' + (act ? ' active' : '') + '">#' + mstr + '</a>';
				});
			}
			if (i.review_content) {
				i.review_content = i.review_content.replace(/(^|.+?)\#([^\<\>\s\n]+)/g, (a, b, c) => {
					let mstr = c.replace(/^\s+|\s+$/, '');
					let act = (kw && kw == mstr) ? true : false;
					return b + '<a  href="javascript:;" to="' + (act ? 'javascript:;' : '/topic?text=' + mstr) + '" class="topic  J-topic' + (act ? ' active' : '') + '">#' + mstr + '</a>';
				});
			}
			return i;
		});
	}
}
