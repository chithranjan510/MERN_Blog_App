export const getBlogDate = (date: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const newDate = new Date(date).toLocaleDateString().split("/");

  return `${newDate[1]} ${months[Number(newDate[0]) - 1]} ${newDate[2]}`;
};
