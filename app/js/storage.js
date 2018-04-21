function getData(item) {
  try {
    const data = JSON.parse(localStorage.getItem(item));
    return data;
  } catch (error) {
    console.error(error);
  }
}

function saveData(item, data) {
  try {
    localStorage.setItem(item, JSON.stringify(data));
    return data;
  } catch (error) {
  	console.error(error);
  }
}
