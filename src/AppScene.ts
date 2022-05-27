import { GRoot } from "fairygui-cc";
import * as mvc from "simple-mvc-cc";
import { AppWindow } from "./AppWindow";
import { EVT_STAGE_RESIZE, getFairyInstence } from "./Main";

export class AppScene extends AppWindow {
    static current: AppScene;
    /**在部分场景中，如果直接使用instance of表达式可能会导致循环依赖的异常 */
    sceneName: string;
    static show(type: any, param?: any): AppScene {
        var scene: AppWindow = getFairyInstence(type);
        scene && scene.showByParams(param);
        return scene as AppScene;
    }
    protected initConfig(): void {
        this.modal = false;
        this.isCenter = false;
        this.isFullScreen = true;
        this.bringToFontOnClick = false;
    }
    /** 场景显示，若已有场景，会自带切换功能(旧版逻辑在代码尾部，若遇到问题可参考) */
    show(): void {
        let curChild = GRoot.inst._children.concat();
        for (var i = 1; i < curChild.length; i++) {
            let child = curChild[i]
            if (!(child instanceof AppScene)) {
                child.removeFromParent();
            }
        }

        if (AppScene.current == null) {
            AppScene.current = this;
            super.show();
            mvc.on(EVT_STAGE_RESIZE, this.onResize, this);
        }
        else if (AppScene.current == this) {
            super.show();
        }
        else {
            var scene = AppScene.current;
            AppScene.current = null;
            scene.hideThen(this.show, this);
        }
    }
    onHide(): void {
        mvc.off(EVT_STAGE_RESIZE, this.onResize, this);
    }
}