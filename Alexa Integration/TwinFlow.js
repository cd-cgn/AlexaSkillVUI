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

//User Interaction

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
                say = 'Entered Else Block, failed attemp to add' + taskName;
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
            DevPlanId: 182,
            DevPlanOwnerId: "D9435D2605B3D41E5C00FB464A708F1D",
            GoalPeriods: [{periodId: "1UJ66JEEFFFFBMG0A1B2BJPA"}],
            Id: 0,
            JobTemplateFk: null,
            Name: taskName,
            ObjectiveId: 466,
            SkillId: 0,
            SkillName: "",
            SourceType: 0
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IFVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2ODk4MzgxOTg0MTA4NCwibmJmIjowLCJpYXQiOjYzNzM2ODc2NzgyMzkwMzUyMCwiYnNlc3Npb25pZCI6ImM5YjdkYTczYjc3OTRhYTQ5MjI2MzI3ZDQ5YjU1OTA5IiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.576184D842CF5200591234299D98F86387B9D474D187280C6A48C8BFD4D57C11'
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

const SubmitPrompt_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'SubmitPrompt' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Do you want to provide any comment?';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const SubmissionComments_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'SubmissionComments' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        const comment = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Comment');

        let say = '';

        try{

            if(comment == 'no' || comment == 'no comment'){
                const response = await SaveDevelopmentPlan();
                const responseSecond = await SaveApprovalStatus(comment);

                say = 'Added this comment ' + responseSecond.body.Comments + ' to your development plan.';
            }
            else if(comment != '' || comment != null){
                const response = await SaveDevelopmentPlan();
                const responseSecond = await SaveApprovalStatus(comment);

                say = 'Added this comment ' + responseSecond.body.Comments + ' to your development plan.';
            }
            else{
                say = 'Entered Else Block, failed attemp to add' + comment;
            }

            responseBuilder
            .speak(say)
            .reprompt('try again, ' + say);
       
        }catch(error){

            responseBuilder
            .speak('Sorry, Entered a catch block, Post Api Call Failed')
            .reprompt('try again, ' + say);
        }

        return responseBuilder
            .getResponse();
    },
};

// async function SaveDevelopmentPlan(){
    
//     const response = await new Promise((resolve, reject) => {

//         const postData = JSON.stringify({
//             ApprovalStatus: "1",
//             CompletionStatus: "",
//             Id: 182,
//             OwnerId: "D9435D2605B3D41E5C00FB464A708F1D",
//             PercentComplete: 0
//         });
    
