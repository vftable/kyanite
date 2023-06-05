import JSMeow from "jsmeow";
import {
  dereference,
  dereferenceStd,
  getCocos2DBase,
  getPointer,
} from "../../../utils";
import CCNode from "../nodes/CCNode";

class CCLayer extends CCNode {
  m_ptr: number = 0x0;

  static create(...args: any[]): CCLayer {
    return dereference(
        CCLayer,
      JSMeow.memory.callFunction(
        [],
        0x4, // CCLayer*
        getCocos2DBase() + 0xa2040 // CCLayer::create
      )
    );
  }

  init(...args: any[]): boolean {
    // __thiscall
    return dereferenceStd(
      Boolean,
      JSMeow.memory.callFunction(
        [
          {
            type: 0x4, // CCLayer*
            value: getPointer(this),
          },
        ],
        0x3, // boolean
        getCocos2DBase() + 0xa28b0 // CCLayer::init
      )
    );
  }
}

export default CCLayer;
