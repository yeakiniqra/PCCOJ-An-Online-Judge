import { addDays, format, subDays } from "date-fns";

export function generateMockSubmissionData() {
  const today = new Date();
  const startDate = subDays(today, 364);
  const submissions = [];

  let currentDate = startDate;
  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const hasSubmissions = Math.random() < (isWeekend ? 0.3 : 0.6);

    if (hasSubmissions) {
      let count;
      const rand = Math.random();
      if (rand < 0.5) count = Math.floor(Math.random() * 3) + 1;
      else if (rand < 0.8) count = Math.floor(Math.random() * 4) + 4;
      else if (rand < 0.95) count = Math.floor(Math.random() * 5) + 8;
      else count = Math.floor(Math.random() * 10) + 13;

      submissions.push({
        date: format(currentDate, "yyyy-MM-dd"),
        count,
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  // Filter data for April and May and limit to less than 20 entries
  const filteredSubmissions = submissions.filter((submission) => {
    const month = new Date(submission.date).getMonth(); // 3 = April, 4 = May
    return month === 3 || month === 4;
  });

  return filteredSubmissions.slice(0, 20); // Limit to 20 entries
}