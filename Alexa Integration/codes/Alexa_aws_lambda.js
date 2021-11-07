const Alexa = require('ask-sdk-core');
const https = require('https');
const invocationName = "sum total";

const LaunchRequest_Handler =  {
    
    canHandle(handlerInput) {
        
        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Hi,' + ' Welcome to ' + invocationName + ' ! As of now, I can open development plan for you. How can I help you?';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
    
};

const NavigateToDevPlan_Handler = {
    
    canHandle(handlerInput) {
        
        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'NavigateToDevPlan';
    },
    handle(handlerInput) {
        
        const responseBuilder = handlerInput.responseBuilder;
        
        let say = 'Development plan opened Successfully! I can help you with listing out all your development plan tasks, What would you like me to do? ';   

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const ListAllTasksIntent_Handler =  {
    
    canHandle(handlerInput) {
        
        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'ListAllTasksIntent' ;
    },
    async handle(handlerInput) {

        const responseBuilder = handlerInput.responseBuilder;
        
        let say = 'Sure, here is the list of all task in your development plan: ';
        try{
            const response = await fetchAllTasks();

            response.body.forEach(ele => {
                say += ele.name + ', ';
            });

            responseBuilder
            .speak(say)
            .reprompt('try again, ' + say);
       
        }catch(error){

            responseBuilder
            .speak('Sorry, Entered a catch block')
            .reprompt('try again, ' + say);
        }

        return responseBuilder
            .getResponse();
    },
};


const TaskStatusIntent_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'TaskStatusIntent' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        //const taskName = handlerInput.requestEnvelope.intent.slots.taskname.value;

        const taskName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'taskname');

        let say = '';

        try{
            const response = await fetchAllTasks();

            let found = false;

            response.body.forEach(ele => {
                if(ele.name.toLowerCase() == taskName.toLowerCase()){
                    say += 'Hi, status of your task, ';
                    say += taskName + ',  is : ';
                    say += ele.completionStatusCodeText;
                    found = true;
                }
            });

            if(found == false){
                say += 'Sorry! Task name is Incorrect!';
            }

            responseBuilder
            .speak(say)
            .reprompt('try again, ' + say);
       
        }catch(error){

            responseBuilder
            .speak('Sorry, Entered a catch block')
            .reprompt('try again, ' + say);
        }

        return responseBuilder
            .getResponse();
    },
};


async function fetchAllTasks(){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            DevelopmentPlanId: 90
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiYWRtaW4iLCJhdWQiOiJBVTE1X1NBTEVTX1RFU1QiLCJleHAiOjYzNzI0ODgxNjg1OTg5NTUzMCwibmJmIjowLCJpYXQiOjYzNzI0ODYwMDg2NDQyNjc3NywiYnNlc3Npb25pZCI6Ijg2Y2I3ZmVkY2JhNDQwZWZhN2Y3ZWNlOWY2MzRiOWRlIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiIxIiwiZ3Vlc3RhY2NvdW50IjowLCJwZXJzb25pZCI6LTEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.47ED678D4A00F2DF5F07355955FFDD9BEC3386EE4257ABFC452607B65F8A5408'
        };
    
        const options = { 
            //For Sumtotal Api
            hostname: 'au15sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Services/api/UDP/GetDevPlanTasks',
            method: 'POST',
            headers: postHeaders

               // For My API
            // hostname: 'q3uazq516c.execute-api.ap-south-1.amazonaws.com',
            // port: 443,
            // path: '/APITest',
            // method: 'GET',
        };


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

        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: 'Something went wrong!'
            });
        });

        req.write(postData); //Only For POST Apis

        req.end();
          
    });

    console.log(response);
    return response;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    TaskStatusIntent_Handler,
    ListAllTasksIntent_Handler,
    NavigateToDevPlan_Handler,
    LaunchRequest_Handler
  )
  .lambda();

