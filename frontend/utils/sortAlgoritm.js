export const sortArticles = (articles, sortOrder) => {
    return articles.sort((a, b) => {
      
      // const dateA = new Date(a.seendate);
      const dateA = parseCustomDate(a.seendate);
     
      //const dateB = new Date(b.seendate);
      const dateB = parseCustomDate(b.seendate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Function to parse the custom date format HH:mm/DD-MM-YYYY
export const parseCustomDate = (dateString) => {
  const [time, date] = dateString.split('/');
  const [day, month, year] = date.split('-');

  // Construct a valid ISO 8601 date string
  const isoString = `${year}-${month}-${day}T${time}:00Z`;
  
  return new Date(isoString).getTime(); // Get timestamp for comparison
};