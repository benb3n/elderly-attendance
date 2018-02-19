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

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var day_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
app.post('/report', (req, res) => {
	var workbook = new Excel.Workbook();
	workbook.creator = 'iCity';
	workbook.lastModifiedBy = 'iCity';
	workbook.created = new Date();
	workbook.modified = new Date();
	workbook.lastPrinted = new Date();

	var current_date = new Date();
	var worksheet = workbook.addWorksheet('Monthly Attendance Reporting');

	worksheet.getCell('A1').value = 'Monthly Attendance Reporting: ' + months[current_date.getMonth()] + " " + current_date.getFullYear();

	var no_of_days = new Date(current_date.getFullYear(), current_date.getMonth(), 0).getDate();

	var header_length = 0;
	for(var i = 4; i <= 5; i ++){
		var r = generate_data_ws(worksheet, no_of_days, i, current_date, [])
		if(i ==4){header_length = r.length;}
		fill_up_row_data(worksheet, i, r)
	}
	worksheet.mergeCells('A4:C4');

	merge_row_w_same_column(worksheet, header_length+1)
	merge_row_w_same_column(worksheet, header_length+2)

	var data = [
		["1", "117", "#03-xxx", "Member", "F", , , 1, 1, , , 1],
		["2", "117", "#03-xxx", "Member", "F", , , 1, 1, , , 1],
		["3", "117", "#03-xxx", "Member", "F", , , 1, 1, , , 1]
	]
	var new_member = [1 , 0 , 1]

	var start_row = 6
	for (var i = 0; i < data.length; i++){
		var row = worksheet.getRow(start_row);
		row.values = data[i];
		start_row++;
		if(new_member[i] == 1){
			for(var col = 3; col < header_length; col++){
				if(row.getCell(col).value != null){
				row.getCell(col).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{argb:'00ADD8E6'}
				};
				}
			}
		}
	}

	start_row++;

	var row = worksheet.getRow(start_row)
	var row_data = [, , , ,"Total Attendance for the Day", ,]
	row.values = row_data;
	applyBorder(row, (7+no_of_days))
	
	row = worksheet.getRow(start_row+1)
	row_data = [, , , ,"Working Day", ,]
	row.values = row_data;
		
	var r = generate_data_ws(worksheet, no_of_days, start_row, current_date, row_data)
	fill_up_row_data(worksheet, i, r)
	applyBorder(row, (7+no_of_days))

	start_row += 5

	var legend_data = [
		[, , , "Month : "+months[current_date.getMonth()].toUpperCase() + " " + current_date.getFullYear() ],
		[, , , "Total # of seniors (est)" ],
		[, , , "Total # of members"],
		[, , , "Total attendance for the month"],
		[, , , "No of working days in the month"],
		[, , , "Average daily attendance"],
		[, , , "Total # of active members"],
		[, , , "% of members"],
		[, , , "% of Active members"],
	]

	for(var i = 0; i < legend_data.length; i++){
		var row = worksheet.getRow(start_row);
		row.values = legend_data[i];
		start_row++;
	}
	//worksheet.getCell("E"+start_row).value = {formula: }

	var colors = ['FFFFFF00', 'FF000000', 'FFFF0000', 'FFFFB266', 'FFADD8E6', 'FFC0C0C0', '', 'FF336600']
	var legend_names = ['moved out', 'passed away', 'Sunday', 'Public holiday', 'New Members', 'Not Registered Members', 'Hospital', 'Centre Closed']
	start_row++;
	for(var i = 0; i < 8; i++){
		worksheet.getCell("C"+start_row).fill = {
			type: 'pattern',
			pattern:'solid',
			fgColor:{argb: colors[i]}
		}
		if(colors[i] == ""){
			worksheet.getCell("C"+ start_row).value = "H"
		} 

		worksheet.getCell("E"+ start_row).value = legend_names[i];
		start_row++;
	}





	workbook.xlsx.writeFile( __dirname + "/public/report/Attendance Reporting.xlsx" )
		.then(function() {
			var file = __dirname + "/public/report/Attendance Reporting.xlsx";
			res.sendFile(file)
		});

});

function applyBorder(row, col_no){
	for(var i = 1; i <= col_no; i++){
		row.getCell(i).border = {
			top: {style:'thin'},
			left: {style:'thin'},
			bottom: {style:'thin'},
			right: {style:'thin'}
		};
	}
}

function generate_data_ws(worksheet, no_of_days, row_no, current_date, data){
	if(row_no == 4){
		var fourth_row_data = ['Month : ' + months[current_date.getMonth()] + " " + current_date.getFullYear(), , , , ,]
		for(var i = 1; i <= no_of_days; i++){
			var day = new Date(current_date.getFullYear(), current_date.getMonth(), i )
			fourth_row_data.push(day_of_week[day.getDay()])
		}
		return fourth_row_data;
	}else if(row_no == 5){
		var fifth_row_data= ["No", "Blk", "Unit No", "Name of Registered Elderly", "Gender"]
		for(var i = 1; i <= no_of_days; i++){
			var value = "" + i;
			fifth_row_data.push(value)
		}
		return fifth_row_data;
	}
	if(data.length > 0){
		var fourth_row = worksheet.getRow(4);
		var col_no = 6;
		for(var i = 1; i <= no_of_days; i++){
			var column_name = toColumnName(col_no)
			var cell = ''+column_name + row_no;
			worksheet.getCell(cell).value = { formula: "=SUM(" + column_name + "6:" + column_name +  row_no +")", result:''};
			cell = ''+column_name + (row_no+1);
			if(fourth_row.getCell(col_no).value != "Sun"){
				worksheet.getCell(cell).value = 1;
			}else{
				worksheet.getCell(cell).value = 0;
			}
			col_no++;
			
		}
		return data;
	}
	return []
}


function fill_up_row_data(worksheet, row_no, result){
	var day_row = worksheet.getRow(4);
	var row = worksheet.getRow(row_no);
	row.values = result;
	for(var i = 1; i <= result.length; i ++){
		var day = day_row.getCell(i).value;
		if(day == "Sun"){
			row.getCell(i).fill = {
				type: 'pattern',
				pattern:'solid',
				fgColor:{argb:'FFFF0000'}
			};
		}
		row.getCell(i).border = {
			top: {style:'thin'},
			left: {style:'thin'},
			bottom: {style:'thin'},
			right: {style:'thin'}
		};
	}
}

function merge_row_w_same_column(worksheet, column_number){
	var column_name = toColumnName(column_number)
	var column_range = column_name + "4:" + column_name + "5"
	worksheet.mergeCells(column_range)
	worksheet.getCell(column_name+"4").value = "TOTAL VISIT"
	worksheet.getCell(column_name+"4").alignment = { wrapText: true };
	worksheet.getCell(column_name+"4").border = {
		top: {style:'thin'},
		left: {style:'thin'},
		bottom: {style:'thin'},
		right: {style:'thin'}
	};
}

/**
 * Takes a positive integer and returns the corresponding column name.
 * @param {number} num  The positive integer to convert to a column name.
 * @return {string}  The column name.
 */
function toColumnName(num) {
	for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
	  ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
	}
	return ret;
  }

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app