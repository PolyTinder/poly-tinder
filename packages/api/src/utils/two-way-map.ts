export class TwoWayMap<T1, T2> {
    private map1: Map<T1, T2> = new Map();
    private map2: Map<T2, T1> = new Map();

    constructor(entries?: [T1, T2][]) {
        entries?.forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    set(left: T1, right: T2) {
        this.map1.set(left, right);
        this.map2.set(right, left);
    }

    getLeft(left: T1): T2 | undefined {
        return this.map1.get(left);
    }

    getRight(right: T2): T1 | undefined {
        return this.map2.get(right);
    }

    removeLeft(left: T1) {
        const right = this.map1.get(left);
        this.map1.delete(left);
        if (right) this.map2.delete(right);
    }

    removeRight(right: T2) {
        const left = this.map2.get(right);
        this.map2.delete(right);
        if (left) this.map1.delete(left);
    }
}
