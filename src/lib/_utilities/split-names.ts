const dictionary = ['Mr','Mrs','Dr','Ms','Miss','Sir'];

// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
export const splitNames = (fullname: string) => {
    // const fullname = $state.account?.name || 'Stranger'
    const namesArray = fullname.split(" "); // Split the sentence into an array of words

    if (namesArray.length >= 1) {
        if(dictionary.includes(namesArray[0])){
            return namesArray[1];
        }
        return namesArray[0]; // Get the first name
    }
}