module.exports = (app) => {
	app.get('/', (req, res) => {
		res.render('index');
	});
	app.get('/login', (req, res) => {
		res.send('login页面');
	});
};
