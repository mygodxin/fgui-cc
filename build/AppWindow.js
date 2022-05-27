import * as mvc from "simple-mvc-cc";
import { GRoot, UIPackage, Window } from "fairygui-cc";
import { FairyChild } from "./FairyChild";
import { EVT_FAIRY_HIDE, EVT_FAIRY_SHOW, EVT_STAGE_ADDED, EVT_STAGE_REMOVED, EVT_STAGE_RESIZE, EVT_UI_ONHIDE, EVT_UI_ONREADY, fairyUrlLocalPrefix, fairyUrlRemotePrefix, getFairyInstence, getFairyPath } from "./Main";
import { MediatorUiAdapter } from "./MediatorUiAdapter";
export class AppWindow extends Window {
    /** 导出的组件名，组件所在的包，指定加载的(如果纹理需要独立加载的情况) */
    constructor(name, pack, ...sources) {
        super();
        this.transShowName = 'show';
        this.transHideName = 'hide';
        /** 绑定在此窗口下的子窗口列表 */
        this.subWindowsList = {};
        this.uiMediators = [];
        this.name = name;
        this.pack = pack;
        this.prefix = fairyUrlLocalPrefix || fairyUrlRemotePrefix;
        sources.forEach((source) => {
            if (source)
                this.addUISource(source);
        });
        this.modal = true;
        this.isCenter = true;
        this.initConfig();
        return this;
    }
    static show(type, param) {
        var win = getFairyInstence(type);
        win && win.showByParams(param);
        return win;
    }
    // getUISources(): IUISource[] {
    //     return this["_uiSources"].slice();
    // }
    onStageEvent(type) {
        switch (type) {
            case EVT_STAGE_ADDED:
                mvc.send(EVT_FAIRY_SHOW, { view: this.contentPane, path: getFairyPath(this) });
                break;
            case EVT_STAGE_REMOVED:
                mvc.send(EVT_FAIRY_HIDE, { view: this.contentPane, path: getFairyPath(this) });
                break;
            case EVT_STAGE_RESIZE:
                this.onResize();
                break;
        }
    }
    initConfig() { }
    show() {
        if (this.isPopup)
            GRoot.inst.showPopup(this);
        else if (this.parent == GRoot.inst) {
            if (this['_inited']) {
                this.refreshUi();
                this.onShowAniComplete();
            }
        }
        else {
            // _super.prototype.show.call(this);
            super.show();
        }
    }
    showByParams(param) {
        this.openData = param;
        this.show();
        return this;
    }
    hide() {
        this.closeAllSubWindow();
        this.doHideAnimation();
        this.refreshOwnerWindow();
    }
    hideThen(next, nextObj) {
        this.hideThenCall = next;
        this.hideThenObj = nextObj;
        this.hide();
    }
    init() {
        super.init();
        if (this['loading'] && AppWindow.configLoadingWaiting) {
            this.showLoadingWait();
        }
    }
    showLoadingWait() {
        if (!this.loadingWaitPane)
            this.loadingWaitPane = UIPackage.createObjectFromURL(AppWindow.configLoadingWaiting);
        this.layoutLoadingWaitPane();
        GRoot.inst.addChild(this.loadingWaitPane);
    }
    layoutLoadingWaitPane() {
        this.loadingWaitPane.makeFullScreen();
    }
    closeLoadingWait() {
        if (this.loadingWaitPane && this.loadingWaitPane.parent != null)
            this.loadingWaitPane.removeFromParent();
    }
    onInit() {
        this.closeLoadingWait();
        if (this.contentPane == null) {
            if (this.pack && !UIPackage.getByName(this.pack)) {
                UIPackage.addPackage(this.prefix + this.pack);
            }
            this.contentPane = UIPackage.createObject(this.pack, this.name).asCom;
        }
        this.topArea = this.contentPane.getChild("top");
        this.bottomArea = this.contentPane.getChild("bottom");
        this.centerArea = this.contentPane.getChild("center");
        this.fairyAdapter = new FairyChild(this.contentPane, this);
        this.mediatorAdapter = new MediatorUiAdapter(this.prefix + this.pack + '/' + this.name, this);
        this.uiMediators = [this.mediatorAdapter];
        this.bindChild();
    }
    doShowAnimation() {
        mvc.send(EVT_UI_ONREADY, this);
        this.onResize();
        this.refreshUi();
        this.registerMediators();
        this.touchable = false;
        if (this.showAnimation) {
            this.showAnimation(this, this.onShowAniComplete);
        }
        else {
            const show = this.contentPane.getTransition(this.transShowName);
            if (show) {
                show.play(() => {
                    this.onShowAniComplete();
                });
            }
            else {
                this.onShowAniComplete();
            }
        }
    }
    doHideAnimation() {
        this.removeMediators();
        this.touchable = false;
        if (this.hideAnimation) {
            this.hideAnimation(this, this.onHideAniComplete);
        }
        else {
            const hide = this.contentPane.getTransition(this.transHideName);
            if (hide) {
                hide.play(() => {
                    this.onHideAniComplete();
                });
            }
            else {
                this.onHideAniComplete();
            }
        }
    }
    onShowAniComplete() {
        this.touchable = true;
        this.onShown();
    }
    onHideAniComplete() {
        this.touchable = true;
        this.hideImmediately();
        if (this.hideThenCall) {
            this.hideThenCall.call(this.hideThenObj);
            this.hideThenCall = null;
            this.hideThenObj = null;
        }
        mvc.send(EVT_UI_ONHIDE, this);
    }
    onResize() {
        if (this.isFullScreen)
            this.makeFullScreen();
        else if (this.isCenter)
            this.center();
    }
    bindChild() { }
    refreshUi() { }
    onClickButton(button) { }
    onCloseWindow(window) { }
    onSubWindowClose(win) { }
    ;
    /** 注册一个子窗口，随后可以用字符串打开该窗口，并绑定了子窗口该子窗口，详见bindSubWindow */
    registerSubWindow(WinClass, name, pack, tex) {
        if (this.subWindowsList[name] == null) {
            if (!pack)
                pack = this.pack;
            this.bindSubWindow(new WinClass(name, pack, tex));
        }
        return this.subWindowsList[name];
    }
    /** 绑定一个窗口实例为当前窗口的子窗口，启动关闭将会有冒泡联动通知（比如：用于刷新） */
    bindSubWindow(win) {
        if (this.subWindowsList[win.name] == null) {
            win.ownerWindow = this;
            this.subWindowsList[win.name] = win;
        }
        return this.subWindowsList[win.name];
    }
    /** 打开一个子窗口 */
    showSubWindow(name, openData) {
        var win = this.subWindowsList[name];
        if (win == null)
            return;
        if (openData || openData === null)
            win.openData = openData;
        win.show();
        return win;
    }
    /** 关闭所有子窗口 */
    closeAllSubWindow() {
        for (var name in this.subWindowsList) {
            this.subWindowsList[name].hide();
        }
    }
    /** 刷新父窗口界面(使用场景举例：子界面某操作更新大厅数据) */
    refreshOwnerWindow() {
        this.ownerWindow && this.ownerWindow.onSubWindowClose(this);
    }
    registerMediators() {
        for (var i = 0; i < this.uiMediators.length; ++i) {
            mvc.registerMediator(this.uiMediators[i]);
        }
    }
    removeMediators() {
        for (var i = 0; i < this.uiMediators.length; ++i) {
            mvc.removeMediator(this.uiMediators[i].mediatorName);
        }
    }
    setRoot(view) {
        this.fairyAdapter.setRoot(view);
    }
    ;
    getComp(path) {
        return this.fairyAdapter.getComp(path);
    }
    ;
    getLabel(path) {
        return this.fairyAdapter.getLabel(path);
    }
    ;
    getProgressBar(path) {
        return this.fairyAdapter.getProgressBar(path);
    }
    ;
    getTextField(path) {
        return this.fairyAdapter.getTextField(path);
    }
    ;
    getRichTextField(path) {
        return this.fairyAdapter.getRichTextField(path);
    }
    ;
    getTextInput(path) {
        return this.fairyAdapter.getTextInput(path);
    }
    ;
    getLoader(path) {
        return this.fairyAdapter.getLoader(path);
    }
    ;
    getList(path) {
        return this.fairyAdapter.getList(path);
    }
    ;
    getGraph(path) {
        return this.fairyAdapter.getGraph(path);
    }
    ;
    getGroup(path) {
        return this.fairyAdapter.getGroup(path);
    }
    ;
    getSlider(path) {
        return this.fairyAdapter.getSlider(path);
    }
    ;
    getComboBox(path) {
        return this.fairyAdapter.getComboBox(path);
    }
    ;
    getImage(path) {
        return this.fairyAdapter.getImage(path);
    }
    ;
    getMovieClip(path) {
        return this.fairyAdapter.getMovieClip(path);
    }
    ;
    getController(path) {
        return this.fairyAdapter.getController(path);
    }
    ;
    getTransition(path) {
        return this.fairyAdapter.getTransition(path);
    }
    ;
    getButton(path, clickListener, parent) {
        return this.fairyAdapter.getButton(path, clickListener, parent);
    }
    ;
    getWindow(path, closeListener, parent) {
        return this.fairyAdapter.getWindow(path, closeListener, parent);
    }
    ;
    get mediatorName() {
        return this.mediatorAdapter.mediatorName;
    }
    get viewComponent() {
        return this;
    }
    onRegister() { }
    onEvent(eventName, params) { }
    onRemove() { }
}
