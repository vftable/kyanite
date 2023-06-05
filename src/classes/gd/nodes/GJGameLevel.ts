import JSMeow from "jsmeow";
import { dereferenceStd, getPointer } from "../../../utils";
import { CCNode } from "../../cocos2d";
import GameManager from "../managers/GameManager";

export enum GJLevelType {
    kGJLevelTypeLocal = 1,
    kGJLevelTypeEditor = 2,
    kGJLevelTypeSaved = 3
};

export enum GJDifficulty {
    kGJDifficultyAuto = 0,
    kGJDifficultyEasy = 1,
    kGJDifficultyNormal = 2,
    kGJDifficultyHard = 3,
    kGJDifficultyHarder = 4,
    kGJDifficultyInsane = 5,
    kGJDifficultyDemon = 6,
    kGJDifficultyDemonEasy = 7,
    kGJDifficultyDemonMedium = 8,
    kGJDifficultyDemonInsane = 9,
    kGJDifficultyDemonExtreme = 10
};

class GJGameLevel extends CCNode {
    m_ptr: number = 0x0;
    
    public get m_nLevelID_rand(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0xf0, // gameLevel->m_nLevelID_rand;
                    "int" // int
                )
            }
        )
    }

    public get m_nLevelID_seed(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0xf4, // gameLevel->m_nLevelID_seed;
                    "int" // int
                )
            }
        )
    }

    public get m_nLevelID(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0xf8, // gameLevel->m_nLevelID;
                    "int" // int
                )
            }
        )
    }

    public get m_sLevelName(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0xfc, // gameLevel->m_sLevelName;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sLevelDesc(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x114, // gameLevel->m_sLevelDesc;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sLevelString(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x12c, // gameLevel->m_sLevelString;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sCreatorName(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x144, // gameLevel->m_sCreatorName;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sRecordString(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x15c, // gameLevel->m_sRecordString;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sUploadDate(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x174, // gameLevel->m_sUploadDate;
                    "string" // std::string
                )
            }
        )
    }

    public get m_sUpdateDate(): string {
        return dereferenceStd(
            String,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x18c, // gameLevel->m_sUpdateDate;
                    "string" // std::string
                )
            }
        )
    }

    public get m_nUserID_rand(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1a4, // gameLevel->m_nUserID_rand;
                    "int" // int
                )
            }
        )
    }

    public get m_nUserID_seed(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1a8, // gameLevel->m_nUserID_seed;
                    "int" // int
                )
            }
        )
    }

    public get m_nUserID(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1ac, // gameLevel->m_nUserID;
                    "int" // int
                )
            }
        )
    }

    public get m_nAccountID_rand(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1b0, // gameLevel->m_nAccountID_rand;
                    "int" // int
                )
            }
        )
    }
    
    public get m_nAccountID_seed(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1b4, // gameLevel->m_nAccountID_seed;
                    "int" // int
                )
            }
        )
    }

    public get m_nAccountID(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1b8, // gameLevel->m_nAccountID;
                    "int" // int
                )
            }
        )
    }

    public get m_eDifficulty(): GJDifficulty {
        return dereferenceStd(
            GJDifficulty,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1bc, // gameLevel->m_eDifficulty;
                    "int" // GJDifficulty
                )
            }
        )
    }

    public get m_nAudioTrack(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1c0, // gameLevel->m_nAudioTrack;
                    "int" // int
                )
            }
        )
    }

    public get m_nSongID(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1c4, // gameLevel->m_nSongID;
                    "int" // int
                )
            }
        )
    }

    public get m_nLevelRev(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1c8, // gameLevel->m_nLevelRev;
                    "int" // int
                )
            }
        )
    }

    public get m_bUnlisted(): boolean {
        return dereferenceStd(
            Boolean,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1cc, // gameLevel->m_bUnlisted;
                    "bool" // bool
                )
            }
        )
    }

    public get m_nObjectCount_rand(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1d0, // gameLevel->m_nObjectCount_rand;
                    "int" // int
                )
            }
        )
    }

    public get m_nObjectCount_seed(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1d4, // gameLevel->m_nObjectCount_seed;
                    "int" // int
                )
            }
        )
    }

    public get m_nObjectCount(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1d8, // gameLevel->m_nObjectCount;
                    "int" // int
                )
            }
        )
    }

    public get m_nLevelIndex(): number {
        return dereferenceStd(
            Number,
            {
                returnValue: JSMeow.memory.readMemory(
                    getPointer(this) + 0x1dc, // gameLevel->m_nLevelIndex;
                    "int" // int
                )
            }
        )
    }
}

export default GJGameLevel;