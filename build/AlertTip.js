import { GRoot, Window } from "fairygui-cc";
import { AppComp } from "./AppComp";
export class AlertTip extends AppComp {
    setAndShow(content, y, time, lock) {
        if (time === void 0) {
            time = 1500;
        }
        this.viewComponent.title = content;
        this.showTime = time;
        this.lock = lock;
        if (lock) {
            if (!this.win) {
                this.win = new Window();
                this.win.modal = true;
            }
            this.win.contentPane = this.viewComponent;
            this.win.show();
            this.win.center();
            if (y > 0)
                this.win.y = y;
        }
        else {
            GRoot.inst.addChild(this);
            this.center();
            if (y > 0)
                this.y = y;
        }
        this.alpha = 0;
        // k7.Engine.tweenTo(this, { alpha: 1 }, this.tweenTime, k7.EaseName.QuadOut);
        // this.timeoutId = setTimeout(this.hide.bind(this), time);
        return this;
    }
    hide() {
        var _this = this;
        // if (!isNaN(this.timeoutId)) {
        //     clearTimeout(this.timeoutId);
        //     this.timeoutId = null;
        // }
        // k7.Engine.tweenTo(this, { alpha: 0 }, this.tweenTime, k7.EaseName.QuadIn, this, function () {
        //     if (_this.lock) {
        //         _this.win && _this.win.hide();
        //     }
        //     else {
        //         _this.removeFromParent();
        //     }
        // });
    }
}
