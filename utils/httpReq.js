const fetchData = async () => {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default fetchData;
