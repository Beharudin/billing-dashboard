import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const meridiem = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours}:${minutes} ${meridiem}`;

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const shortDateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "2-digit",
  };
  const shortDate = date.toLocaleDateString("en-US", shortDateOptions);

  return {
    time: formattedTime,
    date: formattedDate,
    shortDate,
  };
};

export const isActivePath = (pathname: string, base: string, target: string) =>
  target === base
    ? pathname === target
    : pathname.startsWith(base) && pathname.startsWith(target);

export function getInitials(fullName: string): string {
  const words = fullName?.trim().split(/\s+/); // Split on whitespace (one or more spaces)

  if (words?.length === 1) {
    return words[0].charAt(0).toUpperCase(); // Take first letter for single word, uppercase
  } else {
    return words
      ?.slice(0, 2) // Take first two words
      .map((word) => word.charAt(0).toUpperCase()) // Take first letter of each word, uppercase
      .join(""); // Combine initials
  }
}

// Regex patterns for validation
export const phoneRegex = /^(0|251)(9|7)\d{8}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const bankAccountRegex = /^\d{13}$/;

/**
 * Utility function to determine the appropriate pathname for a parent menu item
 * based on user permissions and available submenu items
 */
export const getParentMenuPathname = (
  subMenu: Array<{ pathname: string; roles?: string[] }>,
  userRole: string | undefined,
  parentPathname: string
): string => {
  // Filter submenu items that the user has permission to access
  const accessibleSubItems = subMenu.filter(
    (item) => !item.roles || item.roles.includes(userRole ?? "")
  );

  // If there are accessible submenu items, return the first one's pathname
  // Otherwise, return the parent's pathname
  return accessibleSubItems.length > 0
    ? accessibleSubItems[0].pathname
    : parentPathname;
};
