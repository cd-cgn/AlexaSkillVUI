const Alexa = require('ask-sdk-core');
const https = require('https');
const { hostname } = require('os');
const invocationName = "sum total";

let hostAddress = 'au03sales.sumtotaldevelopment.net';
let userApiPath = '/Services/api/UDP/GetUnifiedDevelopmentPlan?personId=D9435D2605B3D41E5C00FB464A708F1D';
let managerApiPath = '/Services/api/UDP/GetUnifiedDevelopmentPlan?personId=8DBB73201C9F42C14C6B86431FE0077C';
let directReportsPath = '/Core/Core/api/developmentplanapi/getDirectReportsData?mgrId=8DBB73201C9F42C14C6B86431FE0077C';

let SUPERKEY = 'usr';   //'usr' for user & 'mgr' for manager


//// User Api Access Keys ////

//For GetUserInfo(GetUnifiedDevelopmentPlan)
let userSumtAuthHeader = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoibmV3IHVzZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2OTk0MDg4MzA2ODc5NywibmJmIjowLCJpYXQiOjYzNzM2OTcyNDg4NzkxMjU4MiwiYnNlc3Npb25pZCI6IjM2N2VkOWNlMGJmNzQwZjU5MDEwZTA0ZGRkMWMzNzUyIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMxNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODIsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.59712A6EAC466F002668BB6CF04DEBAC9FB92CC894EF5D25E2069932C40CD0DD';

//For SaveDevelopmentPlan & SaveApprovalStatus
let userCookie = 'culture=en-US; NSC_wt_vvx_bv_03-80=ffffffffc3a0133945525d5f4f58455e445a4a423660; Broker_WHR=urn:sumtotalsystems.com; _pk_ses.m2vrxDkMwB.1c7a=1; SumTotalSession=au03sales.sumtotaldevelopment.net=367ed9ce0bf740f59010e04ddd1c3752; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9F7D34DCDEBDE1870E16EF5F4A04B1EFD2E945C0A45BB1082884912A39044681DC7A58AEDAAE6B80544134815BE0003563D25AD40A350620C700555C964DA95FD0A9765F724FB8D07D626E3D42DC0012DC9D7091E0A95316699629CE747B03979DDAE35B9F10A73F2634FA35F15DD59E09FA33D64B418A58249B39AA0D42AB475374F727E9545C3B5DEF411AF2A5055953893145E913DD24C46F76C44173D354C3A1BA6B3F5CE8DDEB63449ACF9FA7074AE996BFEFE4B55D9E26B293C145D4ABF4752C17E2C05EBAA53FE9812466A158033AC7269F1CE2A16AE65B60F2DA1396F627323BA906E9F32B5A95DC7F45A56C8F6EE949AF73547E6B878A5913ADE8122B78FFCC32F8ACAA9B778FB49C636C956EDDB97C7B466C2F4A56EDACA8E61A0490DABDF4DFA0DF5A72E5E07251B1433D889C28E1705EC0E12CE07F302B49C71435D5C1D107462101B4EAEE2923EE6911CE505B3FB835F893C305E9AD304CE4205814AAB13A8C2995023DB1792744A7E18CBBC10C3D5D0AA31D6F470369D4B1002E6EF01D3D19A55B7542B37ACEC2FFF3959E72144EC5D03EBFFC1E88472747CB484EBE401F7BE6A3351A7283E15A66DC6935F44617D2F93C909E3DA30D97DF068F298E3BCE6B9DAEA531409C3821F7C5D84E2667067D7B55460B726A004990A271C368160A68AEA0EB20E72FEA47C20C0DF5950B054671D9563E305CC32AF07F5F3E1EB5301DBE06862919D32FEBE55EDA7398EEBA9A0FC4AF38C1AADF67E3AFFD99055AB61EB891959B8C849E71088D4B704E6BC547673F7752925BA3D6AC7AD4D437176C4411AC48AB4B190A0BFB850D7649166B9A16772D41243C83C8CC18EBFAEC8277279E257D65E7C9DCE897F278EB88CA3C8E10362B99686824181478DF6F8F7B974FB3DE9154CEF239F992F47DCD70107D4D89A5AD7ACFDA7788FE0F79F9B494504C1E76882A05D90F61074013FEE70EC2E311FF1CB5EA8B704FD0D9FC9B0A0528ADFD81BDF67BD45AB569AE4C3C77917B6D0606A8813199FFF4485A11CC4E611587C6A792617EAD29C765F9705CBBF9C50C12EB66B31E6B888B2966AE48A07150A7B179494381E082D4BFCF15EBC39B81B60197B8968322285724E1B7DBB59D5E49634BFA5E90B3C8B1084FE5FC4B8E7E618B21E4466D32389BDCBDF1A2C51394142938CA0D9036CB7EFD714377302A8E9C34F7A436FA11E779C6D959FCB0F238F225F168D92E1B0B4F6120C29265E15D0F85DDDD253100DEFB59EB83E82020139EA18EE95043C13BF25773403C8D1DADE85B0D1CF1FA003B9E61ED6CBFEFC4C5E6EC3E683FF1F53C39492BEFA611F09F44A6506C01814610598F2D07; SumtTheme=k=DEFAULT_WCAG20&v=547585637&s=905613077&u=1369438877; portalcache_v2=combinedsitemapnodehash:-2041999713&dashboardsitemaphash:119147771&themehash:729023193&dashboardhash:1789170838&webpartdefhash:639013884; SumTotalAuth=AU03_SALES_TEST=C16EBB8E2ACD890CD550D5518C758AE765F755FD989E833D7B07409FEC7D7D71354223331AD365BC2D8E8BD7C1FABE448A5588C2BDDC15CA0CFE7B982A67FE41E6CBD1EE6A3A1ABC8501226FC6CABE9FDD861017129C567AFA4C7B3BD27A89D6A7FC3F9087F89A1DCA97AC4E0F9B45BE229AF085C461F8D54B7560DD78AA5F7F1FA4B0069DA2E0DDFA992147152D5564098DA0599D3218B4E7F712E6EA37F8804B7D362AA5D7FAA489663E9AEA81C622A345FADF209345B61991E5A3FA5F6ABC6F7F50F0;';


