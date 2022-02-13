function pluralize(n: number, singular: string, plural: string = ""): string {
  if (plural === "") {
    plural = `${singular}s`;
  }
  return n === 1 ? singular : plural;
}

export default function timeSince(date: Date): string {
  console.log("===== timeSince =====");
  console.log(new Date().getTime());
  console.log(date.getTime());
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  console.log(seconds);

  const years = seconds / 31536000;
  const floorYears = Math.floor(years);

  if (years > 1) {
    return `${floorYears} ${pluralize(floorYears, "year")}`;
  }

  const months = seconds / 2592000;
  const floorMonths = Math.floor(months);
  if (months > 1) {
    return `${floorMonths} ${pluralize(floorMonths, "month")}`;
  }

  const days = seconds / 86400;
  const floorDays = Math.floor(days);
  if (days > 1) {
    return `${floorDays} ${pluralize(floorDays, "day")}`;
  }

  const hours = seconds / 3600;
  const floorHours = Math.floor(hours);
  if (hours > 1) {
    return `${floorHours} ${pluralize(floorHours, "hour")}`;
  }

  const minutes = seconds / 60;
  const floorMinutes = Math.floor(minutes);
  if (minutes > 1) {
    return `${floorMinutes} ${pluralize(floorMinutes, "minute")}`;
  }

  const floorSeconds = Math.floor(seconds)
  return `${floorSeconds} ${pluralize(floorSeconds, "second")}`;
}
