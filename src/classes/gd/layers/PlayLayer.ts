import JSMeow from "jsmeow";
import { dereference, dereferenceStd, getPointer } from "../../../utils";
import { CCLayer } from "../../cocos2d";
import GameManager from "../managers/GameManager";
import GJGameLevel from "../nodes/GJGameLevel";

class PlayLayer extends CCLayer {
    m_ptr: number = 0x0;

    static get(): PlayLayer {
        return GameManager.sharedState().getPlayLayer();
    }
    
    public get m_isDead(): boolean {
        return dereferenceStd(
            Boolean,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x39c, // playLayer->m_isDead;
                    "bool" // bool
                )
            }
        )
    }

    public get m_level(): GJGameLevel {
        return dereference(
            GJGameLevel,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x488, // playLayer->m_level;
                    "dword" // GJGameLevel*
                )
            }
        )
    }

    public get m_isPracticeMode(): boolean {
        return dereferenceStd(
            Boolean,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x495, // playLayer->m_isPracticeMode;
                    "bool" // bool
                )
            }
        )
    }
}

export default PlayLayer;