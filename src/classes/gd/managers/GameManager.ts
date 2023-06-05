import JSMeow from "jsmeow";
import { dereference, getBase, getPointer } from "../../../utils";
import { CCNode } from "../../cocos2d";
import PlayLayer from "../layers/PlayLayer";

class GameManager extends CCNode {
    m_ptr: number = 0x0;

    static sharedState(): GameManager {
        return dereference(
            GameManager,
            JSMeow.memory.callFunction(
                [],
                0x4, // GameManager*
                getBase() + 0xC4A50 // GameManager::sharedState
            )
        )
    }

    getPlayLayer(): PlayLayer {
        return this.m_pPlayLayer;
    }

    public get m_pPlayLayer(): PlayLayer {
        return dereference(
            PlayLayer,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x164, // gameManager->m_pPlayLayer;
                    "dword" // PlayLayer*
                )
            }
        )
    }
}

export default GameManager;