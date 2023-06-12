const dictionary = ['Mr','Mrs','Dr','Ms','Miss','Sir'];

// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
export const getFirstName = (fullname: string) => {
    // const fullname = $state.account?.name || 'Stranger'
    const namesArray = fullname.split(' '); // Split the sentence into an array of words

    if (namesArray.length > 0) {
        if(dictionary.includes(namesArray[0])){
            return namesArray[1];
        }
        return namesArray[0]; // Get the first name
    }
}

// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
export const removePrefix = (fullname: string) => {
    const namesArray = fullname.split(" "); // Split the names into an array of words

    if (namesArray.length > 1) {
        if(dictionary.includes(namesArray[0])){
            const newArray = namesArray.slice(0,1);
            const names = newArray.join(' ');
            return names.trim();
        }
        return fullname; // Return original full names
    }
}