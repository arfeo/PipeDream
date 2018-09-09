export function getData(item: string) {
  try {
    return JSON.parse(localStorage.getItem(item));
  } catch (error) {
    console.error(error);
  }
}

export function saveData(item: string, data: any) {
  try {
    localStorage.setItem(item, JSON.stringify(data));

    return data;
  } catch (error) {
  	console.error(error);
  }
}
