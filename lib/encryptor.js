var crypto = {};
crypto.encrypt =  function(utf8_string) {
	return new Buffer(utf8_string).toString('base64');
}
crypto.decrypt = function(base64_stream) {
	return new Buffer(base64_stream, 'base64').toString('ascii');
}
exports.crypto = crypto;