


function stringToTopic (contentString) {
    // 转换下空格
    contentString = contentString.replace(/&nbsp;/g, ' ');
    let resultArr = [];

	let topicHtml = '<a href="javascript:;" class="J-topic" to="/topic?text=$1">#$1 </a>';


    // 判断是不是以前的老数据(textarea填写提交的)
    if ( contentString.includes('</p>') ) {
        let contentArr = contentString.split('</p>');
        contentArr.map((pString) => {

            // 把span标签剔除
            pString = pString.replace(/\<span.*?\>/g, '');
            pString = pString.replace(/\<\/span.*?\>/g, '');

            if ( pString.endsWith('#') ) {
                pString += '</p>';
                pString = pString.replace(/(?:#([^#\s]+)\s)/g, topicHtml);
            } else {
                pString += ' </p>';
                pString = pString.replace(/(?:#([^#\s]+)\s)/g, topicHtml);
            }

            resultArr.push(pString);

        })
    } else {
        resultArr.push(contentString.replace(/(?:#([^#\s]+)\s)/g, topicHtml));
    }

    return resultArr.join('');
}




module.exports = {
	initList(list, kw) {
		return list.map((i) => {
			// if (i.content) {
			// 	i.content = i.content.replace(/(^|.+?)\#([^\<\>\s\n]+)/g, (a, b, c) => {
			// 		let mstr = c.replace('&nbsp;', '').replace(/^\s+|\s+$/, '');
			// 		let act = (kw && kw == mstr) ? true : false;
			// 		return b + '<a href="javascript:;" to="' + (act ? 'javascript:;' : '/topic?text=' + mstr) + '" class="topic J-topic' + (act ? ' active' : '') + '">#' + mstr + '</a>';
			// 	});
			// }
			// if (i.review_content) {
			// 	i.review_content = i.review_content.replace(/(^|.+?)\#([^\<\>\s\n]+)/g, (a, b, c) => {
			// 		let mstr = c.replace(/^\s+|\s+$/, '');
			// 		let act = (kw && kw == mstr) ? true : false;
			// 		return b + '<a  href="javascript:;" to="' + (act ? 'javascript:;' : '/topic?text=' + mstr) + '" class="topic  J-topic' + (act ? ' active' : '') + '">#' + mstr + '</a>';
			// 	});
			// }
			if ( i.content ) {
				if(!i.content.includes('J-topic')) {
					i.content = stringToTopic(i.content);
					// i.content = i.content.replace(/&nbsp;/g, ' ');
					// i.content = i.content.replace(/(?:#([^#\s]+)\s)/g, '<a href="javascript:;" class="J-topic" to="/topic?text=$1">#$1 </a>');
				}

			}
			if ( i.review_content ) {
				if(!i.review_content.includes('J-topic')) {
					i.review_content = stringToTopic(i.review_content);
					// i.review_content = i.review_content.replace(/&nbsp;/g, ' ');
					// i.review_content = i.review_content.replace(/(?:#([^#\s]+)\s)/g, '<a href="javascript:;" class="J-topic" to="/topic?text=$1">#$1 </a>');
				}

			}
			return i;
		});
	}
}
