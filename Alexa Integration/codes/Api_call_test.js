const https = require('https')

async function fetchAllTasks(){

    const response = await new Promise((resolve, reject) => {    

        const body = JSON.stringify({
            DevelopmentPlanId: 90
        })

        const options = {
            hostname: 'https://au01sales.sumtotaldevelopment.net/Services/api/UDP/GetDevPlanTasks',
            port: 443,
            path: '/',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
        }

        let dataString = '';

        const req = https.request(options, function(res) {
            res.on('data', chunk => {
                dataString += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: JSON.parse(dataString)
                });
            });
        });

        req.on('error', error => {
            console.error(error)
        });        
    });
    return response;
}






  var options = {
    host :  'https://q3uazq516c.execute-api.ap-south-1.amazonaws.com/APITest',
    port : 443,
    //path : '/debug_token?input_token=' + userAccessToken + '&access_token=' + appAccessToken,
    path : '/',
    method : 'POST'
  };

  var getReq = https.request(options, function(res) {
    result = 'Begining API Call Step 3';
    console.log("\nstatus code: ", res.statusCode);
    res.on('data', function(data) {
        result = JSON.parse(data);
        result = result.name
        console.log( JSON.parse(data) );
    });
});

//end the request
getReq.end();
getReq.on('error', function(err){
    result = 'Error';
    console.log("Error: ", err);
}); 

return result;

}









function fetchDataFromSumtotalApis(requestType){
        
        //var userAccessToken = 'CAAKoIMGu5SAyfOyVhugi7cZAaZA1kHzjrdLvtPlndoKzMJ8xZBtR3YV2iX39FSnhxK1lvtfYXO5FvcbK4MVGJphxeYDZC7HJ5FCmhOr2Ys8ZBG9qYNRSfFGuzoeRgwZBdliKvoW6YPl41b8i3dfrTpR98gFAm6qag9vYM2yD0aEv47fnWQWF1SoXRs6PFFrFu5XOe';
        //var appAccessToken = '24562343562751562|hPEXIpDl0CXt0tNJ';
        var options = {
            host :  'https://q3uazq516c.execute-api.ap-south-1.amazonaws.com/APITest',
            port : 443,
            //path : '/debug_token?input_token=' + userAccessToken + '&access_token=' + appAccessToken,
            path : '/',
            method : 'GET'
        };
 
        //making the https get call
        var getReq = https.request(options, function(res) {
            result = 'Begining API Call Step 3';
            console.log("\nstatus code: ", res.statusCode);
            res.on('data', function(data) {
                result = JSON.parse(data);
                result = result.name
                console.log( JSON.parse(data) );
            });
        });
    
        //end the request
        getReq.end();
        getReq.on('error', function(err){
            result = 'Error';
            console.log("Error: ", err);
        }); 

        return result;
}






//simple
{
const https = require('https');
exports.handler = async (event) => {
    let dataString = '';
    
    const response = await new Promise((resolve, reject) => {
        const req = https.get("https://pokeapi.co/api/v2/pokemon/ditto", function(res) {
          res.on('data', chunk => {
            dataString += chunk;
          });
          res.on('end', () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify(JSON.parse(dataString), null, 4)
            });
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    
    return response;
};
}
