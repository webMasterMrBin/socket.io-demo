module.exports = (app) => {
	app.get('/login', (req, res) => {
		res.send('login页面');
	});
	app.get('*', (req, res) => {
		res.render('index');
	});
};
