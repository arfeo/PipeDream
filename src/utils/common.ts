export const randomNum = (min = 1, max = 1): number => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const sortArrayByKey = (arr: any, key: string): any => {
  const buffer = arr;

  buffer.sort((a: any, b: any) => {
    return b[key] - a[key];
  });

  return buffer;
};

export const wait = (ms = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
