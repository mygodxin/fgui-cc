import * as mvc from "simple-mvc-cc";
import { Controller, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GMovieClip, GObject, GProgressBar, GRichTextField, GRoot, GSlider, GTextField, GTextInput, Transition, UIPackage, Window } from "fairygui-cc";
import { IUISource } from "fairygui-cc/Window";
import { FairyChild, IFairyChild, IFairyChildOnwer } from "./FairyChild";
import { EVT_FAIRY_HIDE, EVT_FAIRY_SHOW, EVT_STAGE_ADDED, EVT_STAGE_REMOVED, EVT_STAGE_RESIZE, EVT_UI_ONHIDE, EVT_UI_ONREADY, fairyUrlLocalPrefix, fairyUrlRemotePrefix, getFairyInstence, getFairyPath } from "./Main";
import { MediatorUiAdapter } from "./MediatorUiAdapter";


export class AppWindow extends Window implements IFairyChild, IFairyChildOnwer, mvc.IMediator {
    static configLoadingWaiting: string;
    static show(type: any, param?: any): AppWindow {
        var win = getFairyInstence(type);
        win && win.showByParams(param);
        return win;
    }
    /**点击空白处关闭 */
    hideOnTap: boolean;
    /** 资源的包名 */
    pack: string;
    /** 加载地址前缀 */
    prefix: string;
    /** 是否 是一个全屏界面，全屏界面会无视isCenter属性 */
    isFullScreen: boolean;
    /** 是否 是一个居中对齐的界面 */
    isCenter: boolean;
    /** 是否 是一个被弹出管理的window，此类window点击空白处即关闭 */
    isPopup: boolean;
    /** 指定进场动画函数 */
    showAnimation: (window: AppWindow, complete: Function) => void;
    /** 指定出场动画函数 */
    hideAnimation: (window: AppWindow, complete: Function) => void;
    /** 打开win时需要传递的参数 */
    protected openData: any;
    /** 导出的组件名，组件所在的包，指定加载的(如果纹理需要独立加载的情况) */
    constructor(name: string, pack: string, ...sources: IUISource[]) {
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
        })
        this.modal = true;
        this.isCenter = true;
        this.initConfig();
        return this;
    }
    // getUISources(): IUISource[] {
    //     return this["_uiSources"].slice();
    // }
    protected onStageEvent(type: string): void {
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
    protected initConfig(): void { }
    show(): void {
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
    showByParams(param?: any): AppWindow {
        this.openData = param
        this.show();
        return this;
    }
    hide(): void {
        this.closeAllSubWindow();
        this.doHideAnimation();
        this.refreshOwnerWindow();
    }
    protected hideThenCall: Function;
    protected hideThenObj: any;
    hideThen(next: Function, nextObj: any): void {
        this.hideThenCall = next;
        this.hideThenObj = nextObj;
        this.hide();
    }
    init(): void {
        super.init();
        if (this['loading'] && AppWindow.configLoadingWaiting) {
            this.showLoadingWait();
        }
    }
    protected loadingWaitPane: GComponent;

    protected showLoadingWait(): void {
        if (!this.loadingWaitPane)
            this.loadingWaitPane = UIPackage.createObjectFromURL(AppWindow.configLoadingWaiting) as GComponent;
        this.layoutLoadingWaitPane();
        GRoot.inst.addChild(this.loadingWaitPane);
    }
    protected layoutLoadingWaitPane(): void {
        this.loadingWaitPane.makeFullScreen();
    }
    protected closeLoadingWait(): void {
        if (this.loadingWaitPane && this.loadingWaitPane.parent != null)
            this.loadingWaitPane.removeFromParent();
    }
    protected onInit(): void {
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
    protected topArea: GComponent;
    protected bottomArea: GComponent;
    protected centerArea: GComponent;
    protected transShowName: string;
    protected transHideName: string;
    protected doShowAnimation(): void {
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
                })
            } else {
                this.onShowAniComplete();
            }
        }
    }
    protected doHideAnimation(): void {
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
                })
            } else {
                this.onHideAniComplete();
            }
        }
    }
    protected onShowAniComplete(): void {
        this.touchable = true;
        this.onShown();
    }
    protected onHideAniComplete(): void {
        this.touchable = true;
        this.hideImmediately();
        if (this.hideThenCall) {
            this.hideThenCall.call(this.hideThenObj);
            this.hideThenCall = null;
            this.hideThenObj = null;
        }
        mvc.send(EVT_UI_ONHIDE, this);
    }
    onResize(): void {
        if (this.isFullScreen)
            this.makeFullScreen();
        else if (this.isCenter)
            this.center();
    }
    bindChild(): void { }
    refreshUi(): void { }
    onClickButton(button: GButton): void { }
    onCloseWindow(window: Window): void { }
    onSubWindowClose(win: AppWindow): void { }
    /** 绑定在此窗口下的子窗口列表 */
    subWindowsList: { [name: string]: AppWindow };;
    /** 当前窗口绑定在哪个窗口下，缓存在此变量中 */
    ownerWindow: AppWindow;
    /** 注册一个子窗口，随后可以用字符串打开该窗口，并绑定了子窗口该子窗口，详见bindSubWindow */
    registerSubWindow(WinClass: any, name: string, pack?: string, tex?: string): AppWindow {
        if (this.subWindowsList[name] == null) {
            if (!pack)
                pack = this.pack;
            this.bindSubWindow(new WinClass(name, pack, tex));
        }
        return this.subWindowsList[name];
    }
    /** 绑定一个窗口实例为当前窗口的子窗口，启动关闭将会有冒泡联动通知（比如：用于刷新） */
    bindSubWindow(win: AppWindow): AppWindow {
        if (this.subWindowsList[win.name] == null) {
            win.ownerWindow = this;
            this.subWindowsList[win.name] = win;
        }
        return this.subWindowsList[win.name];
    }
    /** 打开一个子窗口 */
    showSubWindow(name: string, openData?: any): AppWindow {
        var win = this.subWindowsList[name];
        if (win == null)
            return;
        if (openData || openData === null)
            win.openData = openData;
        win.show();
        return win;
    }
    /** 关闭所有子窗口 */
    closeAllSubWindow(): void {
        for (var name in this.subWindowsList) {
            this.subWindowsList[name].hide();
        }
    }
    /** 刷新父窗口界面(使用场景举例：子界面某操作更新大厅数据) */
    refreshOwnerWindow(): void {
        this.ownerWindow && this.ownerWindow.onSubWindowClose(this);
    }
    protected uiMediators: mvc.IMediator[];
    registerMediators(): void {
        for (var i = 0; i < this.uiMediators.length; ++i) {
            mvc.registerMediator(this.uiMediators[i]);
        }
    }
    removeMediators(): void {
        for (var i = 0; i < this.uiMediators.length; ++i) {
            mvc.removeMediator(this.uiMediators[i].mediatorName);
        }
    }
    protected fairyAdapter: FairyChild;
    setRoot(view: GComponent): void {
        this.fairyAdapter.setRoot(view);
    };
    getComp(path: string): GComponent {
        return this.fairyAdapter.getComp(path);
    };
    getLabel(path: string): GLabel {
        return this.fairyAdapter.getLabel(path);
    };
    getProgressBar(path: string): GProgressBar {
        return this.fairyAdapter.getProgressBar(path);
    };
    getTextField(path: string): GTextField {
        return this.fairyAdapter.getTextField(path);
    };
    getRichTextField(path: string): GRichTextField {
        return this.fairyAdapter.getRichTextField(path);
    };
    getTextInput(path: string): GTextInput {
        return this.fairyAdapter.getTextInput(path);
    };
    getLoader(path: string): GLoader {
        return this.fairyAdapter.getLoader(path);
    };
    getList(path: string): GList {
        return this.fairyAdapter.getList(path);
    };
    getGraph(path: string): GGraph {
        return this.fairyAdapter.getGraph(path);
    };
    getGroup(path: string): GGroup {
        return this.fairyAdapter.getGroup(path);
    };
    getSlider(path: string): GSlider {
        return this.fairyAdapter.getSlider(path);
    };
    getComboBox(path: string): GComboBox {
        return this.fairyAdapter.getComboBox(path);
    };
    getImage(path: string): GImage {
        return this.fairyAdapter.getImage(path);
    };
    getMovieClip(path: string): GMovieClip {
        return this.fairyAdapter.getMovieClip(path);
    };
    getController(path: string): Controller {
        return this.fairyAdapter.getController(path);
    };
    getTransition(path: string): Transition {
        return this.fairyAdapter.getTransition(path);
    };
    getButton(path: string, clickListener?: Function, parent?: GComponent): GButton {
        return this.fairyAdapter.getButton(path, clickListener, parent);
    };
    getWindow(path: string, closeListener?: Function, parent?: GComponent): Window {
        return this.fairyAdapter.getWindow(path, closeListener, parent);
    };
    protected mediatorAdapter: mvc.Mediator;
    get mediatorName(): string {
        return this.mediatorAdapter.mediatorName;
    }
    get viewComponent(): AppWindow {
        return this;
    }
    eventList: (string | mvc.IMediatorCaller)[];
    onRegister(): void { }
    onEvent(eventName: string, params: any): void { }
    onRemove(): void { }
}