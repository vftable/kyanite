import JSMeow from "jsmeow";
import {
  dereferenceStd,
  getCocos2DBase,
  getPointer,
  setPointer,
} from "../../utils";

import ref from "ref-napi";
import { malloc, sizeof } from "../../memory";

export class ccColor3b {
  m_ptr: number = 0x0;

  public get r(): number {
    return dereferenceStd(Number, {
      returnValue: JSMeow.memory.readMemory(
        getPointer(this) + 0x0, // ccColor3b.r;
        "byte" // GLubyte
      ),
    });
  }

  public get g(): number {
    return dereferenceStd(Number, {
      returnValue: JSMeow.memory.readMemory(
        getPointer(this) + 0x1, // ccColor3b.g;
        "byte" // GLubyte
      ),
    });
  }

  public get b(): number {
    return dereferenceStd(Number, {
      returnValue: JSMeow.memory.readMemory(
        getPointer(this) + 0x2, // ccColor3b.b;
        "byte" // GLubyte
      ),
    });
  }
}

export class CCPoint {
  m_ptr: number = 0x0;
  static m_size: number = 0x8;

  constructor(x: number, y: number) {
    setPointer(
      this,
      JSMeow.memory.callFunction(
        [
          {
            type: 0x4, // CCPoint*
            value: malloc(sizeof(CCPoint)),
          },
          {
            type: 0x6, // float
            value: x,
          },
          {
            type: 0x6, // float
            value: y,
          },
        ],
        0x4, // CCPoint*
        getCocos2DBase() + 0x675d0 // CCPoint::CCPoint
      )
    );
  }

  public get x(): number {
    return dereferenceStd(Number, {
      returnValue: JSMeow.memory.readMemory(
        getPointer(this) + 0x0, // CCPoint.x;
        "float" // float
      ),
    });
  }

  public get y(): number {
    return dereferenceStd(Number, {
      returnValue: JSMeow.memory.readMemory(
        getPointer(this) + 0x4, // CCPoint.y;
        "float" // float
      ),
    });
  }
}
