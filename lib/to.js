/**
 * Promise management for ease of use of async/await.
 *
 * ex: const [err, data] = await to(User.find({});
 * @param promise
 * @returns {*|Promise<any>}
 */
exports.to = function (promise) {
	return promise.then(data => {
		return [null, data];
	})
		.catch(err => [err]);
}