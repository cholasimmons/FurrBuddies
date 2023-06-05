// Import Appwrite SDK
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

console.log(req.variables.SECRET);
  // Get the user ID from the function data
  const userId = JSON.parse(process.env.APPWRITE_FUNCTION_DATA).userId;

  // Get the user object
  users.get(userId).then((user) => {
    // Get the user's email and name
    let { email, name } = user;

    // Create the activation URL
    let activationUrl = `https://[HOSTNAME_OR_IP]/auth/activate?userId=${userId}`;

    // Create the email subject and body
    let subject = 'Activate your Furr Buddies account';
    let body = `
        <h1>Hey ${name}! Welcome to Furr Buddies</h1>
        <p>Please click the link below to activate your account:</p>
        <a href="${activationUrl}" target="furrBuddies">Activate Account</a>
    `;

    // Send the activation email using a custom function
    functions.createExecution('FUNCTION_ID', {
        email: email,
        subject: subject,
        body: body
    });
  })

  res.json({
    areDevelopersAwesome: true,
  });
};
