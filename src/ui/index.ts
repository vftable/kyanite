// @ts-ignore
import binding from "./binding/build/Release/KyaniteSDK.node";

interface KyaniteSDK {
    Components: {
        createCategory(label: string): void;
        createLabel(label: string): void;
        createCheckbox(label: string, callback: (value: boolean) => void): void;
        createSlider(label: string, callback: (value: number) => void): void;
    };

    doRender(): void;
    setupOverlay(windowName: string): void;
    isInitialised(): boolean;
}

export default binding as KyaniteSDK;