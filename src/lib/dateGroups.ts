export interface DateGroup<T> {
  label: "Today" | "Yesterday" | "This Week" | "Older";
  items: T[];
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function groupByDate<T>(items: T[], getDate: (item: T) => string | Date): DateGroup<T>[] {
  const today = startOfDay(new Date());
  const yesterday = today - 86400000;
  const weekAgo = today - 7 * 86400000;

  const buckets: Record<DateGroup<T>["label"], T[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  for (const item of items) {
    const date = new Date(getDate(item));
    const day = startOfDay(date);

    if (day === today) buckets.Today.push(item);
    else if (day === yesterday) buckets.Yesterday.push(item);
    else if (day > weekAgo) buckets["This Week"].push(item);
    else buckets.Older.push(item);
  }

  return (["Today", "Yesterday", "This Week", "Older"] as const)
    .map((label) => ({ label, items: buckets[label] }))
    .filter((group) => group.items.length > 0);
}

export function formatFriendlyDate(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const today = startOfDay(new Date());
  const day = startOfDay(date);

  if (day === today) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  if (day === today - 86400000) {
    return "Yesterday";
  }
  if (day > today - 7 * 86400000) {
    return date.toLocaleDateString(undefined, { weekday: "long" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