//         const postHeaders = {
//             'Content-Type': 'application/json; charset=utf-8',
//             'Content-Length': Buffer.byteLength(postData, 'utf8'),
//             'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IFVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2ODk4MzgxOTg0MTA4NCwibmJmIjowLCJpYXQiOjYzNzM2ODc2NzgyMzkwMzUyMCwiYnNlc3Npb25pZCI6ImM5YjdkYTczYjc3OTRhYTQ5MjI2MzI3ZDQ5YjU1OTA5IiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.576184D842CF5200591234299D98F86387B9D474D187280C6A48C8BFD4D57C11',
//             'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; SumTotalSession=au03sales.sumtotaldevelopment.net=c9b7da73b7794aa49226327d49b55909; Broker_WHR=urn:sumtotalsystems.com; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A23830AE5E02D69AF0A7A7E919C1CE8BC1DE85B4973464618B8A145519553770FA14643CCD5E7E052FAA498E7D08F24854D5D3096616A8416FA86E8282CE62B74A279E4825CBC87288C5F86F41F91E932188501C5D745B89845F89B00768CF9EDFCE9C7183AA915B8BF20668F11FD5C1F0F9D164BFC4CC9C41748382C28619A68864DD9F23977B13AFFBB00D9D0EEBFC78E0DE9A85A0257F0CA09548527DE611B98A73D428010B0DC55235B19B1D7F8F95BA29FE8B3CFB44F125E4048F73A451C38837B6471CDA9E28A7C2E42A2738E859CC088163BEE89CB1324E053E94D14B72C0A2F4D570A10E7246524FB8FB9FE6EC2BD2C072AECEAAEC1AB6C0A2F16D06A7A6C2DD5D06B3022D64C7969DD2E37633009B8E4CBE78A34B851D392E71DA3A4B5F8ADC9F13AAAA7011905AE8A0A2F0BB91E09A08EFB7F8AE88301536BB9B958891A21E8B356A95835A074473AF501049E2B71A776ED52E24D3997DE050E40219FA2BA0182310053B074EEEC27C4B3C31ED2BAA978BE23C414F2884BC52B5F000B641E09D9CF172876BD3A684F6B09CEDB2637AFB088E7715171B5FFA68856C9B189ACF95853278499AD4234A9813E4E5943EB7E0625532B06BF4E0E3817DBAA7C7DBB6620851C77D8D56E26284C01DB6684D84E6C5E5BD08EA2497477A23366B230BFB459D562267EFCCB7B0F1463008C3D6A673D0A35C5B87BE59CE6ED6E8B4030AA99BC1880FAE35845CA2EEAE36D8A7F5CD2D42E952BE11DEA2A973CCF796466EF69975A7F50C7AD4011904FECAAA561A924A66CFF7BF4484708B6575EDE8609EFEB691CE723B7357EA7228DB44B107186D13F9ABC36D8EB9D036AB4333685F64388FA5E434393AC82EC868C0F931ACF6009424AF480FA45AF902A2F40B28006C3EEEF0F96322022C291AF9B2140F81E27568B2C8C201E10D32ADC395B4260BB726B9E14D364E3D14DC5877ECCF404A5212D89DD88EE78ED3CD6CA16F5DE8291FA68726E1BF60B94A2AD6AAED7B28F2C2CAD0638C7A80182FB7975A8CC73C7F576B4B6147DFDA0E1DDD2FB5F3A6DBE986992C1409B28F4DB91E26BFF9BEEEF078C4F928E428AFE853CDDA87B72DA31D2B00193298E2F25C6AA4FB521EB7F2E5B43CB317F4E3AFC09FDBAD323265821B2A30EFCBCEE4D9C6477A929D1754A2B768CDE674500E628D71A19BA387801CAF25A9E8AF504AB5A2130B1C753BAC6504C20A540369AC982DBF9B7F0319BBAC19569E8FB7B5ED4D2C3BA2A107FE06A163F942E1EFDA2AB508239782AB1E6CEF1C7DDD01B3168F9DB051618985EC483E5B57E2C304C20FA6D8B974014D61C37452; SumtTheme=k=DEFAULT&v=90596266&s=-900922872&u=1369438877; _pk_ses.m2vrxDkMwB.1c7a=1; portalcache_v2=combinedsitemapnodehash:1463419539&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601294225.1601219316.; SumTotalAuth=AU03_SALES_TEST=DB76784BE45D3A6D9AF286EFCA6E3965FC3C9380A0412555DD78876F7D1C341CF5D8C4382B5D5F4A0DF7D727D9EB206ACF0578E15AB726DDC0F203A1FFCF7CF5AD30E8240EB9868F24E47060BCCECE8AEFB9D592E5B0D931B34F38F003914859D74CCE6D0913906A20F2D79AAC2A3DA47815576C5B6AAF8331EE828E062B27AF9404523334E5118E796299F30584F7749546403B0277FC49A602BFDCB089BABAB1D8DDFE118CDC964C433110F28BCA2D53FDF7A93B5208F447884D693CF198E8BE70E70A'
//         };
    
//         const options = {                                           //For SumtotalApi
//             hostname: 'au03sales.sumtotaldevelopment.net',
//             port: 443,
//             path: '/Core/Core/api/developmentplanapi/SaveDevelopmentPlan',
//             method: 'POST',
//             headers: postHeaders
//         };

//         let dataString = '';

//         const req = https.request(options, function(res) {
//             res.on('data', chunk => {
//                 dataString += chunk;
//             });
//             res.on('end', () => {
//                 resolve({
//                     statusCode: 200,
//                     body: JSON.parse(dataString)
//                 });
//             });
//         });

//         req.on('error', (e) => {
//             reject({
//                 statusCode: 500,
//                 body: 'Something went wrong!'
//             });
//         });

//         req.write(postData);
//         req.end();
//     });

//     console.log(response);
//     return response;
// }

// async function SaveApprovalStatus(comment){
    
//     const response = await new Promise((resolve, reject) => {

//         const postData = JSON.stringify({
//             ApprovalStatusCode: 1,
//             ApproverId: "D9435D2605B3D41E5C00FB464A708F1D",
//             Comments: comment,
//             Created: "",
//             CreatedBy: "",
//             DevPlanId: 182,
//             Modified: "",
//             ModifiedBy: ""
//         });
    
