import { date } from 'quasar';

export const toBR = (dateString: string) => {
  if (!dateString) return '';

  return `${dateString.slice(8, 10)}/${dateString.slice(5, 7)}/${dateString.slice(0, 4)}`;
};

// 'YYYY-MM-DDTHH:mm:ss.SSSZ'
export const formatDatetime = (dateString: string) => {
  const formattedDate = date.formatDate(dateString, 'DD/MM/YYYY');
  const formattedTime = date.formatDate(dateString, 'HH:mm');
  return `${formattedDate} - ${formattedTime}h`;
};

export default {
  toBR,
  formatDatetime,
};
