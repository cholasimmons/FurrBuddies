interface String {
    toTitleCase(): string;
  }
String.prototype.toTitleCase = function ():string {
    return this.charAt(0).toUpperCase() + this.substr(1);
};

export function toTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateString(string:string, wordCount:number = 18) {
    const words = string.split(' ');
    const truncatedWords = words.slice(0, wordCount);
    return truncatedWords.join(' ');
}