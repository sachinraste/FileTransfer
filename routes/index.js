exports.index = function (letters) {
	return function(req, res){
	res.render('index', { title: 'Remote System Explorer',letters:letters,dataDrives:JSON.stringify(letters)});
};
};