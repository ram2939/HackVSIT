var express = require('express');
var app = express();
var https = require('https');
var bodyParser = require('body-parser');
var passport=require("passport");
var methodOverride= require("method-override");
var path = require('path');
const papa = require('papaparse');
const fs = require('fs');

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.render("index");
});
app.get("/login", function(req, res){
	res.render("login");
});
app.get("/signup", function(req, res){
		res.render("signup");
});
app.post("/signup", function(req, res){
	res.redirect("/maps");
});
app.post("/login", function(req, res){
	res.redirect("/maps");
});
app.get("/maps", function(req, res){
	res.sendFile(path.join(__dirname + '/MapAndLoc.html'));
});

app.get("/report", function(req, res){
	res.render("report");
});

app.get("/getCities", function(req,res) {
	var parsedData;
	var cityNames = [];
	const c = fs.readFileSync(path.resolve(__dirname, "data/crime.csv"), 'utf8');
	papa.parse(c,{header: true,worker: true, complete: function(results, file) {
		parsedData = results.data;
	}});
	var i=0;
	while(i<parsedData.length) {
		cityNames.push(parsedData[i]['nm_pol']);
		i++;
	}
	res.json({
		"cities": cityNames
	});


});

app.post("/editReport", function(req,res) {
	console.log(req.body);
	var city = req.body.city;
	var parsedData;
	var found = 0;
	const c = fs.readFileSync(path.resolve(__dirname, "data/crime.csv"), 'utf8');
	papa.parse(c,{header: true,worker: true, complete: function(results, file) {
		parsedData = results.data;
	}});
	var i=0;
	while(i<parsedData.length) {
		if(parsedData[i]["nm_pol"] == city) {
			requiredIndex = i;
			var x = parseFloat(parsedData[i]["totalcrime"]);
			parsedData[i]["totalcrime"] = ++x;
			found = 1;
			const unparsed = papa.unparse(parsedData,{header: true,worker: true});
			fs.writeFileSync(path.resolve(__dirname, "data/crime.csv"),unparsed, 'utf8');
			break;
		}
		i++;
	}
	if(found==0) {
		res.status(404).json({ "result": "Error: city not found." });
	} else {
		console.log("Changed rate of "+city);
		res.json({"result":"success"});
	}
});

https.createServer({
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert')
  }, app)
  .listen(3000, function () {
	console.log("Server Started. Live at: https://localhost:3000/");
  });