//// Manager Api Access Keys ////

// For GetUserInfo(GetUnifiedDevelopmentPlan), fetchAllTasks(GetDevPlanTasks)
let managerSumtAuthHeader = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cuc3VtdG90YWxzeXN0ZW1zLmNvbVwvY29yZXVpIiwic3ViIjoiTmV3IE1hbmFnZXIiLCJhdWQiOiJBVTAzX1NBTEVTX1RFU1QiLCJleHAiOjYzNzM2OTk1Nzc1OTUyNTE0NiwibmJmIjowLCJpYXQiOjYzNzM2OTc0MTc2OTgzNzY1NSwiYnNlc3Npb25pZCI6IjdlYWJiZmIzOTljNzRhODQ4NTMyY2Y2NWIxZmJiMzNmIiwiZXVzcmlkIjpudWxsLCJldXNybiI6bnVsbCwiY3VsIjoiZW4tVVMiLCJ1c2VyaWQiOiI3MDMwNTEiLCJndWVzdGFjY291bnQiOjAsInBlcnNvbmlkIjoxMDE2ODEsImlzZXh0ZXJuYWwiOmZhbHNlLCJycGtleSI6IkVMSVhIUlVJIn0.606A0CA00916E0DC422806E25470A80C7176ECE1325408063BC58A739307D677';
// For getDirectReportsData, 
let managerCookie = 'NSC_wt_vvx_bv_03-80=ffffffffc3a0133e45525d5f4f58455e445a4a423660; SumTotalSession=au03sales.sumtotaldevelopment.net=7eabbfb399c74a848532cf65b1fbb33f; Broker_WHR=urn:sumtotalsystems.com; culture=en-US; SumTotalAuth_Cl=726E347B353DFAA74922B44369A5EC11EDBB2F1C19237BF5ABDA47AEE0866864B10838393E79A3472D99CC0BAE42BB9FE2CAF09CBE6989A331E2432A0789A2381A76FB194A17F3A3570844BD8CED1821D8D13DC9F097391172F7C53F6339F8598FF0E063890FBD1434C80F3BB26FB9E7E2D1EBCCD3F0B64E12D3531B4606CA5D73ABDE8828C28930DDD09683FDDD5A8D571BB9D59393FE70ED62CCA3459F289CC886CB3F8DA2F0E1008F2F8C9D52749BAFF302C0A715BDE4EF5B0BCF5DFDA7703C4F9ABF4257197546E5A21DF2213AF7EEFC1B1F0E701C5C08DA086DC9518EEBF2A305CC3D69607871430688FD7FBE0B35EBB97929C05F13AD18009603B8199942683B5BB6F4B3BE33D32E5BE6EB899063765F1A1767BB3A141306BDDABC0393BDE4FA4B67D18573142B4408826165F50B78EF8F0EC330E4551ABDA8EAAAA49CAC7753D30C6A5274924DB67D787F48D806E3B7B4E7E58861F82ECA711259E1C1D7B8EF76648595DDD9AE4318669BB4AFF89933F9C8CD1FDBB35B0A1CBAD71DD7E54E4BE35A92BF4244DEC66CA9C46C1EDAAA91584FED64B33DCAE0DE34D3B58A0F3E4DED319E8327401C0FAC1F08E6765D94F3AC5E5DF3AB0A4A9DA71B58AB8F0F8321E8FEE6BE66AFA70741D421E23D29912456E96D09ECE1A7153B6D4268BC8630C69FAE91DC45927AF0726D373E43D043234625930DB5EA61278E6F21A83DE5F63851CFF05AA11BE203A4495B1C53533BA6C91102DE67361FF47CA8DE0C754E25155AD64A6AC14285AD16AC51CF1C0DABFEC1461204B5511DEDE2306E14D03B0217B39B6E668B4258FAF145B13141C329ABB89FD8FFC5D0A77D5A61D833BDDE6D7426E03AE97CF4109A3A9333F1DA2C921DAADAF5B9D1AB31F7FE57DF970F054A615DDD71DF46FD7CDAAA618CEDBC16AF046F4C616AA2ECE698D392781DF40B228CD6E9BCE501B4DB4F46BA03EA5FB1391007CBA7482C1E7858CA98E17DF42A7087CFC7715459AA90C2DE09851AA5B17F59AFD2D72704A4E8D1A4177DC4A885C3065E41A882EDDA05127D9035B823D53ACCED452BF460B607E81E4417A51B97DA2601D38E0B5FEE497DBE487735283627348F6FAC2A9EDADBD00A31FE45CBC3423126B2A330CF8DF018C35F420AC98228ADE820F6019E10AB4DFBBCC1D804B0D3FCE6736368F7D1CAB60317C6D5284BF89662F24FE3F19844FD573E4DA7CB515551DD8366FB5534976D59E6E6D5CCC6625CE5694EB4202FCB3BFF9E230E473B20E51DCC494846F2A7942F5FA5467D40A209F3B1AD8F47B23880E426DDE25AA03AC7FBED7D1B45A90749539025847EFF1DA2FEEFC2D252043C76E1E5C9C32FCD4B71ADF630846EC3B84F03D4402750EA5820DC738CD3D835161D556ACA2F5C53BE2F5FE88C6A5C612E67D7EE85848BADBB416AA24D75D6367D389ACFD842A2; SumtTheme=k=DEFAULT_WCAG20&v=547585637&s=-1616549874&u=1228276376; portalcache_v2=combinedsitemapnodehash:-1741103601&dashboardsitemaphash:119147771&themehash:1935716664&dashboardhash:1789170838&webpartdefhash:639013884; SumTotalAuth=AU03_SALES_TEST=607A86595B244D79DD69878E28BC6240FF25DCE9EA0186A9D54C4FC4CF84F0FF845ABECA040ABBF612AA8B2D536EF5B0708A7070E424F38D1FD816A2276AABB49A8804E28776B09107D787DC9322B4A7307AEEA4289FD4190F90D207B1BAD5307B7B104F08B00C0D615362F47527E3DDD59DDCB1BEF1A11ACC418E5945343CEDABCC14CD0F60F847CBB7A08D005491BB967828E8EF08BD6CBEB3A09C6ADBBF5F0026013235EDDBCAD5AF0D820A903F130397832DB565E6578792DE07E801D5094F61493B;';


