import { Account, Users } from 'node-appwrite'


const config = { demoKey: process.env.DEMO_KEY };

console.log(config.demoKey)

const payload = JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_PAYLOAD)
const name = payload['name'];
const email = payload['email'];

const emailData = {
    from: 'Furr Buddies <app@buddies.simmons.studio>',
    to: email,
    subject: `Welcome to Furr Buddies ${name}!`,
    text: `Hello ${getFirstName(name)}\nGreat to have you!`
};


const dictionary = ['Mr','Mrs','Dr','Ms','Miss','Sir'];
// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
export const getFirstName = (fullname) => {
    // const fullname = $state.account?.name || 'Stranger'
    const namesArray = fullname.split(' '); // Split the sentence into an array of words

    if (namesArray.length > 0) {
        if(dictionary.includes(namesArray[0])){
            return namesArray[1];
        }
        return namesArray[0]; // Get the first name
    }
}