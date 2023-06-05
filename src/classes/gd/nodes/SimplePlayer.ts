import { dereference, dereferenceStd, getBase, getPointer } from "../../../utils";
import { CCSprite, ccColor3b } from "../../cocos2d";

import JSMeow from "jsmeow";

class SimplePlayer extends CCSprite {
  m_ptr: number = 0x0;

  static create(iconID: number): SimplePlayer {
    return dereference(
      SimplePlayer,
      JSMeow.memory.callFunction(
        [
          {
            type: 0x4, // int
            value: iconID,
          },
        ],
        0x4, // SimplePlayer*
        getBase() + 0x12bd80 // SimplePlayer::create
      )
    );
  }

  init(iconID: number): boolean { // __thiscall
    return dereferenceStd(
      Boolean,
      JSMeow.memory.callFunction(
        [
          {
            type: 0x4, // SimplePlayer*
            value: getPointer(this),
          },
          {
            type: 0x4, // int
            value: iconID,
          },
        ],
        0x3, // boolean
        getBase() + 0x12be20 // SimplePlayer::init
      )
    );
  }

  autorelease(): void {
    throw new Error("Method not implemented.");
  }

  setSecondColor(color: ccColor3b): void {
    this.m_secondLayer.setColor(color);
  }

  hasGlowOutline(): boolean {
    return this.m_hasGlowOutline;
  }

  setGlowOutline(value: boolean): void {
    this.m_hasGlowOutline = value;
  }

  // m_firstLayer: CCNode; // CCSprite*
  // m_secondLayer: CCNode; // CCSprite*
  // m_birdDome: CCNode; // CCSprite*
  // m_outlineSprite: CCNode; // CCSprite*
  // m_detailSprite: CCNode; // CCSprite*

  // m_robotSprite: CCNode; // GJRobotSprite*
  // m_spiderSprite: CCNode; // GJSpiderSprite*

  m_hasGlowOutline: boolean = false;

  public get m_firstLayer(): CCSprite {
    return dereference(
      CCSprite,
      {
        returnValue: JSMeow.memory.readMemory(
          getPointer(this) + 0x1e4, // simplePlayer->m_firstLayer
          "dword" // CCSprite*
        ),
      }
    );
  }

  public get m_secondLayer(): CCSprite {
    return dereference(
      CCSprite,
      {
        returnValue: JSMeow.memory.readMemory(
          getPointer(this) + 0x1e8, // simplePlayer->m_secondLayer
          "dword" // CCSprite*
        ),
      }
    );
  }
}

export default SimplePlayer;
