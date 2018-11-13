/**
 * Get data from the local storage
 *
 * @param item
 */
export function getData(item: string): any {
  try {
    return JSON.parse(window.localStorage.getItem(`pipe-dream-${item}`));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Save data to the local storage
 *
 * @param item
 * @param data
 */
export function saveData(item: string, data: any) {
  try {
    window.localStorage.setItem(`pipe-dream-${item}`, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(error);
  }
}
