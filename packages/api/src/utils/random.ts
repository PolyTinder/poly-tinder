export const popRandom = <T>(array: T[]): T => {
    if (array.length === 0) throw new Error('Array is empty');
    const index = Math.floor(Math.random() * array.length);
    const element = array[index];
    array.splice(index, 1);
    return element;
};
