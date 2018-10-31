const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    console.log('---catch 404: ', req, res)
    next(createError(404));
});

app.all('*', function (req, res, next) {
    next();
});

// error handler
app.use((err, req, res, next) => {
    console.log('---error handler: ', err, req, res)
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(2018);

app.post('/snap', (req, res) => {
    console.log('---post snap: ', req, res)
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    let params = req.params;

    try {
        console.log(req.rawBody);
        let base64Data = req.rawBody.replace(/^data:image\/png;base64,/, '');
        console.log(base64Data);

        let result = 'ok';
        fs.writeFile(`./dist/cap-${params.id || 'noId'}.png`, base64Data, 'base64', (err) => {
            console.log(err);
            result = err;
        });

        res.send(result);
    } catch (ex) {
        console.log(ex);
        res.send(ex);
    }
});

module.exports = app;
