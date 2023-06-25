const sdk = require("node-appwrite");
const nodemailer = require('nodemailer');

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/
// Appwrite email function
function sendMail(name, email, senderEmail,senderPass){
  console.log(`New User: ${name} with ${email} has been created.`);

  // Create transporter using Gmail SMTP server     
  let transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: senderEmail,  
      pass: senderPass  
    }
  });

  // Email for Client
  let info1 = transporter.sendMail({
    from: 'app@buddies.simmons.studio', 
    to: email,  
    subject: 'New Furr Buddies Account created', 
    text: `${name}(${email}) just created an account on our system Sir.`
  });

  // Email to Admin
  let info2 = transporter.sendMail({
    from: 'app@buddies.simmons.studio', 
    to: senderEmail,  
    subject: 'New Furr Buddies Account is ready', 
    text: `Hello ${name}, thank you for signing up on Furr Buddies.`
  });

  // Send email
  transporter.sendMail(info1, info2, function(err, info){
    if (err) {
      console.log('Sending mail error. ',err)  
    } else {
      console.log('Messages sent: ' + info.response)  

      console.log('Message 1 sent: %s', info1.messageId);
      console.log('Message 2 sent: %s', info2.messageId);
    }
  })
}

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  // const account = new sdk.Account(client);
  // const avatars = new sdk.Avatars(client);
  // const database = new sdk.Databases(client);
  // const functions = new sdk.Functions(client);
  // const health = new sdk.Health(client);
  // const locale = new sdk.Locale(client);
  // const storage = new sdk.Storage(client);
  // const teams = new sdk.Teams(client);
  // const users = new sdk.Users(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  const data = req.variables['APPWRITE_FUNCTION_EVENT_DATA']

  try {
    sendMail(data.name, data.email, req.variables['SENDER_EMAIL'], req.variables['SENDER_PASSWORD']);
  } catch (error) {
    console.log('Could not send email. ',error);
  }

  res.json({headers: req.headers, payload: req.payload, function_event_data: data});
  console.error(data.email, data.name);

};

const dictionary = ['Mr','Mrs','Dr','Ms','Miss','Sir'];
// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
const getFirstName = (fullname) => {

    const namesArray = fullname.split(' '); // Split the sentence into an array of words

    if (namesArray.length > 0) {
        if(dictionary.includes(namesArray[0])){
            return namesArray[1];
        }
        return namesArray[0]; // Get the first name
    }
}