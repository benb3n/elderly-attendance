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

	var current_date = new Date(); //new Date("01/01/2018");

	/********************************
	 * 1st Sheet - DAILY ATTENDANCE *
	 *********************************/
	var worksheet = workbook.addWorksheet('Current Daily Attendance Taking');
	worksheet.getCell('A1').value = 'Attendance for Date: ' + new Date().toLocaleDateString("en-US");

	//DATA
	var activities = req.body.center_activity
	var daily_attendance = req.body.daily_reporting_table_data

	var column_no = 1
	var start_row = 3
	var third_row = worksheet.getRow(3)

	var num_of_sets = Math.ceil(daily_attendance.length / 55)
	//console.log(num_of_sets)
	var grid_col = Math.ceil(daily_attendance.length / 55) * (activities.length + 2)
	//console.log(grid_col)

	//draw all the grids
	for(var i = start_row; i < 55; i++){
		var row = worksheet.getRow(i);
		applyBorder(row, grid_col)
	}

	//Set headers to the table
	for(var num = 0; num < num_of_sets; num++){
		var col = toColumnName(column_no)
		if(num > 0){
			worksheet.getCell(col+3).value = "No"
			column_no++
		}
		col = toColumnName(column_no)
		worksheet.getCell(col+3).value = "Unit No"
		column_no++
		col = toColumnName(column_no)
		worksheet.getCell(col+3).value = "Name"
		column_no++

		//Add activities to header
		for (var i = 0; i < activities.length; i++){
			col = toColumnName(column_no) + "3"
			worksheet.getCell(col).value = activities[i]
			column_no++;
		}
	}

	//Populate the table with data
	start_row = 4
	for(var i  = 0; i < daily_attendance.length; i++){
		fill_up_row_data(worksheet, start_row, daily_attendance[i])
		start_row++;
	}

	worksheet.getCell("B60").value = "Total for the Day"
	worksheet.getCell("B62").value = "(Mark 1 if present)"
	worksheet.getCell("B62").fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'FFFFFF00'}
	};
	worksheet.getCell("B63").value = "est 225 persons restricted to 2 sided paper"

	//MONTHLY ATTENDANCE
	worksheet = workbook.addWorksheet('Monthly Attendance Reporting');

	worksheet.getCell('A1').value = 'Monthly Attendance Reporting: ' + months[current_date.getMonth()] + " " + current_date.getFullYear();

	var no_of_days = new Date(current_date.getFullYear(), current_date.getMonth(), 0).getDate();

	var header_length = 0;
	for(var i = 4; i <= 5; i ++){
		var r = generate_data_ws(worksheet, no_of_days, i, current_date, [], null)
		if(i ==4){header_length = r.length;}
		fill_up_row_data(worksheet, i, r)
	}
	worksheet.mergeCells('A4:C4');

	//Fill Up TOTAL VISIT & ACTIVE MEMBER
	merge_row_w_same_column(worksheet, header_length+1, 4 ,5, "TOTAL VISIT")
	merge_row_w_same_column(worksheet, header_length+2, 4, 5, "ACTIVE MEMBER")

	var data = req.body.monthly_table

	var new_member = [1 , 0 , 1, 0 ,0 ,0 ,1 ,0]

	var start_row = 6
	var fourth_row = worksheet.getRow(4);
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

		//Color all the sunday column red in the data
		for(var col = 3; col < header_length; col++){
			if(fourth_row.getCell(col).value == "Sun"  ){
				row.getCell(col).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{argb:'FFFF0000'}
				};
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
	
	//Fill up the monthly total attendace row
	var r = generate_data_ws(worksheet, no_of_days, start_row, current_date, req.body.monthly_table_total, null)

	//fill_up_row_data(worksheet, i, r)
	applyBorder(row, (7+no_of_days))

	start_row += 5

	//Monthly Attendance Legend
	var legend_data = req.body.monthly_legend;

	for(var i = 0; i < legend_data.length; i++){
		var row = worksheet.getRow(start_row);
		row.values = legend_data[i];
		start_row++;
	}

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

	//Add in 2 rows template
	start_row +=2

	//Add back 2 header rows of the table
	var header_length = 0;
	var header_count = 0
	var init_row_header = start_row
	for(var i = start_row; i <= (start_row+1); i ++){
		var r = generate_data_ws(worksheet, no_of_days, i, current_date, [], header_count)
		if(i ==start_row){header_length = r.length;}
		fill_up_row_data(worksheet, i, r)
		header_count++;
	}
	worksheet.mergeCells('A'+start_row+':C'+start_row);

	//Fill Up TOTAL VISIT & ACTIVE MEMBER
	merge_row_w_same_column(worksheet, header_length+1, init_row_header, (init_row_header+1), "TOTAL VISIT")
	merge_row_w_same_column(worksheet, header_length+2, init_row_header, (init_row_header+1), "ACTIVE MEMBER")



	/*************************************
	 * 3rd Sheet - Summary of Attendance *
	 * ***********************************/
	worksheet = workbook.addWorksheet('Summary of Attendance');
	worksheet.getCell('A1').value = 'Summary of Attendance (by week)'
	worksheet.getCell("A1").font = { bold: true };
	worksheet.getCell('F1').value = months[new Date().getMonth()] + " " + new Date().getFullYear()
	worksheet.getCell("F1").font = { bold: true };

	//HEADERS
	worksheet.getCell('A3').value = "Dates"
	worksheet.getCell('B3').value = "Day"
	//Add activities to header
	column_no = 3
	for (var i = 0; i < activities.length; i++){
		col = toColumnName(column_no) + "3"
		worksheet.getCell(col).value = activities[i]
		column_no++;
	}

	var summary_of_attendance = [
		["1", "", "1", ""],
		["1", "1", "1", ""],
		["1", "", "1", ""],
		["3", "1", "3", "0"],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "1", "1", ""],
		["1", "", "1", "1"],
		["1", "1", "1", ""],
		["1", "", "1", ""],
		["7", "2", "7", "1"],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "1", "1", ""],
		["1", "", "1", "1"],
		["1", "1", "1", ""],
		["1", "", "1", ""],
		["7", "2", "7", "1"],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "1", "1", ""],
		["1", "", "1", "1"],
		["1", "1", "1", ""],
		["1", "", "1", ""],
		["7", "2", "7", "1"],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "", "1", ""],
		["1", "1", "1", ""],
		["1", "", "1", "1"],
		["1", "1", "1", ""],
		["1", "", "1", ""],
		["7", "2", "7", "1"],
		["31", "9", "31", "5"]
	]


	var num_of_weeks = weekCount(new Date().getFullYear(), new Date().getMonth())
	var num_of_days = daysInMonth(new Date().getMonth(), new Date().getFullYear())
	var first_day = (new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() == 0) ? 7 : new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
	
	start_row = 4
	day_counter = 1
	data_row_counter = 0
	for(var i = 0; i < num_of_weeks; i++){
		if(i == 0){
			//Populate the first week from starting day to Sunday
			counters = populateData(worksheet, start_row, day_counter, first_day, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			day_counter = counters[1]
			data_row_counter = counters[2]

			//Add the Total Row for each week
			counters = createTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			data_row_counter = counters[1]

		}else if(i == (num_of_weeks-1)){
			var start_day_of_the_last_wk = num_of_days - (num_of_days - (num_of_weeks-2) * 7 - (8-first_day)) + 1
			var last_day = (new Date(new Date().getFullYear(), new Date().getMonth(), start_day_of_the_last_wk).getDay() == 0) ? 7 : new Date(new Date().getFullYear(), new Date().getMonth(), start_day_of_the_last_wk).getDay()

			//Populate the first week from starting day to Sunday
			counters = populateData(worksheet, start_row, day_counter, last_day, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			day_counter = counters[1]
			data_row_counter = counters[2]

			//Add the Total Row for each week
			counters = createTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			data_row_counter = counters[1]

		}else{
			//Populate the first week from starting day to Sunday
			counters = populateData(worksheet, start_row, day_counter, 1, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			day_counter = counters[1]
			data_row_counter = counters[2]

			//Add the Total Row for each week
			counters = createTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance)
			start_row = counters[0]
			data_row_counter = counters[1]

		}
	}

	//draw all the grids
	var grid_col = 2 + activities.length
	for(var i = 3; i < start_row; i++){
		var row = worksheet.getRow(i);
		applyBorder(row, grid_col)
	}

	//draw all the grids
	for(var i = 1; i <= grid_col; i++){
		worksheet.getRow(start_row).getCell(i).border = {
			top: {style:'double'},
			left: {style:'thin'},
			bottom: {style:'thin'},
			right: {style:'thin'}
		};
	}

	//Add the Total Row for each week
	counters = createFinalTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance)
	start_row = counters[0]
	data_row_counter = counters[1]

	





	workbook.xlsx.writeFile( __dirname + "/public/report/Attendance Reporting.xlsx" )
		.then(function() {
			var file = __dirname + "/public/report/Attendance Reporting.xlsx";
			res.sendFile(file)
		});

});

