/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";
import { aspectRatioOptions } from "@/constants";

// Utility function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error handler function
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // Handle native JavaScript errors
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // Handle string errors
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // Handle unknown error types
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

// Placeholder loader while image is transforming
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

// Form URL query
interface FormUrlQueryParams {
  searchParams: URLSearchParams;
  key: string;
  value: string;
}

export const formUrlQuery = ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};

// Remove keys from query
interface RemoveUrlQueryParams {
  searchParams: string;
  keysToRemove: string[];
}

export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(searchParams);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// Debounce function
export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: unknown[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get image size
export type AspectRatioKey = keyof typeof aspectRatioOptions;

interface Image {
  aspectRatio?: AspectRatioKey;
  width?: number;
  height?: number;
}

export const getImageSize = (
  type: string,
  image: Image,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image[dimension] || 1000;
};

// Download image
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Clean up
    })
    .catch((error) => console.log({ error }));
};

// Deep merge objects
// Deep merge objects
// Deep merge objects
export function deepMergeObjects<T extends Record<string, any>>(
  obj1: T,
  obj2: Partial<T>
): T {
  // Handle null or undefined cases
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  // Create a new object to avoid mutating the input
  const output = { ...obj1 } as T;

  // Iterate over obj2 properties and merge
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (
        typeof value1 === "object" &&
        value1 !== null &&
        !Array.isArray(value1) &&
        typeof value2 === "object" &&
        value2 !== null &&
        !Array.isArray(value2)
      ) {
        // Recursively merge objects
        output[key] = deepMergeObjects(
          value1 as any,
          value2 as any
        ) as T[Extract<keyof T, string>];
      } else {
        // Directly assign the value from obj2
        output[key] = value2 as T[Extract<keyof T, string>];
      }
    }
  }

  return output;
}
