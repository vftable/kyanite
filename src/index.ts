import fs from "fs";
import { GameManager, PlayLayer, SimplePlayer } from "./classes/gd";
import JSMeow, { colors, draws, overlay, vector2, waitsLoop } from "jsmeow";
import { getBase, getCocos2DBase, getPointer } from "./utils";
import { CCLayer } from "./classes/cocos2d";

import UI from "./ui";
import process from 'process';

process.stdin.resume();

const file = fs.readFileSync("addresses.txt");
const lines = file.toString().split("\n");

const dict: { [namespace: string]: { [declaration: string]: string } } = {};

for (const line of lines) {
    const stripped = line.replace("\r", "");

    const [func, addr] = stripped.split(" - ");
    const [namespace, declaration] = func.split("::");
    
    if (!dict[namespace]) {
        dict[namespace] = {};
    }

    dict[namespace][declaration] = addr;
}

fs.writeFileSync("dist/addr.json", JSON.stringify(
    dict,
    null,
    2
));

console.log(`[+] base: 0x${getBase().toString(16)}`);
console.log(`[+] cocos2d base: 0x${getCocos2DBase().toString(16)}`);

console.log();

const simplePlayer: SimplePlayer = SimplePlayer.create(24);
const layer: CCLayer = CCLayer.create();

console.log(`[-] created SimplePlayer: 0x${getPointer(simplePlayer).toString(16)}`);
console.log(`[-] created CCLayer: 0x${getPointer(layer).toString(16)}`)

console.log();

const gameManager: GameManager = GameManager.sharedState();
const playLayer: PlayLayer = PlayLayer.get();

console.log(`[*] GameManager::sharedState() -> 0x${getPointer(gameManager).toString(16)}`);
console.log(`[*] PlayLayer::get() -> 0x${getPointer(playLayer).toString(16)}`);

console.log();

console.log(`[!] GJGameLevel instance: 0x${getPointer(playLayer.m_level).toString(16)}`);

console.log();

UI.setupOverlay("Geometry Dash");

UI.Components.createCategory("ExampleMod");

UI.Components.createLabel("Example Text");

UI.Components.createCheckbox("Example Checkbox", (value: boolean) => {
    console.log(`Toggled: ${value}`);
});

UI.Components.createSlider("Example Slider", (value: number) => {
    console.log(`Changed: ${value.toFixed(3)}`);
});

while (UI.isInitialised()) {
    UI.doRender();
}