 // Function to format the timestamp
export const formatTimestamp = (timestamp) => {
    // Manually parse the timestamp
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(9, 11);
    const minute = timestamp.slice(11, 13);
    const second = timestamp.slice(13, 15);

    // Reformat to a valid ISO 8601 format
    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;

    // Now the Date constructor can understand it
    const date = new Date(isoString);

    // Appling custom date format
    const formattedDate = formatCustomDate(date);

    return formattedDate;
  };

  export const formatCustomDate = (date) => {
    const hours = String(date.getUTCHours()).padStart(2, "0"); // Get hours and pad with leading zero if needed
    const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Get minutes and pad with leading zero if needed
    const day = String(date.getUTCDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Get month (0-based, so +1) and pad with leading zero
    const year = date.getUTCFullYear(); // Get full year

    return `${hours}:${minutes}/${day}-${month}-${year}`;
  };