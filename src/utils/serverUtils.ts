// utils/filters.ts

/**
 * Removes empty, null, undefined, and empty array values from filter object
 * Only includes truthy values and non-empty arrays in the result
 *
 * @param filters - Object containing filter key-value pairs
 * @returns Cleaned filter object with only valid values
 *
 * @example
 * checkFilters({ date: "29.10.2025", period: "", location: null })
 * // Returns: { date: "29.10.2025" }
 */
export function checkFilters(
    filters: Record<string, any>,
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
        // Skip if key is falsy
        if (!key) continue;

        // Skip if value is null or undefined
        if (value == null) continue;

        // Skip empty strings
        if (typeof value === "string" && value.trim() === "") continue;

        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) continue;

        // Include all other values (including 0, false if needed)
        result[key] = value;
    }

    return result;
}

// Example usage in your API calls:
/*
const filters = {
    date: "29.10.2025",
    period: "",  // Will be excluded
    organization_id: "",  // Will be excluded
};

const cleanFilters = checkFilters(filters);
// Result: { date: "29.10.2025" }

// Then send to API:
const response = await getOrdersData(cleanFilters);
*/
