import * as cc from "cc";
import { UIPackage } from "fairygui-cc";
import { AppWindow } from "./AppWindow";
import { ASourceLoader } from "./ASourceLoader";
export declare class FairyLoader extends ASourceLoader {
    protected data: FairyGObjectItem[];
    protected packName: string;
    protected bundle: any;
    constructor(packName: string, bundle: cc.AssetManager.Bundle, classType?: any, gObjectName?: string, ...args: any[]);
    protected start(): void;
    protected onLoadProcess(count: number, total: number): void;
    protected onPackLoaded(err: any, pkg: UIPackage): void;
    protected preCreateAppWindow(position?: number): void;
}
export interface FairyGObjectItem {
    /** 要创建的目标Class类定义 */
    type: any;
    /** 要绑定的FGUI里的资源导出名 */
    name: string;
    /** 以目标Class创建出来的实例 */
    inst?: AppWindow;
}
