// modules =================================================
var express        = require('express');
var app            = express();
var path           = require('path');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var Excel = require('exceljs');

app.set('env', 'development');

/*if(app.get('env') == 'development') {
	var livereload = require('livereload');
	var server = livereload.createServer();
	server.watch(__dirname + "/public");
}*/

// configuration ===========================================
	
// config files
//var db = require('./config/db');

var port = process.env.PORT || 8001; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

app.get('/*', function(req, res) {
	res.sendFile('index.html', { root: __dirname + '/public' });
});

app.post('/report', (req, res) => {
	var workbook = new Excel.Workbook();
	workbook.creator = 'iCity';
	workbook.lastModifiedBy = 'iCity';
	workbook.created = new Date();
	workbook.modified = new Date();
	workbook.lastPrinted = new Date();

	var worksheet = workbook.addWorksheet('My Sheet');

	worksheet.getCell('A1').value = 'Report';
	worksheet.mergeCells('A4:C4');
	worksheet.getCell('A4').value = 'Month';

	worksheet.getCell('A1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'FFFF0000'}
	};

	workbook.xlsx.writeFile( __dirname + "/public/report/Attendance Reporting.xlsx" )
		.then(function() {
			var file = __dirname + "/public/report/Attendance Reporting.xlsx";
			res.sendFile(file)
		});

});

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app