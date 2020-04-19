/**
* escape regex string
* @param {string} text
* @param {string}
*/
export default text => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
