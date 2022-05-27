import { GComponent, Window } from "fairygui-cc";
export declare class AniWindow extends Window {
    constructor(comp: GComponent);
    doShowAnimation(): void;
    onShowAniComplete(): void;
    doHideAnimation(): void;
}
