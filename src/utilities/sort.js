/**
 *
 * @param {*} array passing array
 * @param {*} order order array
 * @param {*} key sorted key
 * using key and keys order for sorting an array
 */
export const mapOrder = (array, order, key) => {
	array.sort((a, b) => {
		return order.indexOf(a[key]) - order.indexOf(b[key]);
	});
	return array;
};