//// Global Context Variables ////

let globalContext = {
    currentId : null,
    devPlanOwnerId : null,
    devplanOwnerName: null,
    devPlanId : null,
    isUser : false,
    isManager : false,
    approveOrReject : 'reject'
};


////Invocation////

const LaunchRequest_Handler =  {
    
    canHandle(handlerInput) {
        
        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        
        const responseBuilder = handlerInput.responseBuilder;

        globalContext.currentId = null;
        globalContext.devPlanOwnerId = null;
        globalContext.devplanOwnerName = null;
        globalContext.devPlanId = null;
        globalContext.isUser = false;
        globalContext.isManager = false;
        globalContext.approveOrReject = 'reject';

        let say = '';

        try{
            let key = '';
            let apiPath = '';

            if(SUPERKEY == 'usr'){
                key = userSumtAuthHeader;
                apiPath = userApiPath;
            }
            else{
                key = managerSumtAuthHeader;
                apiPath = managerApiPath;
            }

            const response = await GetUserInfo(key, apiPath);

            if(response.statusCode != 200){
                say = "Api Call Failing with status code 500, Please ensure API keys are correct.";
            }
            else{
                say = 'Hi ' + response.body.ownerName + ', Welcome to ' + invocationName +  ' Development Plan, How can I help you?';
                globalContext.currentId = response.body.ownerId;
                globalContext.devPlanId = response.body.id;  //correct for user, updating for manager
                globalContext.devPlanOwnerId = response.body.ownerId; //correct for user, updating for manager
            }

            responseBuilder
            .speak(say)
            .reprompt('try again, ' + say);
        
        }catch(error){

            responseBuilder
            .speak('Sorry, Entered a catch block.')
            .reprompt('try again, ' + say);
        }

        return responseBuilder
            .getResponse();
    },
    
};

