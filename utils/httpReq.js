const fetchData = async () => {
  const res = await fetch("questions.json");
  const json = await res.json();
  return json;
};
export { fetchData };
