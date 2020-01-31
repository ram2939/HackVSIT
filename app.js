var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport=require("passport");
var methodOverride= require("method-override");
var path = require('path');
const papa = require('papaparse');
const fs = require('fs');


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
	res.sendFile(path.join(__dirname + '/Report.html'));
});

app.get("/getCities", function(req,res) {
	var parsedData;
	var cityNames = [];
	const c = fs.readFileSync(path.resolve(__dirname, "data/crime.csv"), 'utf8');
	papa.parse(c,{header: false,worker: true, complete: function(results, file) {
		parsedData = results.data;
	}});
	var i=1;
	while(i<parsedData.length) {
		cityNames.push(parsedData[i][0]);
		i++;
	}
	res.json({
		"citys": cityNames
	});


});

app.listen(3000, function(){
    console.log("Ehtihaad Bartein ~(^_^)~");

});