async function GetUserInfo(launchAuthHeader, launchApiPath){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': launchAuthHeader
        };
    
        const options = {
            hostname: hostAddress,
            port: 443,
            path: launchApiPath,
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

////User Interaction////

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
            const response = await AddExternalTask(userSumtAuthHeader,taskName);

            if(response.statusCode != 200){
                say = "Api Call Failing with status code 500, Please ensure API keys are correct.";
            }
            else{
                say = 'Taskname ' + response.body.devPlanTaskDTO.name + ', added to your development plan successfully. Do you want me to submit this devplan to your manager?';
                globalContext.isUser = true;
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

async function AddExternalTask(usrAuthHeader, taskName){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ActivityTypeCode: "",
            CompetencyId: 0,
            CompetencyName: "",
            CompletionStatus: "0",
            DevPlanId: globalContext.devPlanId,
            DevPlanOwnerId: globalContext.currentId,
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
            'sumtauth-header': usrAuthHeader
        };
    
        const options = {
            hostname: hostAddress,
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

        let say = 'Before you Submit, you might want to provide some comment to your manager?';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

////Manager Interaction////

const MyTeamDevPlan_Handler =  {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        
        return request.type === 'IntentRequest' && request.intent.name === 'MyTeamDevPlan' ;
    },
    async handle(handlerInput) {
    
        const responseBuilder = handlerInput.responseBuilder;

        let say = '';

        try{
            const response = await getDirectReportsData(managerCookie, directReportsPath); //managerCookie1

            let found = false;

            response.body.TeamDevPlanDto.forEach(ele => {
                if(ele.DevplanApprStatus == 'Pending'){
                    found = ele.PersonName;
                    globalContext.devPlanId = ele.DevPlanId;
                    globalContext.devPlanOwnerId = ele.PersonId;
                    globalContext.isManager = true;
                    globalContext.devplanOwnerName = ele.PersonName;
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

async function getDirectReportsData(mgrAccessCookie, directReportsApiPath){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'cookie' : mgrAccessCookie
        };
    
        const options = {
            hostname: hostAddress,
            port: 443,
            path: directReportsApiPath,
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
            const response = await fetchAllTasks(managerSumtAuthHeader);

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

async function fetchAllTasks(mgrAuthHeader){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            DevelopmentPlanId: globalContext.devPlanId
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'sumtauth-header': mgrAuthHeader,
        };
    
        const options = {
            hostname: hostAddress,
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

        const approveOrReject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'ApproveReject');

        globalContext.approveOrReject = approveOrReject;

        let say = 'Before you ' + approveOrReject + ', you might want to provide some comment to ' + globalContext.devplanOwnerName;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

////Saving Development plan for User/Manager////

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

            if(globalContext.isUser == true){  //User Comment

                if(comment == 'no' || comment == 'no comment'){

                    const response = await SaveDevelopmentPlan(1, userCookie);
                    const responseSecond = await SaveApprovalStatus(1, globalContext.currentId, '', userCookie);
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and submitted the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else if(comment != '' || comment != null){

                    const response = await SaveDevelopmentPlan(1, userCookie);
                    const responseSecond = await SaveApprovalStatus(1, globalContext.currentId, comment, userCookie);
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and submitted the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else{
                    say = 'Entered Else Block, failed attemp to add' + comment;
                }
            }
            else if(globalContext.approveOrReject == 'approve'){ //Manager Comment for Approval

                if(comment == 'no' || comment == 'no comment'){

                    const response = await SaveDevelopmentPlan(3, managerCookie); //managerCookie2
                    const responseSecond = await SaveApprovalStatus(3, globalContext.currentId, '', managerCookie); //managerCookie3
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and approved the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else if(comment != '' || comment != null){

                    const response = await SaveDevelopmentPlan(3, managerCookie); //managerCookie2
                    const responseSecond = await SaveApprovalStatus(3, globalContext.currentId, comment, managerCookie); //managerCookie3
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and approved the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else{
                    say = 'Entered Else Block, failed attemp to add' + comment;
                }
            }
            else{  //Manager Comment for rejection
                if(comment == 'no' || comment == 'no comment'){

                    const response = await SaveDevelopmentPlan(2, managerCookie); //managerCookie2
                    const responseSecond = await SaveApprovalStatus(2, globalContext.currentId, '', managerCookie); //managerCookie3
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and rejected the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else if(comment != '' || comment != null){

                    const response = await SaveDevelopmentPlan(2, managerCookie); //managerCookie2
                    const responseSecond = await SaveApprovalStatus(2, globalContext.currentId, comment, managerCookie); //managerCookie3
    
                    say = 'Added the comment ' + responseSecond.body.Comments + ' and rejected the development plan for ' + response.body.OwnerName + ', Successfully!';
                }
                else{
                    say = 'Entered Else Block, failed attemp to add' + comment;
                }
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

async function SaveDevelopmentPlan(approvalStatusCode, accessCookie){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ApprovalStatus: approvalStatusCode,
            CompletionStatus: "",
            Id: globalContext.devPlanId,
            OwnerId: globalContext.devPlanOwnerId, 
            PercentComplete: 0
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'cookie' : accessCookie
        };
    
        const options = {
            hostname: hostAddress,
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

async function SaveApprovalStatus(approvalStatusCode, approverId, comments, accessCookie){
    
    const response = await new Promise((resolve, reject) => {

        const postData = JSON.stringify({
            ApprovalStatusCode: approvalStatusCode,
            ApproverId: approverId,
            Comments: comments,
            Created: "",
            CreatedBy: "",
            DevPlanId: globalContext.devPlanId,
            Modified: "",
            ModifiedBy: ""
        });
    
        const postHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'cookie' : accessCookie
        };
    
        const options = {
            hostname: hostAddress,
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
    SubmissionComments_Handler,
    ApproveRejectPrompt_Handler,
    GetAllTasks_Handler,
    MyTeamDevPlan_Handler,   
    SubmitPrompt_Handler,
    AddExternalTask_Handler,
    LaunchRequest_Handler
  )
  .lambda();