//         const postHeaders = {
//             'Content-Type': 'application/json; charset=utf-8',
//             'Content-Length': Buffer.byteLength(postData, 'utf8'),
//             'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IFVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2ODk4MzgxOTg0MTA4NCwibmJmIjowLCJpYXQiOjYzNzM2ODc2NzgyMzkwMzUyMCwiYnNlc3Npb25pZCI6ImM5YjdkYTczYjc3OTRhYTQ5MjI2MzI3ZDQ5YjU1OTA5IiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.576184D842CF5200591234299D98F86387B9D474D187280C6A48C8BFD4D57C11',
//             'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; SumTotalSession=au03sales.sumtotaldevelopment.net=c9b7da73b7794aa49226327d49b55909; Broker_WHR=urn:sumtotalsystems.com; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A23830AE5E02D69AF0A7A7E919C1CE8BC1DE85B4973464618B8A145519553770FA14643CCD5E7E052FAA498E7D08F24854D5D3096616A8416FA86E8282CE62B74A279E4825CBC87288C5F86F41F91E932188501C5D745B89845F89B00768CF9EDFCE9C7183AA915B8BF20668F11FD5C1F0F9D164BFC4CC9C41748382C28619A68864DD9F23977B13AFFBB00D9D0EEBFC78E0DE9A85A0257F0CA09548527DE611B98A73D428010B0DC55235B19B1D7F8F95BA29FE8B3CFB44F125E4048F73A451C38837B6471CDA9E28A7C2E42A2738E859CC088163BEE89CB1324E053E94D14B72C0A2F4D570A10E7246524FB8FB9FE6EC2BD2C072AECEAAEC1AB6C0A2F16D06A7A6C2DD5D06B3022D64C7969DD2E37633009B8E4CBE78A34B851D392E71DA3A4B5F8ADC9F13AAAA7011905AE8A0A2F0BB91E09A08EFB7F8AE88301536BB9B958891A21E8B356A95835A074473AF501049E2B71A776ED52E24D3997DE050E40219FA2BA0182310053B074EEEC27C4B3C31ED2BAA978BE23C414F2884BC52B5F000B641E09D9CF172876BD3A684F6B09CEDB2637AFB088E7715171B5FFA68856C9B189ACF95853278499AD4234A9813E4E5943EB7E0625532B06BF4E0E3817DBAA7C7DBB6620851C77D8D56E26284C01DB6684D84E6C5E5BD08EA2497477A23366B230BFB459D562267EFCCB7B0F1463008C3D6A673D0A35C5B87BE59CE6ED6E8B4030AA99BC1880FAE35845CA2EEAE36D8A7F5CD2D42E952BE11DEA2A973CCF796466EF69975A7F50C7AD4011904FECAAA561A924A66CFF7BF4484708B6575EDE8609EFEB691CE723B7357EA7228DB44B107186D13F9ABC36D8EB9D036AB4333685F64388FA5E434393AC82EC868C0F931ACF6009424AF480FA45AF902A2F40B28006C3EEEF0F96322022C291AF9B2140F81E27568B2C8C201E10D32ADC395B4260BB726B9E14D364E3D14DC5877ECCF404A5212D89DD88EE78ED3CD6CA16F5DE8291FA68726E1BF60B94A2AD6AAED7B28F2C2CAD0638C7A80182FB7975A8CC73C7F576B4B6147DFDA0E1DDD2FB5F3A6DBE986992C1409B28F4DB91E26BFF9BEEEF078C4F928E428AFE853CDDA87B72DA31D2B00193298E2F25C6AA4FB521EB7F2E5B43CB317F4E3AFC09FDBAD323265821B2A30EFCBCEE4D9C6477A929D1754A2B768CDE674500E628D71A19BA387801CAF25A9E8AF504AB5A2130B1C753BAC6504C20A540369AC982DBF9B7F0319BBAC19569E8FB7B5ED4D2C3BA2A107FE06A163F942E1EFDA2AB508239782AB1E6CEF1C7DDD01B3168F9DB051618985EC483E5B57E2C304C20FA6D8B974014D61C37452; SumtTheme=k=DEFAULT&v=90596266&s=-900922872&u=1369438877; _pk_ses.m2vrxDkMwB.1c7a=1; portalcache_v2=combinedsitemapnodehash:1463419539&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601294225.1601219316.; SumTotalAuth=AU03_SALES_TEST=DB76784BE45D3A6D9AF286EFCA6E3965FC3C9380A0412555DD78876F7D1C341CF5D8C4382B5D5F4A0DF7D727D9EB206ACF0578E15AB726DDC0F203A1FFCF7CF5AD30E8240EB9868F24E47060BCCECE8AEFB9D592E5B0D931B34F38F003914859D74CCE6D0913906A20F2D79AAC2A3DA47815576C5B6AAF8331EE828E062B27AF9404523334E5118E796299F30584F7749546403B0277FC49A602BFDCB089BABAB1D8DDFE118CDC964C433110F28BCA2D53FDF7A93B5208F447884D693CF198E8BE70E70A'
//         };
    
//         const options = {                                           //For SumtotalApi
//             hostname: 'au03sales.sumtotaldevelopment.net',
//             port: 443,
//             path: '/Core/Core/api/developmentplanapi/SaveApprovalStatus',
//             method: 'POST',
//             headers: postHeaders
//         };

//         let dataString = '';

//         const req = https.request(options, function(res) {
//             res.on('data', chunk => {
//                 dataString += chunk;
//             });
//             res.on('end', () => {
//                 resolve({
//                     statusCode: 200,
//                     body: JSON.parse(dataString)
//                 });
//             });
//         });

//         req.on('error', (e) => {
//             reject({
//                 statusCode: 500,
//                 body: 'Something went wrong!'
//             });
//         });

