export function calculateAge(birthDate: Date): number {
    const currentDate = new Date();
    const ageDiffMilliseconds = currentDate.getTime() - birthDate.getTime();
    const ageDate = new Date(ageDiffMilliseconds); // Convert the age difference to a Date object
  
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Extract the year from the age Date object
  }