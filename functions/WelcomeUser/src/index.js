const sdk = require("node-appwrite");

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
  const users = new sdk.Users(client);

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

  // const name = req.payload['name'];
  // const email = payload['email'];
  let user;
  console.log(req.payload['name']);
  res.json(req.payload);

  try {
    user = await client.auth.get();

  } catch (error) {
    console.log('Could not load current user. ',error);
  }
  
  const email = user.email;

  const emailData = {
    from: 'Furr Buddies <app@buddies.simmons.studio>',
    to: email,
    subject: `Welcome to Furr Buddies ${getFirstName(user.name)}!`,
    body: `Hello ${user.name}\nGreat to have you on our app!`
  };

  try {
    await client.email.send(emailData)
  } catch (error) {
    console.log('Could not send email. ',error);
  }
  
  res.json({
    // areDevelopersAwesome: true,
    isEmailSent: true
  });
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