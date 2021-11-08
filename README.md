# AlexaSkillVUI
Alexa Skill VUI for SumTotal Development Plan Module

# Project Overview :
Aug-Sept 2020
Participating : SumTotal Ideathon
Co-ordinating Place : SumTotal Systems, Hyderabad

-> Alexa Skill Hosted on Amazon Developer Console for Alexa Skills calls AWS Lambda Function
    Host Address : https://developer.amazon.com

  :: Alexa Skill interacts with User as :
  - recieves audio from user, processes it into a json request to AWS Labmda function.
  - replies to user in an audio, after processing json it received from AWS Lambda function.

-> Server Side Logic Hosted on AWS Lambda Function Process Alexa Skill Requests with NodeJs 14 runtime
    Host Address : https://aws.amazon.com

  :: AWS Lambda Function calls Alexa Skill and SumTotal APIs as : 
   - receives request from alexa skill hosted on Amazon Alexa server.
   - performing actions via Post call to SumTotal APIs (authenticated by a API authheader/cookie).
   - getting response for user via Get Call to SumTotal APIs (authenticated by a API authheader/cookie).
   - sends respose to Alexa Skill hosted on Amazon Alexa Server






