import * as cc from "cc";
import { AsyncOperation, UIPackage } from "fairygui-cc";
import { AppWindow } from "./AppWindow";
import { ASourceLoader } from "./ASourceLoader";
import { fairyUrlLocalPrefix } from "./Main";

export class FairyLoader extends ASourceLoader {
    protected data: FairyGObjectItem[];
    protected packName: string;
    protected bundle: cc.AssetManager.Bundle
    constructor(packName: string, bundle: cc.AssetManager.Bundle, classType?: any, gObjectName?: string, ...args: any[]) {
        super();
        this.packName = packName;
        this.bundle = bundle;
        return this;
    }
    protected start(): void {
        if (!this.bundle) {
            var url = fairyUrlLocalPrefix + this.fileName;
            UIPackage.loadPackage(url, this.onLoadProcess.bind(this), this.onPackLoaded.bind(this));
        } else {
            UIPackage.loadPackage(this.bundle, this.fileName, this.onLoadProcess.bind(this), this.onPackLoaded.bind(this));
        }
    }
    protected onLoadProcess(count: number, total: number): void {
        super.progress(count, total);
    }
    protected onPackLoaded(err: any, pkg: UIPackage): void {
        if (!err) {
            this.preCreateAppWindow();
        }
    }
    protected preCreateAppWindow(position?: number): void {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (position == 0) {
            UIPackage.addPackage(fairyUrlLocalPrefix + this.fileName);
        }
        if (this.data && this.data.length > 0 && position < this.data.length) {
            var win_1 = this.data[position].inst;
            var create = new AsyncOperation()//fgui.AsyncOperation();
            create.callback = function (gObject) {
                win_1.contentPane = gObject.asCom;
                _this.preCreateAppWindow(position + 1);
            };
            create.createObject(this.fileName, win_1.name);
        }
        else {
            super.success();
        }
    }
}
export interface FairyGObjectItem {
    /** 要创建的目标Class类定义 */
    type: any;
    /** 要绑定的FGUI里的资源导出名 */
    name: string;
    /** 以目标Class创建出来的实例 */
    inst?: AppWindow;
}