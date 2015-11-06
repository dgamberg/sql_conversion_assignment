var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/sql_lecture';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// Get all the people information
app.get('/data', function(req,res){
    var results = [];

    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT id, name, location FROM people ORDER BY name ASC");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

app.get('/find', function(req, res){

        var results = [];
        console.log("find this:", req.query.peopleSearch);

        //SQL Query > SELECT data from table
        pg.connect(connectionString, function (err, client, done) {
            //var q = "SELECT name FROM people WHERE name LIKE '" + req.query.peopleSearch + "%'";
            //console.log(q);
            var query = client.query("SELECT * FROM people WHERE name LIKE '" + req.query.peopleSearch + "%'");

            // Stream results back one row at a time, push into results array
            query.on('row', function (row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                client.end();
                return res.json(results);
            });

            // Handle Errors
            if (err) {
                console.log("FIND ERROR", err);
            }
        });
});
//    pg.connect(connectionString, function (err, client) {
//        client.query("SELECT name FROM people WHERE name LIKE " + req.query + "%"),
//            function(err, result) {
//                if(err) {
//                    console.log("Error reading data: ", err);
//                    res.send(false);
//                }
//                res.send(true);
//            }
//    });
//});





// Add a new person
app.post('/data', function(req,res){
    var addedPerson = {
        "name" : req.body.peopleAdd,
        "location" : req.body.locationAdd
    };

    pg.connect(connectionString, function (err, client) {

        client.query("INSERT INTO people (name, location, spirit_animal, address) VALUES ($1, $2, $3, $4) RETURNING id",
            [addedPerson.name, addedPerson.location, addedPerson.spirit_animal, addedPerson.address],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }

                res.send(true);
            });

    });

});

app.delete('/data', function(req,res){
    pg.connect(connectionString, function (err, client){

        client.query("DELETE FROM people WHERE id = " + req.body.id),
            function(err, result) {
                console.log("This is Result: ", result);
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                console.log("req.body.id : ", req.body.id);
                res.send(true);

            }
    });
});

app.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});