import JSMeow from "jsmeow";
import { dereference, getCocos2DBase, getPointer } from "../../../utils";
import { malloc, sizeof } from "../../../memory";
import { CCPoint } from "../types";

class CCNode {
  m_ptr: number = 0x0;

  static create(...args: any[]): CCNode {
    return dereference(
        CCNode,
        JSMeow.memory.callFunction(
          [],
          0x4, // CCNode*
          getCocos2DBase() + 0x5f150 // CCNode::create
        )
      );
  }

  addChild(child: CCNode, zOrder: number = 0, tag: number = 0, ...args: any[]): void {
    // __thiscall
    JSMeow.memory.callFunction(
      [
        {
          type: 0x4, // CCNode*
          value: getPointer(this),
        },
        {
          type: 0x4, // CCNode*
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
      getCocos2DBase() + 0x5ecf0 // CCNode::addChild
    );
  }

  convertToWorldSpace(...args: any[]): CCPoint {
    // __thiscall
    return dereference(
      CCPoint,
      JSMeow.memory.callFunction(
        [
          {
            type: 0x4, // CCNode*
            value: getPointer(this),
          },
          {
            type: 0x4, // CCPoint*
            value: malloc(sizeof(CCPoint)),
          },
        ],
        0x4, // CCPoint*
        getCocos2DBase() + 0x5efd0 // CCNode::convertToWorldSpace
      )
    );
  }
}

export default CCNode;
