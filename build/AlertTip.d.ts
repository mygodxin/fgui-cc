import { Window } from "fairygui-cc";
import { AppComp } from "./AppComp";
export declare class AlertTip extends AppComp {
    static inst: AlertTip;
    tweenTime: number;
    protected showTime: number;
    protected lock: boolean;
    protected win: Window;
    protected timeoutId: number;
    setAndShow(content: string, y?: number, time?: number, lock?: boolean): AlertTip;
    hide(): void;
}
