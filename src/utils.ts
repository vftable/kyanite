import JSMeow from "jsmeow";
import { CCNode } from "./classes/cocos2d";

interface PointerReference {
  returnValue: number;
  exitCode?: number;
}

interface StdPointerReference {
  returnValue: number | string | boolean;
  exitCode?: number;
}

export function getBase(): number {
  return JSMeow.memory.openProcess("GeometryDash.exe").modBaseAddr;
}

export function getCocos2DBase(): number {
  return JSMeow.memory.findModule(
    "libcocos2d.dll",
    JSMeow.memory.openProcess("GeometryDash.exe").th32ProcessID
  ).modBaseAddr;
}

export function getPointer(_class: any): number {
  return _class.m_ptr;
}

export function setPointer(_class: any, pointer: PointerReference): number {
  _class.m_ptr = pointer.returnValue;
  return pointer.returnValue;
}

export function dereferenceStd<T>(_type: any, pointer: StdPointerReference): T {
  return pointer.returnValue as T;
}

export function dereference<T>(_class: any, pointer: PointerReference): T {
  const pRet = new _class();
  pRet.m_ptr = pointer.returnValue;
  return pRet as T;
}
