export const formatDate = (date: Date) => {
  if (!date) return '';
  return date.toLocaleString('en-US');
};

export const padStr = (i: number) => (i < 10 ? `0${i}` : `${i}`);

const oneYear = 365 * 24 * 60 * 60 * 1000;
const oneMonth = 30 * 24 * 60 * 60 * 1000;
const oneWeek = 7 * 24 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
const oneHour = 60 * 60 * 1000;
const oneMinute = 60 * 1000;
const oneSecond = 1000;

export const calculateTimeDifference = (timestamp: any): string => {
  if (!timestamp) return '';
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp.toMillis();

  if (timeDifference >= oneYear) {
    const numberOfYears = Math.floor(timeDifference / oneYear);
    return `${numberOfYears}y`;
  }
  if (timeDifference >= oneMonth) {
    const numberOfMonths = Math.floor(timeDifference / oneMonth);
    return `${numberOfMonths}mo`;
  }
  if (timeDifference >= oneWeek) {
    const numberOfWeeks = Math.floor(timeDifference / oneWeek);
    return `${numberOfWeeks}w`;
  }
  if (timeDifference >= oneDay) {
    const numberOfDays = Math.floor(timeDifference / oneDay);
    return `${numberOfDays}d`;
  }
  if (timeDifference >= oneHour) {
    const numberOfHours = Math.floor(timeDifference / oneHour);
    return `${numberOfHours}h`;
  }
  if (timeDifference >= oneMinute) {
    const numberOfMinutes = Math.floor(timeDifference / oneMinute);
    return `${numberOfMinutes}m`;
  }
  if (timeDifference >= oneSecond) {
    const numberOfSeconds = Math.floor(timeDifference / oneSecond);
    return `${numberOfSeconds}s`;
  }

  return 'Just now';
};
