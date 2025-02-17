import {format as formater} from 'date-fns';

const formatDate = (dateInput: string | Date | number, format?: string) => {
  return formater(new Date(dateInput), format ?? 'dd/MM/yyyy HH:mm');
}

export {formatDate}
