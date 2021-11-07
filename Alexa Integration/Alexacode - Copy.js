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

        let say = 'Hi,' + ' Welcome to ' + invocationName + '! How can I help you?';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
    
};

const AddExternalTask_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'AddExternalTask' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        const taskName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'TaskName');

        let say = '';

        try{
            const response = await AddExternalTask(taskName);

            if(response.body.devPlanTaskDTO.name == taskName){
                say = 'Added ' + taskName + ' to your development plan.';
            }
            else{
                say = 'Sorry wrong taskname added.'
            }

            responseBuilder
            .speak(say)
            .reprompt('try again, ' + say);
       
        }catch(error){

            responseBuilder
            .speak('Sorry, Entered a catch block, Api Call Failed')
            .reprompt('try again, ' + say);
        }

        return responseBuilder
            .getResponse();
    },
};

async function AddExternalTask(taskName){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ActivityTypeCode: "",
            CompetencyId: 0,
            CompetencyName: "",
            CompletionStatus: "0",
            DevPlanId: 0,
            DevPlanOwnerId: "D9435D2605B3D41E5C00FB464A708F1D",
            GoalPeriods: {periodId: "1UJ66JEEFFFFBMG0A1B2BJPA"},
            Id: 0,
            JobTemplateFk: null,
            Name: taskName,
            ObjectiveId: 0,
            SkillId: 0,
            SkillName: "",
            SourceType: 0
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IFVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2ODM3Njk5NTE2OTk0MSwibmJmIjowLCJpYXQiOjYzNzM2ODE2MTAwNTk1MTcxMywiYnNlc3Npb25pZCI6ImI4ZDdjMTBkOWNjOTRiN2Q5MmJjNjM5MTEzZTAwMDkyIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.5CB0C526361D79CC5DD1C3A002E05851A2E77D64736C77372A9A0E4D062E31EF'
        };
    
        const options = {                                           //For SumtotalApi
            hostname: 'au03sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Services/api/UDP/CreateEditTask?isEdit=false',
            method: 'POST',
            headers: postHeaders
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

        req.write(postData);
        req.end();
    });

    console.log(response);
    return response;
}


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
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiQWRtaW4iLCJhdWQiOiJBVTA4X1NBTEVTX1RFU1QiLCJleHAiOjYzNzM0NzMzMzc2NzAyNDY0OSwibmJmIjowLCJpYXQiOjYzNzM0NzExNzc3NTc3NDUwMSwiYnNlc3Npb25pZCI6ImU1YzcxZDJjZTM5NzRiNTlhMmEzYTM3MTA0NmJlZDA5IiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiIxIiwiZ3Vlc3RhY2NvdW50IjowLCJwZXJzb25pZCI6LTEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.3C8EBA7638BD9D5EB64A45FA7AEA0F8D812E6A84C8B87AB77E07B10F55D1948A'
        };
    
        const options = {  //For SumtotalApi
            hostname: 'au08sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Services/api/UDP/GetDevPlanTasks',
            method: 'POST',
            //body: body,
            headers: postHeaders
        };

        // const options = {    //For My API
        //     hostname: 'q3uazq516c.execute-api.ap-south-1.amazonaws.com',
        //     port: 443,
        //     path: '/APITest',
        //     method: 'GET',
        // };

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

        req.write(postData);

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
    AddExternalTask_Handler,
    LaunchRequest_Handler
  )
  .lambda();


  
// const options = {    //For My API
//     hostname: 'q3uazq516c.execute-api.ap-south-1.amazonaws.com',
//     port: 443,
//     path: '/APITest',
//     method: 'GET',
// };