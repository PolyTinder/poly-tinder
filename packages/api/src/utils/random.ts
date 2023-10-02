import { RandomSeed } from 'random-seed';

export const popRandom = <T>(array: T[], rand?: RandomSeed): T => {
    if (array.length === 0) throw new Error('Array is empty');
    const index = rand
        ? rand.intBetween(0, array.length - 1)
        : Math.floor(Math.random() * array.length);
    const element = array[index];
    array.splice(index, 1);
    return element;
};
