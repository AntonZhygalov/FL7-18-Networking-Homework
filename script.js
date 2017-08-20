const express = require('express')
const app = express()
const fs = require('fs');
const crypto = require('crypto');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/users', function(req, res) {
    fs.readFile('storage.json', function(err, data) {
        if (err) console.log(err);

        var myData;
        var id = 0;
        var exist = false;

        if (data.length === 0) {
            myData = [];
        } else {
            myData = JSON.parse(data);
            for (var i = 0; i < myData.length; i++) {
                if (myData[i].email === req.body.email) {
                    exist = true;
                    res.status(409).send('User with this email already exists');
                    break;
                }
                id = myData[i].id;
            }
        }


        if (!exist && req.body.username) {
            req.body.id = id + 1;
            req.body.password = crypto.createHmac('sha256', req.body.password).digest('hex');
            myData.push(req.body);
            fs.writeFile('storage.json', JSON.stringify(myData, null, 2), function(err) {
                if (err) console.log(err);
                res.status(201).send('all good');
            })
        } else res.status(400).send();
    });
})


app.get('/users', function(req, res) {

    fs.readFile('storage.json', function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        var myData = ['[]'];
        if (data.length >= 1) {
            myData = JSON.parse(data);
            for (var i = 0; i < myData.length; i++) {
                delete myData[i].password;
            }
            res.status(200).send(myData);
        } else res.status(200).send(myData);

    });
})

app.get('/users/:id', function(req, res) {
    fs.readFile('storage.json', function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        if (data.length === 0) {
            res.status(404).send('Not found');
        } else {
            var myData = JSON.parse(data);
            var user;
        }
        for (var i = 0; i < myData.length; i++) {
            if (myData[i].id === parseInt(req.params.id)) {
                user = myData[i];
                delete user.password;
            }
        }
        if (user) {
            res.status(200).send(user)
        } else res.status(404).send('Not found');

    });
})

app.put('/users/:id', function(req, res) {
    fs.readFile('storage.json', function(err, data) {
        if (err) console.log(err);

        if (data.length === 0) {
            res.status(404).send('Not found');
        } else {
            var myData = JSON.parse(data);
            var user;
        }
        for (var i = 0; i < myData.length; i++) {
            if (myData[i].id === parseInt(req.params.id)) {
                myData[i] = req.body;
                myData[i].id = parseInt(req.params.id);
                myData[i].password = crypto.createHmac('sha256', req.body.password).digest('hex');
                fs.writeFile('storage.json', JSON.stringify(myData, null, 2), function(err) {
                    if (err) console.log(err);

                })
                user = myData[i];
                delete user.password;
                res.status(200).send(user);
                break;
            }
        }
        if (!user) {
            res.status(404).send('Not found');
        }

    });
})

app.delete('/users/:id', function(req, res) {
    fs.readFile('storage.json', function(err, data) {
        if (err) console.log(err);

        if (data.length === 0) {
            res.status(404).send('Not found');
        } else {
            var myData = JSON.parse(data);
            var user = false;
        }
        for (var i = 0; i < myData.length; i++) {
            if (myData[i].id === parseInt(req.params.id)) {
                myData.splice(i, 1);
                fs.writeFile('storage.json', JSON.stringify(myData, null, 2), function(err) {
                    if (err) console.log(err);
                })
                user = true;

                res.status(200).send({"message": "User has been successfully removed."});
                break;
            }
        }
        if (!user) {
            res.status(404).send('Not found');
        }
    });
})

app.listen(3000, function() {
    console.log('Start server on port 3000!')
})