//         req.write(postData);
//         req.end();
//     });

//     console.log(response);
//     return response;
// }

//Manager Interaction

const MyTeamDevPlan_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'MyTeamDevPlan' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Hi, ';

        try{
            const response = await getDirectReportsData();

            let found = false;

            response.body.TeamDevPlanDto.forEach(ele => {
                if(ele.DevplanApprStatus == 'Pending'){
                    found = ele.PersonName;
                }
            });

            if(found == false){
                say += 'As of now there is no new approval request in development plan';
            }
            else{
                say += found + ' has submitted his dev plan';
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

async function getDirectReportsData(){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IFVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2ODk4MzgxOTg0MTA4NCwibmJmIjowLCJpYXQiOjYzNzM2ODc2NzgyMzkwMzUyMCwiYnNlc3Npb25pZCI6ImM5YjdkYTczYjc3OTRhYTQ5MjI2MzI3ZDQ5YjU1OTA5IiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.576184D842CF5200591234299D98F86387B9D474D187280C6A48C8BFD4D57C11',
            'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; Broker_WHR=urn:sumtotalsystems.com; _pk_ses.m2vrxDkMwB.1c7a=1; SumTotalSession=au03sales.sumtotaldevelopment.net=c5c9d984b4944d93b3f4f8c48bc4b453; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A2381A76FB194A17F3A3570844BD8CED1821D8D13DC9F097391172F7C53F6339F8598FF0E063890FBD1434C80F3BB26FB9E7E2D1EBCCD3F0B64E12D3531B4606CA5D73ABDE8828C28930DDD09683FDDD5A8D571BB9D59393FE70ED62CCA3459F289CC886CB3F8DA2F0E1008F2F8C9D52749BAFF302C0A715BDE4EF5B0BCF5DFDA7703C4F9ABF4257197546E5A21DF2213AF7EEFC1B1F0E701C5C08DA086DC9518EEBF2A305CC3D69607871430688FD7FBE0B35EBB97929C05F13AD18009603B8199942683B5BB6F4B3BE33D32E5BE6EB899063765F1A1767BB3A141306BDDABC0393BDE4FA4B67D18573142B4408826165F50B78EF8F0EC330E4551ABDA8EAAAA49CAC7753D30C6A5274924DB67D787F48D8790A0CF50A9414935E2CE52AD0A63EC4C118C9F62C7AF8112FDD8867091EF34488559007D2422E12DC075B8E18C618CB0C9C10AC9647B14E295F9E7A68D6D7C7D523B6009A1EE0E8310554B4F9FDC09B1196F908AB98B06CAABED2E99DDB303716813D4B6B0E9260812774DC1EFAC363FC03B7839DEC6BB964298CCFE1C05C6747C4A834C31EACFF5F127A2B535D98868916A35BD488007F19BE943410266B9CAFCDD8914657185F12AFB3356AEC57A5B758A0F9D35AA51A22BCF54AFDFC95415E02B6A1157DD51A82B7B7F1FC857564BFD1E9D6E2C4153557457B8B54295B5CBD6AEA3F27CDA11A8523E9ABAFAF9D202DA9E66276105C35F3CD231A6F679A4584641EE9C0E2FA7649F68CADC05FCFEB19BF083E4FAB4FC813162990B2FA5041872DF9580C89FF8342D30DE11DEAA51337104EA02EEB6BBE171026BBA4834F7BE99DB6F979886F3F10B4312C65A0D9D1CCC29237A9FAB2BB9026885BE9C521E969BEE80492275072F4501E6305F5BB16F01A0B34FC0E4A3E5749623C69D527F6CB97BFCD9D4DA299FAF56DD16C305A82AE341DD14A23921340DA2FEC8C33DCA9B6BE684DD19928618EFEB10388F76EFEB0E9C97C389328D7B36333F43F67059A53B0D7D92476706CBDBAAE0A24305B0055CD9F1C8DF134ABB093A04DE0A352F8674EEDD20F33C484D890E55AB71399730901DDB8906701E0B8F6332A77EB63C3F2E2399EDBD5ED355F64FB26B0245508F0E3B372F31D4C94FCDB73CA0BBC3D38E574F14510588929E2FACFC8500D36FDE94DCBBB83F7414C03C8EE9F73AC4D3F9AE5A26E015FA488842E16E990F64DE0507EE5B80954ABE742878D53E0A0BA1A69370BC03565B7C0CBD2CC5E8CF860ACC05B800BFDEC7D8F9056DB472A2100FE7A8C14A35933BC5346E648BF5EC6461B0A9AF45B874B0AF28417860D54922003A81E38A7A8AC62EACCA1DE3FFB019413; SumtTheme=k=DEFAULT&v=90596266&s=-1825151769&u=1228276376; portalcache_v2=combinedsitemapnodehash:-1018313347&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; SumTotalAuth=AU03_SALES_TEST=81E5630F5A72EB8CC996673807BEE151CA8473DD87812B60A884440B0EEE1F3883A3F3886962023AD948BADFF5522FD547D7858EFF18551356A6AA0293666A03C0A1FDEFCD93151246F1BB16C3AD16D396BD910657107D0F443BA6C714A70312A7227AD9EFD110F43831B53095384D87FF7494F2086AD74135ED8467431D33C3B0EE69A6D1E80A4B03298632CEC47E49688027F64C67D6C346BAAB70C7BC1CA161D6D2328A54C2E2B12E50A6F9FAF07666E3D05B332B67125C96BB0BA5AFFA0F6ABCEEF4; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601295542.1601219316.'
        };
    
        const options = {                                           //For SumtotalApi
            hostname: 'au03sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Core/Core/api/developmentplanapi/getDirectReportsData?mgrId=8DBB73201C9F42C14C6B86431FE0077C',
            method: 'GET',
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

const GetAllTasks_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'GetAllTasks' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Sure, Here is the list of all tasks in his development plan : ';

        try{
            const response = await fetchAllTasks();

            response.body.forEach(ele => {
                say += ele.name + ', ';
            });

            say += '. Do you want me to approve or reject this dev plan';

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

async function fetchAllTasks(){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            DevelopmentPlanId: 182
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IE1hbmFnZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2OTEzODg0MDQzNzg4NiwibmJmIjowLCJpYXQiOjYzNzM2ODkyMjg0NTU5MzkxNiwiYnNlc3Npb25pZCI6ImM1YzlkOTg0YjQ5NDRkOTNiM2Y0ZjhjNDhiYzRiNDUzIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMwNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.E93C199F56E288843381E16452A3045CD5F6C57413EAB6FCE30D22B4C4A12A75',
            'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; Broker_WHR=urn:sumtotalsystems.com; _pk_ses.m2vrxDkMwB.1c7a=1; SumTotalSession=au03sales.sumtotaldevelopment.net=c5c9d984b4944d93b3f4f8c48bc4b453; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A2381A76FB194A17F3A3570844BD8CED1821D8D13DC9F097391172F7C53F6339F8598FF0E063890FBD1434C80F3BB26FB9E7E2D1EBCCD3F0B64E12D3531B4606CA5D73ABDE8828C28930DDD09683FDDD5A8D571BB9D59393FE70ED62CCA3459F289CC886CB3F8DA2F0E1008F2F8C9D52749BAFF302C0A715BDE4EF5B0BCF5DFDA7703C4F9ABF4257197546E5A21DF2213AF7EEFC1B1F0E701C5C08DA086DC9518EEBF2A305CC3D69607871430688FD7FBE0B35EBB97929C05F13AD18009603B8199942683B5BB6F4B3BE33D32E5BE6EB899063765F1A1767BB3A141306BDDABC0393BDE4FA4B67D18573142B4408826165F50B78EF8F0EC330E4551ABDA8EAAAA49CAC7753D30C6A5274924DB67D787F48D8790A0CF50A9414935E2CE52AD0A63EC4C118C9F62C7AF8112FDD8867091EF34488559007D2422E12DC075B8E18C618CB0C9C10AC9647B14E295F9E7A68D6D7C7D523B6009A1EE0E8310554B4F9FDC09B1196F908AB98B06CAABED2E99DDB303716813D4B6B0E9260812774DC1EFAC363FC03B7839DEC6BB964298CCFE1C05C6747C4A834C31EACFF5F127A2B535D98868916A35BD488007F19BE943410266B9CAFCDD8914657185F12AFB3356AEC57A5B758A0F9D35AA51A22BCF54AFDFC95415E02B6A1157DD51A82B7B7F1FC857564BFD1E9D6E2C4153557457B8B54295B5CBD6AEA3F27CDA11A8523E9ABAFAF9D202DA9E66276105C35F3CD231A6F679A4584641EE9C0E2FA7649F68CADC05FCFEB19BF083E4FAB4FC813162990B2FA5041872DF9580C89FF8342D30DE11DEAA51337104EA02EEB6BBE171026BBA4834F7BE99DB6F979886F3F10B4312C65A0D9D1CCC29237A9FAB2BB9026885BE9C521E969BEE80492275072F4501E6305F5BB16F01A0B34FC0E4A3E5749623C69D527F6CB97BFCD9D4DA299FAF56DD16C305A82AE341DD14A23921340DA2FEC8C33DCA9B6BE684DD19928618EFEB10388F76EFEB0E9C97C389328D7B36333F43F67059A53B0D7D92476706CBDBAAE0A24305B0055CD9F1C8DF134ABB093A04DE0A352F8674EEDD20F33C484D890E55AB71399730901DDB8906701E0B8F6332A77EB63C3F2E2399EDBD5ED355F64FB26B0245508F0E3B372F31D4C94FCDB73CA0BBC3D38E574F14510588929E2FACFC8500D36FDE94DCBBB83F7414C03C8EE9F73AC4D3F9AE5A26E015FA488842E16E990F64DE0507EE5B80954ABE742878D53E0A0BA1A69370BC03565B7C0CBD2CC5E8CF860ACC05B800BFDEC7D8F9056DB472A2100FE7A8C14A35933BC5346E648BF5EC6461B0A9AF45B874B0AF28417860D54922003A81E38A7A8AC62EACCA1DE3FFB019413; SumtTheme=k=DEFAULT&v=90596266&s=-1825151769&u=1228276376; portalcache_v2=combinedsitemapnodehash:-1018313347&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; SumTotalAuth=AU03_SALES_TEST=81E5630F5A72EB8CC996673807BEE151CA8473DD87812B60A884440B0EEE1F3883A3F3886962023AD948BADFF5522FD547D7858EFF18551356A6AA0293666A03C0A1FDEFCD93151246F1BB16C3AD16D396BD910657107D0F443BA6C714A70312A7227AD9EFD110F43831B53095384D87FF7494F2086AD74135ED8467431D33C3B0EE69A6D1E80A4B03298632CEC47E49688027F64C67D6C346BAAB70C7BC1CA161D6D2328A54C2E2B12E50A6F9FAF07666E3D05B332B67125C96BB0BA5AFFA0F6ABCEEF4; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601295542.1601219316.'
        };
    
        const options = {                                           //For SumtotalApi
            hostname: 'au03sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Services/api/UDP/GetDevPlanTasks',
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

const ApproveRejectPrompt_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'ApproveRejectPrompt' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Do you want to provide any comment?';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

// const ApprovalRejectionComments_Handler =  {
//     canHandle(handlerInput) {

//         const request = handlerInput.requestEnvelope.request;
        
//         return request.type === 'IntentRequest' && request.intent.name === 'ApprovalRejectionComments' ;
//     },
//     async handle(handlerInput) {
    
//         const responseBuilder = handlerInput.responseBuilder;

//         const comment = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Comment');

//         let say = '';

//         try{

//             if(comment == 'no' || comment == 'no comment'){
//                 const response = await SaveDevelopmentPlanManager();
//                 const responseSecond = await SaveApprovalStatusManager(comment);

//                 say = 'Added this comment ' + responseSecond.body.Comments + ' and approved this dev plan';
//             }
//             else if(comment != '' || comment != null){
//                 const response = await SaveDevelopmentPlanManager();
//                 const responseSecond = await SaveApprovalStatusManager(comment);

//                 say = 'Added this comment ' + responseSecond.body.Comments + ' and approved this dev plan';
//             }
//             else{
//                 say = 'Entered Else Block, failed attemp to add' + comment;
//             }

//             responseBuilder
//             .speak(say)
//             .reprompt('try again, ' + say);
       
//         }catch(error){

//             responseBuilder
//             .speak('Sorry, Entered a catch block, Post Api Call Failed')
//             .reprompt('try again, ' + say);
//         }

//         return responseBuilder
//             .getResponse();
//     },
// };

async function SaveDevelopmentPlan(){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ApprovalStatus: "3",
            CompletionStatus: "",
            Id: 182,
            OwnerId: "D9435D2605B3D41E5C00FB464A708F1D",
            PercentComplete: 0
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IE1hbmFnZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2OTEzODg0MDQzNzg4NiwibmJmIjowLCJpYXQiOjYzNzM2ODkyMjg0NTU5MzkxNiwiYnNlc3Npb25pZCI6ImM1YzlkOTg0YjQ5NDRkOTNiM2Y0ZjhjNDhiYzRiNDUzIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMwNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.E93C199F56E288843381E16452A3045CD5F6C57413EAB6FCE30D22B4C4A12A75',
            'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; Broker_WHR=urn:sumtotalsystems.com; _pk_ses.m2vrxDkMwB.1c7a=1; SumTotalSession=au03sales.sumtotaldevelopment.net=c5c9d984b4944d93b3f4f8c48bc4b453; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A2381A76FB194A17F3A3570844BD8CED1821D8D13DC9F097391172F7C53F6339F8598FF0E063890FBD1434C80F3BB26FB9E7E2D1EBCCD3F0B64E12D3531B4606CA5D73ABDE8828C28930DDD09683FDDD5A8D571BB9D59393FE70ED62CCA3459F289CC886CB3F8DA2F0E1008F2F8C9D52749BAFF302C0A715BDE4EF5B0BCF5DFDA7703C4F9ABF4257197546E5A21DF2213AF7EEFC1B1F0E701C5C08DA086DC9518EEBF2A305CC3D69607871430688FD7FBE0B35EBB97929C05F13AD18009603B8199942683B5BB6F4B3BE33D32E5BE6EB899063765F1A1767BB3A141306BDDABC0393BDE4FA4B67D18573142B4408826165F50B78EF8F0EC330E4551ABDA8EAAAA49CAC7753D30C6A5274924DB67D787F48D8790A0CF50A9414935E2CE52AD0A63EC4C118C9F62C7AF8112FDD8867091EF34488559007D2422E12DC075B8E18C618CB0C9C10AC9647B14E295F9E7A68D6D7C7D523B6009A1EE0E8310554B4F9FDC09B1196F908AB98B06CAABED2E99DDB303716813D4B6B0E9260812774DC1EFAC363FC03B7839DEC6BB964298CCFE1C05C6747C4A834C31EACFF5F127A2B535D98868916A35BD488007F19BE943410266B9CAFCDD8914657185F12AFB3356AEC57A5B758A0F9D35AA51A22BCF54AFDFC95415E02B6A1157DD51A82B7B7F1FC857564BFD1E9D6E2C4153557457B8B54295B5CBD6AEA3F27CDA11A8523E9ABAFAF9D202DA9E66276105C35F3CD231A6F679A4584641EE9C0E2FA7649F68CADC05FCFEB19BF083E4FAB4FC813162990B2FA5041872DF9580C89FF8342D30DE11DEAA51337104EA02EEB6BBE171026BBA4834F7BE99DB6F979886F3F10B4312C65A0D9D1CCC29237A9FAB2BB9026885BE9C521E969BEE80492275072F4501E6305F5BB16F01A0B34FC0E4A3E5749623C69D527F6CB97BFCD9D4DA299FAF56DD16C305A82AE341DD14A23921340DA2FEC8C33DCA9B6BE684DD19928618EFEB10388F76EFEB0E9C97C389328D7B36333F43F67059A53B0D7D92476706CBDBAAE0A24305B0055CD9F1C8DF134ABB093A04DE0A352F8674EEDD20F33C484D890E55AB71399730901DDB8906701E0B8F6332A77EB63C3F2E2399EDBD5ED355F64FB26B0245508F0E3B372F31D4C94FCDB73CA0BBC3D38E574F14510588929E2FACFC8500D36FDE94DCBBB83F7414C03C8EE9F73AC4D3F9AE5A26E015FA488842E16E990F64DE0507EE5B80954ABE742878D53E0A0BA1A69370BC03565B7C0CBD2CC5E8CF860ACC05B800BFDEC7D8F9056DB472A2100FE7A8C14A35933BC5346E648BF5EC6461B0A9AF45B874B0AF28417860D54922003A81E38A7A8AC62EACCA1DE3FFB019413; SumtTheme=k=DEFAULT&v=90596266&s=-1825151769&u=1228276376; portalcache_v2=combinedsitemapnodehash:-1018313347&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; SumTotalAuth=AU03_SALES_TEST=5CC4C56DED27317EAB64651DE5C49F51965150B5652424036F5C3302EBFBF8811DAD51DB322092C17CCD932C9A5D6C11073289D2C60CD4BE0EF5C0CB4615AB6D8762170F2DB89E9B1D028E0713603065E2C62A4C25478BF66DB1741C7D75BF27AEDC2372FF9F8AE042190C089AD8662DB3C6B7467B430A0A807DBCB64BF6ABA45B1D6D020AB4C90E089A2BFAEF669AE43599F4B015647D0CCB7C255A94401CA2F19B91A89EA39CD650FFBFCBB15A67287E2C8D2F1C9B7F02D1A26A2DD970521EA13BA4C5; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601302184.1601219316.'
        };
    
        const options = {                                           //For SumtotalApi
            hostname: 'au03sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Core/Core/api/developmentplanapi/SaveDevelopmentPlan',
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

async function SaveApprovalStatus(comment){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ApprovalStatusCode: 3,
            ApproverId: "8DBB73201C9F42C14C6B86431FE0077C",
            Comments: comment,
            Created: "",
            CreatedBy: "",
            DevPlanId: 182,
            Modified: "",
            ModifiedBy: ""
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IE1hbmFnZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2OTEzODg0MDQzNzg4NiwibmJmIjowLCJpYXQiOjYzNzM2ODkyMjg0NTU5MzkxNiwiYnNlc3Npb25pZCI6ImM1YzlkOTg0YjQ5NDRkOTNiM2Y0ZjhjNDhiYzRiNDUzIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMwNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.E93C199F56E288843381E16452A3045CD5F6C57413EAB6FCE30D22B4C4A12A75',
            'cookie' : 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; Broker_WHR=urn:sumtotalsystems.com; _pk_ses.m2vrxDkMwB.1c7a=1; SumTotalSession=au03sales.sumtotaldevelopment.net=c5c9d984b4944d93b3f4f8c48bc4b453; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A2381A76FB194A17F3A3570844BD8CED1821D8D13DC9F097391172F7C53F6339F8598FF0E063890FBD1434C80F3BB26FB9E7E2D1EBCCD3F0B64E12D3531B4606CA5D73ABDE8828C28930DDD09683FDDD5A8D571BB9D59393FE70ED62CCA3459F289CC886CB3F8DA2F0E1008F2F8C9D52749BAFF302C0A715BDE4EF5B0BCF5DFDA7703C4F9ABF4257197546E5A21DF2213AF7EEFC1B1F0E701C5C08DA086DC9518EEBF2A305CC3D69607871430688FD7FBE0B35EBB97929C05F13AD18009603B8199942683B5BB6F4B3BE33D32E5BE6EB899063765F1A1767BB3A141306BDDABC0393BDE4FA4B67D18573142B4408826165F50B78EF8F0EC330E4551ABDA8EAAAA49CAC7753D30C6A5274924DB67D787F48D8790A0CF50A9414935E2CE52AD0A63EC4C118C9F62C7AF8112FDD8867091EF34488559007D2422E12DC075B8E18C618CB0C9C10AC9647B14E295F9E7A68D6D7C7D523B6009A1EE0E8310554B4F9FDC09B1196F908AB98B06CAABED2E99DDB303716813D4B6B0E9260812774DC1EFAC363FC03B7839DEC6BB964298CCFE1C05C6747C4A834C31EACFF5F127A2B535D98868916A35BD488007F19BE943410266B9CAFCDD8914657185F12AFB3356AEC57A5B758A0F9D35AA51A22BCF54AFDFC95415E02B6A1157DD51A82B7B7F1FC857564BFD1E9D6E2C4153557457B8B54295B5CBD6AEA3F27CDA11A8523E9ABAFAF9D202DA9E66276105C35F3CD231A6F679A4584641EE9C0E2FA7649F68CADC05FCFEB19BF083E4FAB4FC813162990B2FA5041872DF9580C89FF8342D30DE11DEAA51337104EA02EEB6BBE171026BBA4834F7BE99DB6F979886F3F10B4312C65A0D9D1CCC29237A9FAB2BB9026885BE9C521E969BEE80492275072F4501E6305F5BB16F01A0B34FC0E4A3E5749623C69D527F6CB97BFCD9D4DA299FAF56DD16C305A82AE341DD14A23921340DA2FEC8C33DCA9B6BE684DD19928618EFEB10388F76EFEB0E9C97C389328D7B36333F43F67059A53B0D7D92476706CBDBAAE0A24305B0055CD9F1C8DF134ABB093A04DE0A352F8674EEDD20F33C484D890E55AB71399730901DDB8906701E0B8F6332A77EB63C3F2E2399EDBD5ED355F64FB26B0245508F0E3B372F31D4C94FCDB73CA0BBC3D38E574F14510588929E2FACFC8500D36FDE94DCBBB83F7414C03C8EE9F73AC4D3F9AE5A26E015FA488842E16E990F64DE0507EE5B80954ABE742878D53E0A0BA1A69370BC03565B7C0CBD2CC5E8CF860ACC05B800BFDEC7D8F9056DB472A2100FE7A8C14A35933BC5346E648BF5EC6461B0A9AF45B874B0AF28417860D54922003A81E38A7A8AC62EACCA1DE3FFB019413; SumtTheme=k=DEFAULT&v=90596266&s=-1825151769&u=1228276376; portalcache_v2=combinedsitemapnodehash:-1018313347&dashboardsitemaphash:119147771&themehash:339621493&dashboardhash:1789170838&webpartdefhash:639013884; _pk_id.m2vrxDkMwB.1c7a=620886fde0b23b7a.1601217993.2.1601302184.1601219316.; SumTotalAuth=AU03_SALES_TEST=E9E46E618B24A81485B08F0F0E924C3BF112F7C56A5D84D2A15E04B3F16033D60EC154C6AD80780EC567205399617CB2B23289ACE8AE7EE5BBBDF02526349E7A69F3A1D958D1B677B4F4B7E7C700538FEBA2A407184EB6D844CC039A730CFDA646A54883304F87BB1E29898B14D57398B369CDD08CD1A52A7F796F1355D895194280A6FF7832774DEE7BA9C37B485873F0B3F1BF5B03A28B78E8ABDBF6B416BF1BF8C3C3D73E604F621FDEB24E07959622E8F848202E27C2EE9C47B1740A620A4BCCA203'
        };
    
        const options = {                                           //For SumtotalApi
            hostname: 'au03sales.sumtotaldevelopment.net',
            port: 443,
            path: '/Core/Core/api/developmentplanapi/SaveApprovalStatus',
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

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    ApprovalRejectionComments_Handler,
    ApproveRejectPrompt_Handler,
    GetAllTasks_Handler,
    MyTeamDevPlan_Handler,
    SubmissionComments_Handler,
    SubmitPrompt_Handler,
    AddExternalTask_Handler,
    LaunchRequest_Handler
  )
  .lambda();
