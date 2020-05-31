class StrongMap<K extends object, V> implements Map<K, V> {
    private map: Map<K, V>;
    public size: number;
    public [Symbol.toStringTag]: string;

    public [Symbol.iterator](): IterableIterator<[K, V]> {
        throw new Error("Hash map doesn't have iterator.");
    }

    public constructor() {
        this.map = new Map<K, V>();
        this.size = 0;
    }

    public clear(): void {
        this.map.clear();
    }

    public delete(key: K): boolean {
        const remove = this.map.delete(this.key(key) as any);
        if (remove) {
            this.size -= 1;
        }
        return remove;
    }

    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
        this.map.forEach(callbackfn);
    }

    public get(key: K): V | undefined {
        return this.map.get(this.key(key) as any);
    }

    public entries(): IterableIterator<[K, V]> {
        return this.map.entries();
    }

    public keys(): IterableIterator<K> {
        return this.map.keys();
    }

    public values(): IterableIterator<V> {
        return this.map.values();
    }

    private key(k: any): K {
        return Symbol.for(Object.entries(k) as any) as any;
    }

    public set(key: K, val: V) {
        const k = this.key(key);
        this.map.set(k, val);
        this.size += 1;
        return this;
    }

    public has(key: K): boolean {
        const k = this.key(key);
        return this.map.has(k);
    }
}
