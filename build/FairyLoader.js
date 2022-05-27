import { AsyncOperation, UIPackage } from "fairygui-cc";
import { ASourceLoader } from "./ASourceLoader";
import { fairyUrlLocalPrefix } from "./Main";
export class FairyLoader extends ASourceLoader {
    constructor(packName, bundle, classType, gObjectName, ...args) {
        super();
        this.packName = packName;
        this.bundle = bundle;
        return this;
    }
    start() {
        if (!this.bundle) {
            var url = fairyUrlLocalPrefix + this.fileName;
            UIPackage.loadPackage(url, this.onLoadProcess.bind(this), this.onPackLoaded.bind(this));
        }
        else {
            UIPackage.loadPackage(this.bundle, this.fileName, this.onLoadProcess.bind(this), this.onPackLoaded.bind(this));
        }
    }
    onLoadProcess(count, total) {
        super.progress(count, total);
    }
    onPackLoaded(err, pkg) {
        if (!err) {
            this.preCreateAppWindow();
        }
    }
    preCreateAppWindow(position) {
        var _this = this;
        if (position === void 0) {
            position = 0;
        }
        if (position == 0) {
            UIPackage.addPackage(fairyUrlLocalPrefix + this.fileName);
        }
        if (this.data && this.data.length > 0 && position < this.data.length) {
            var win_1 = this.data[position].inst;
            var create = new AsyncOperation(); //fgui.AsyncOperation();
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
