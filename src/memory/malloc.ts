import ref from "ref-napi";

export default function malloc<T>(size: number) {
    return Buffer.alloc(size).address();
}