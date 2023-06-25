var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var sdk = require("node-appwrite");
var nodemailer = require('nodemailer');
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
function sendMail(name, email, senderEmail, senderPass) {
    console.log("New User: ".concat(name, " with ").concat(email, " has been created."));
    // Create transporter using Gmail SMTP server     
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPass
        }
    });
    // Email for Client
    var info1 = transporter.sendMail({
        from: 'app@buddies.simmons.studio',
        to: email,
        subject: 'New Furr Buddies Account created',
        text: "".concat(name, "(").concat(email, ") just created an account on our system Sir.")
    });
    // Email to Admin
    var info2 = transporter.sendMail({
        from: 'app@buddies.simmons.studio',
        to: senderEmail,
        subject: 'New Furr Buddies Account is ready',
        text: "Hello ".concat(name, ", thank you for signing up on Furr Buddies.")
    });
    // Send email
    transporter.sendMail(info1, info2, function (err, info) {
        if (err) {
            console.log('Sending mail error. ', err);
        }
        else {
            console.log('Messages sent: ' + info.response);
            console.log('Message 1 sent: %s', info1.messageId);
            console.log('Message 2 sent: %s', info2.messageId);
        }
    });
}
module.exports = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var client, data;
        return __generator(this, function (_a) {
            client = new sdk.Client();
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
            if (!req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
                !req.variables['APPWRITE_FUNCTION_API_KEY']) {
                console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
            }
            else {
                client
                    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
                    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
                    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
                    .setSelfSigned(true);
            }
            data = req.variables['APPWRITE_FUNCTION_EVENT_DATA'];
            try {
                sendMail(data.name, data.email, req.variables['SENDER_EMAIL'], req.variables['SENDER_PASSWORD']);
            }
            catch (error) {
                console.log('Could not send email. ', error);
            }
            res.json({ headers: req.headers, payload: req.payload, function_event_data: data });
            console.error(data.email, data.name);
            return [2 /*return*/];
        });
    });
};
var dictionary = ['Mr', 'Mrs', 'Dr', 'Ms', 'Miss', 'Sir'];
// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
var getFirstName = function (fullname) {
    var namesArray = fullname.split(' '); // Split the sentence into an array of words
    if (namesArray.length > 0) {
        if (dictionary.includes(namesArray[0])) {
            return namesArray[1];
        }
        return namesArray[0]; // Get the first name
    }
};
