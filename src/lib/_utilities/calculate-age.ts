export function calculateAge(birthDateTime: string): number {
  
    const parsedDateTime = new Date(birthDateTime);
    const birthDate = new Date(parsedDateTime.getFullYear(), parsedDateTime.getMonth(), parsedDateTime.getDate());
    const currentDate = new Date();

    const ageDiffMonths = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 + (currentDate.getMonth() - birthDate.getMonth());
    
    return ageDiffMonths;
}

export function monthsToYears(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let result = '';
  if (years > 0) {
    result += years === 1 ? '1 year' : `${years} years`;
  }
  if (remainingMonths > 0) {
    if (result.length > 0) {
      result += ' ';
    }
    result += remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;
  }

  return result;
}