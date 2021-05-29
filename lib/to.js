/**
 * Promise management for ease of use of async/await.
 *
 * ex: const [err, data] = await to(User.find({});
 * @param promise
 * @returns {*|Promise<any>} Return null or the error if no data, else the data.
 */
exports.to = function (promise) {
	return promise.then(data => {
		return [null, data];
	})
		.catch(err => [err]);
}