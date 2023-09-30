export class OrderedMap<K, V> {
    private readonly map: Map<K, V> = new Map<K, V>();
    private order: K[] = [];

    add(key: K, value: V) {
        if (!this.map.has(key)) {
            this.order.push(key);
        }
        this.map.set(key, value);
    }

    remove(key: K) {
        this.map.delete(key);
        this.order = this.order.filter((k) => k !== key);
    }

    get(key: K) {
        return this.map.get(key);
    }

    *entries(): Generator<[K, V]> {
        for (const index in this.order) {
            const key = this.order[index];
            const value = this.map.get(key);
            if (value) {
                yield [key, value];
            }
        }
    }

    *keys() {
        for (let [key] of this.entries()) {
            yield key;
        }
    }

    *values() {
        for (let [, value] of this.entries()) {
            yield value;
        }
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}