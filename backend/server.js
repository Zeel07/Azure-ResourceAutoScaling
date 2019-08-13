const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json())
app.listen('5000', () => {
    console.log('server started in 5000');
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/processData', (request, response) => {
    var TSwsStart = new Date();
    TSwsStartMill = TSwsStart.getMilliseconds();
    TSwsStart = timeConverter(TSwsStart);
    console.log(TSwsStartMill);
    if (request.body.clean) {
        for (var i = 0; i < request.body.filesCount; i++) { readAllFile(request.body.filesCount); }
    }
    var TSwsEnd = new Date();
    TSwsEndMill = TSwsEnd.getMilliseconds();
    TSwsEnd = timeConverter(TSwsEnd);
    console.log(TSwsEndMill);
    var jsonString = "{\"TSwsStart\":\"" + TSwsStart + "\",\"TSwsEnd\":\"" + TSwsEnd + "\",\"ExecutionDelay\":\"" + (TSwsEndMill - TSwsStartMill) + "\"}";
    var jsonObj = JSON.parse(jsonString);
    response.send(jsonObj)
});

const fsd = require('fs');
const path = require('path');



var directoryName = './reuters_data';


function readAllFile(limit) {
    //console.log('came here')
    fs.readdir(directoryName, (directoryReadError, files) => {
        if (directoryReadError) {

            console.log(directoryReadError);
        } else {
            files.forEach((item, index) => {
                //console.log(files)
                if (index <= limit) {

                    if (item.indexOf('.sgm') != -1) {
                        fs.readFile(directoryName.concat('/', item), 'utf-8', function (fileReadError, content) {
                            if (fileReadError) {
                                console.log(fileReadError);
                            } else {
                                writeToFile(directoryName.concat('/cleaned/', 'cleaned_', item), cleanReuterFile(content));
                            }
                        });
                    }
                }
            });
        }
    });

}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var mill = a.getMilliseconds();
    var time = date + ' ' + month + ' ' + hour + ':' + min + ':' + sec + ':' + mill;
    return time;
}


function cleanReuterFile(data) {
    var str = '';
    var cleanedData = data.toString().replace(/[`~@#$%^&*()_|+\-?;:'\{\}\[\]\\]/gi, '');
    return cleanedData;
}

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (fileWriteError) => {
        if (fileWriteError) {
            console.log(fileWriteError)
        }
        else {
            //console.log(fileName, ' written');
        }
    });
}



app.post('/logData', (request, response) => {
    var directoryName = './reuters_data/logs/log.txt';
    fs.appendFile(directoryName, JSON.stringify(request.body)+"\r\n", (fileWriteError) => {
        if (fileWriteError) {
            console.log(fileWriteError)
        }
        else {
           // console.log(directoryName, ' written');
        }
    });
    response.send("logged");
});