import ref from "ref-napi";

export default function sizeof<T>(target: any) {
    return target.m_size;
}