//3rd Sheet Functions
function populateData(worksheet, start_row, day_counter, first_day, data_row_counter, activities, summary_of_attendance){
	for(var day = first_day; day <= 7; day++){
		worksheet.getCell("A"+start_row).value = day_counter;
		worksheet.getCell("A" + start_row).alignment = { vertical: 'middle', horizontal: 'center' };
		worksheet.getCell("B"+start_row).value = (day == 7) ? "Sun" : day_of_week[day];
		worksheet.getCell("B" + start_row).alignment = { vertical: 'middle', horizontal: 'center' };
		column_no = 3
		for (j = 0; j < activities.length; j++){
			col = toColumnName(column_no) + "" + start_row
			worksheet.getCell(col).value = summary_of_attendance[(data_row_counter)][j]
			worksheet.getCell(col).alignment = { vertical: 'middle', horizontal: 'center' };
			column_no++;

		}
		start_row++;
		day_counter++;
		data_row_counter++;
	}
	return [start_row, day_counter, data_row_counter]
}

function createTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance){
	var column_range = "A" + start_row +":" + "B" + start_row
	worksheet.mergeCells(column_range)
	worksheet.getCell("A" + start_row).value = "Total"
	worksheet.getCell("A" + start_row).alignment = { vertical: 'middle', horizontal: 'center' };
	worksheet.getCell("A" + start_row).font = { bold: true };
	column_no = 3
	for (var j = 0; j < activities.length; j++){
		col = toColumnName(column_no) + "" + start_row
		worksheet.getCell(col).value = summary_of_attendance[(data_row_counter)][j]
		worksheet.getCell(col).alignment = { vertical: 'middle', horizontal: 'center' };
		worksheet.getCell(col).font = { bold: true };
		column_no++
	}
	start_row++
	data_row_counter++
	return [start_row, data_row_counter]
}

