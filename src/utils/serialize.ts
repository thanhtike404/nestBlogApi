// Utility to convert BigInt values to strings recursively so they can be JSON serialized.
export function serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) {
        // ensure valid date
        const time = obj.getTime();
        return Number.isFinite(time) ? obj.toISOString() : null;
    }
    if (typeof obj === 'bigint') return obj.toString();
    if (Array.isArray(obj)) return obj.map(serializeBigInt);
    if (typeof obj === 'object') {
        const out: any = {};
        for (const [k, v] of Object.entries(obj)) {
            out[k] = serializeBigInt(v);
        }
        return out;
    }
    return obj;
}
