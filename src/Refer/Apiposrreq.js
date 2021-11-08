
const https = require('https')

async function fetchAllTasks(){
    
    const body = JSON.stringify({
        DevelopmentPlanId: 90
    });

    const header = {
        'Content-Type': 'application/json; charset=utf-8',
        'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiYWRtaW4iLCJhdWQiOiJBVTAxX1NBTEVTX1RFU1QiLCJleHAiOjYzNzI0ODM4OTc4MjMyNjQ5OCwibmJmIjowLCJpYXQiOjYzNzI0ODE3Mzc5Nzk1MTI4OSwiYnNlc3Npb25pZCI6IjBkODQzMjk2YTg5MTQ0MzU5MjBlYzkwZDI3ZTUyZDAxIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiIxIiwiZ3Vlc3RhY2NvdW50IjowLCJwZXJzb25pZCI6LTEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.1669E5E14712CE05452B19BE423D55E4AF36EAA0A0C87004BD3B60A1A6CF455B'
    };

    const options = {
        hostname: 'https://au01sales.sumtotaldevelopment.net',
        port: 443,
        path: '/Services/api/UDP/GetDevPlanTasks',
        method: 'POST',
        body: body,
        headers: header
    };

    const response = await new Promise((resolve, reject) => {

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
            reject({
                statusCode: 500,
                body: 'Something went wrong!'
            });
        });        
    });

    console.log(response);
    return response;
}

