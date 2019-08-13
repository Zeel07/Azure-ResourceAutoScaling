const fs = require('fs');
var directoryName = './reuters_data';


function readAllFile(limit) {
    console.log('came here')
    fs.readdir(directoryName, (directoryReadError, files) => {
        if (directoryReadError) {

            console.log(directoryReadError);
        } else {
            files.forEach((item, index) => {
                console.log(files)
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
            console.log(fileName, ' written');
        }
    });
}