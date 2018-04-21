const randomNum = (min = 1, max = 1) => {
	return Math.floor(min + Math.random() * (max + 1 - min));
};

const sortArrayByKey = (arr, key) => {
    const buffer = arr;

    buffer.sort((a, b) => {
    	return b[key] - a[key];
    });

    return buffer;
};
