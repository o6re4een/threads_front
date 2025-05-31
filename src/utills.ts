export const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000); // разница в секундах

  if (diff < 60) return `${diff} секунд назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} часов назад`;
  return `${Math.floor(diff / 86400)} дней назад`;
};