function createFinalTotalRow(worksheet, start_row, day_counter, data_row_counter, activities, summary_of_attendance){
	var column_range = "A" + start_row +":" + "B" + start_row
	worksheet.mergeCells(column_range)
	worksheet.getCell("A" + start_row).value = "TOTAL"
	worksheet.getCell("A" + start_row).alignment = { vertical: 'middle', horizontal: 'center' };
	worksheet.getCell("A" + start_row).font = { bold: true };
	column_no = 3
	for (var j = 0; j < activities.length; j++){
		col = toColumnName(column_no) + "" + start_row
		worksheet.getCell(col).value = summary_of_attendance[(data_row_counter)][j]
		worksheet.getCell(col).alignment = { vertical: 'middle', horizontal: 'center' };
		worksheet.getCell(col).font = { bold: true };
		column_no++
	}
	start_row++
	data_row_counter++
	return [start_row, data_row_counter]
}

//End of 3rd Sheet Functions

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

function generate_data_ws(worksheet, no_of_days, row_no, current_date, data, header_count){
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
	}else if (header_count == 0){
		var row_data = ['Month : ' + months[current_date.getMonth()] + " " + current_date.getFullYear(), , , , ,]
		for(var i = 1; i <= no_of_days; i++){
			var day = new Date(current_date.getFullYear(), current_date.getMonth(), i )
			row_data.push(day_of_week[day.getDay()])
		}
		return row_data
	}else if (header_count == 1){
		row_data= ["No", "Blk", "Unit No", "Name of Registered Elderly", "Gender"]
		for(var i = 1; i <= no_of_days; i++){
			var value = "" + i;
			row_data.push(value)
		}
		return row_data
	}
	
	if(data.length > 0){
		var non_weekend_count = 0;
		var fourth_row = worksheet.getRow(4);
		var col_no = 6;
		for(var i = 1; i <= no_of_days+2; i++){
			var column_name = toColumnName(col_no)

			//Total Attendance of the day
			var cell = ''+column_name + row_no;
			worksheet.getCell(cell).value = data[i-1] 
			//worksheet.getCell(cell).value = { formula: "=SUM(" + column_name + "6:" + column_name +  row_no +")", result: data[i-1] };

			if(fourth_row.getCell(col_no).value == "Sun"){
				var beforeCell = ''+column_name + (row_no-1);
				worksheet.getCell(beforeCell).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{argb:'FFFF0000'}
				};
				worksheet.getCell(cell).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{argb:'FFFF0000'}
				};
			}

			//Working Day
			cell = ''+column_name + (row_no+1);
			if(i > no_of_days){
				worksheet.getCell(cell).value = non_weekend_count;
				non_weekend_count = 0;
			}else{
				if(fourth_row.getCell(col_no).value != "Sun"){
					worksheet.getCell(cell).value = 1;
					non_weekend_count++;
				}else{
					worksheet.getCell(cell).value = 0;
				}
			}
			//Color Sunday Column
			if(fourth_row.getCell(col_no).value == "Sun"){
				worksheet.getCell(cell).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{argb:'FFFF0000'}
				};
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

function merge_row_w_same_column(worksheet, column_number, start_row, end_row, data){
	var column_name = toColumnName(column_number)
	var column_range = column_name + start_row +":" + column_name + end_row
	worksheet.mergeCells(column_range)
	worksheet.getCell(column_name + start_row).value = data
	worksheet.getCell(column_name + start_row).alignment = { wrapText: true };
	worksheet.getCell(column_name + start_row).border = {
		top: {style:'thin'},
		left: {style:'thin'},
		bottom: {style:'thin'},
		right: {style:'thin'}
	};
}

function weekCount(year, month_number) {
    // month_number is in the range 1..12
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);
    var used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
}

// Month here is 1-indexed (January is 1, February is 2, etc). This is
// because we're using 0 as the day so that it returns the last day
// of the last month, so you have to add 1 to the month number 
// so it returns the correct amount of days
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
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