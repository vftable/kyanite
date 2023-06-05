import JSMeow from "jsmeow";
import {
  dereference,
  dereferenceStd,
  getCocos2DBase,
  getPointer,
} from "../../../utils";
import { ccColor3b } from "../types";
import CCNode from "../nodes/CCNode";

class CCSprite extends CCNode {
  m_ptr: number = 0x0;

  static create(...args: any[]): CCSprite {
    return dereference(
      CCSprite,
      JSMeow.memory.callFunction(
        [],
        0x4, // CCSprite*
        getCocos2DBase() + 0xd32b0 // CCSprite::create
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
            type: 0x4, // CCSprite*
            value: getPointer(this),
          },
        ],
        0x3, // boolean
        getCocos2DBase() + 0xd3760 // CCSprite::init
      )
    );
  }

  addChild(
    child: CCSprite,
    zOrder: number = 0,
    tag: number = 0,
    ...args: any[]
  ): void {
    // __thiscall
    JSMeow.memory.callFunction(
      [
        {
          type: 0x4, // CCSprite*
          value: getPointer(this),
        },
        {
          type: 0x4, // CCSprite*
          value: getPointer(child),
        },
        {
          type: 0x4, // int
          value: zOrder,
        },
        {
          type: 0x4, // int
          value: tag,
        },
      ],
      0x0, // void
      getCocos2DBase() + 0xd30e0 // CCSprite::addChild
    );
  }

  setColor(color: ccColor3b, ...args: any[]): void {
    JSMeow.memory.callFunction(
        [
            {
                type: 0x4, // CCSprite*
                value: getPointer(this),
            },
            {
                type: 0x4, // ccColor3b*
                value: getPointer(color),
            }
        ],
        0x0, // void
        getCocos2DBase() + 0xd3e70 // CCSprite::setColor
    )
  }
}

export default CCSprite;
