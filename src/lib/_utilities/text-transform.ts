interface String {
    toTitleCase(): string;
  }
String.prototype.toTitleCase = function ():string {
    return this.charAt(0).toUpperCase() + this.substr(1);
};

export function toTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}