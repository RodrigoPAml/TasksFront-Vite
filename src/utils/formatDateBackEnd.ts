export const formatDateBackEnd = (date?: string): string | undefined => {
  if (!date) {
    return undefined;
  }

  if (date.includes('/')) {
    const [day, month, year] = date.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`);
    return formattedDate.toISOString().split('T')[0];
  }

  const formattedDate = new Date(date);
  return formattedDate.toISOString().split('T')[0];
};