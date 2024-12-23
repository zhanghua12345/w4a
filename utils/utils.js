function urlParamsToObject(queryString) {
	const paramsArr = queryString.split('&');
	const paramObj = {};

	paramsArr.forEach(param => {
		const [key, value] = param.split('=');
		paramObj[key] = decodeURIComponent(value);
	});

	return paramObj;
}

function objectToQueryString(obj) {
	return Object.keys(obj).map(key => {
		let value = obj[key];
		// 处理数组情况
		if (Array.isArray(value)) {
			value = value.map(v => encodeURIComponent(v)).join(',');
		} else {
			value = encodeURIComponent(value);
		}
		return `${encodeURIComponent(key)}=${value}`;
	}).join('&');
}

export {
	urlParamsToObject,
	objectToQueryString
}