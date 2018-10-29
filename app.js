const createError = require('http-errors');
const log4js = require('log4js');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(2018);

app.post('/snap', (req, res) => {

    let logger = log4js.getLogger('webrtc');
    let params = req.params;

    try {
        logger.debug(req.rawBody);
        let base64Data = req.rawBody.replace(/^data:image\/png;base64,/, '');
        logger.debug(base64Data);

        let result = 'ok';
        fs.writeFile(`./dist/cap-${params.id || 'noId'}.png`, base64Data, 'base64', (err) => {
            logger.error(err);
            result = err;
        });

        res.send(result);
    } catch (ex) {
        logger.error(ex);
        res.send(ex);
    }
});

module.exports = app;
