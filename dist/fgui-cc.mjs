import { Window, GComponent, UIPackage, GRoot, AsyncOperation } from 'fairygui-cc';
import * as mvc from 'simple-mvc-cc';

class AniWindow extends Window {
    constructor(comp) {
        super();
        this.contentPane = comp;
        this.modal = true;
        if (this.closeButton == null) {
            this.closeButton = comp.getChild("closeButton");
        }
        return this;
    }
    // doShowAnimation() {
    //     this.contentPane.getTransition('show').play(() => { this.onShown() });
    // }
    // doHideAnimation() {
    //     this.contentPane.getTransition('hide').play(() => { this.hideImmediately() });
    // }
    doShowAnimation() {
        this.touchable = false;
        const show = this.contentPane.getTransition('show');
        show && show.play(() => {
            this.onShowAniComplete();
        });
    }
    ;
    onShowAniComplete() {
        this.touchable = true;
        this.onShown();
    }
    ;
    doHideAnimation() {
        this.touchable = false;
        const hide = this.contentPane.getTransition('hide');
        hide && hide.play(() => {
            this.hideImmediately();
        });
    }
    ;
}

class FairyChild {
    constructor(viewComponent, owner) {
        this.windowDict = {};
        this.windowDict = {};
        this.setRoot(viewComponent, owner);
    }
    setRoot(viewRoot, owner) {
        this.viewComponent = viewRoot;
        this.owner = owner;
        if (!this.owner)
            this.owner = this;
        return this;
    }
    onClickButton(button) {
        if (this.owner != this)
            this.owner.onClickButton(button);
    }
    ;
    onCloseWindow(window) {
        if (this.owner != this)
            this.owner.onCloseWindow(window);
    }
    ;
    /**
     * 根据点运算符获取末端对象
     * @param path 点运算路径
     * @param view 要获取的对象的相对更路径
     * @param type 要获取对象的类型（全小写的对象类型名称）
     */
    getObj(path, view, type) {
        if (type === void 0) {
            type = 'component';
        }
        var pathStr = path.split(".");
        var len = pathStr.length;
        if (view == null)
            view = this.viewComponent;
        for (var i = 0; i < len - 1; ++i) {
            view = view.getChild(pathStr[i]).asCom;
            if (view == null)
                return null;
        }
        switch (type) {
            case 'controller': return view ? view.getController(pathStr[i]) : null;
            case 'transition': return view ? view.getTransition(pathStr[i]) : null;
        }
        return view ? view.getChild(pathStr[i]) : null;
    }
    ;
    getComp(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getButton(path, clickListener, parent) {
        var _this = this;
        if (parent == null)
            parent = this.viewComponent;
        var gobj = this.getObj(path, parent);
        if (gobj != null) {
            gobj && gobj.onClick(function () {
                clickListener && clickListener.apply(_this.owner);
                _this.onClickButton(gobj);
            }, this);
        }
        return gobj == null ? null : gobj;
    }
    ;
    getLabel(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getProgressBar(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getTextField(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getRichTextField(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getTextInput(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getLoader(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getList(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getGraph(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getGroup(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getSlider(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getComboBox(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getImage(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getMovieClip(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getController(path) {
        return this.getObj(path, null, 'controller');
    }
    ;
    getTransition(path) {
        return this.getObj(path, null, 'transition');
    }
    ;
    getWindow(name, closeListener, parent) {
        var _this = this;
        if (parent == null)
            parent = this.viewComponent;
        if (this.windowDict[name] == null) {
            var win = new AniWindow(parent.getChild(name).asCom);
            if (win.closeButton == null) {
                win.closeButton = win.contentPane.getChild("closeButton");
            }
            if (win.closeButton != null) {
                win.closeButton.onClick(function () {
                    if (closeListener != null) {
                        closeListener.apply(_this.owner);
                    }
                    _this.onCloseWindow(win);
                }, this);
            }
            this.windowDict[name] = win;
        }
        return this.windowDict[name];
    }
    ;
}

class MediatorUiAdapter extends mvc.Mediator {
    constructor(name, view) {
        super(name, view);
        this.subMediators = [];
        this.owner = view;
        return this;
    }
    onShow() {
        mvc.registerMediator(this);
        for (let i = 0; i < this.subMediators.length; ++i) {
            mvc.registerMediator(this.subMediators[i]);
        }
    }
    onReady() {
        // mvc.send(EVT_UI_ONREADY, this.owner);
    }
    onHide() {
        mvc.removeMediator(this.mediatorName);
        for (var i = 0; i < this.subMediators.length; ++i) {
            mvc.removeMediator(this.subMediators[i].mediatorName);
        }
    }
    bindMediator(...args) {
        this.subMediators.push(...args);
    }
    onRegister() {
        this.owner && this.owner.onRegister && this.owner.onRegister();
    }
    get eventList() {
        return this.owner ? this.owner.eventList || [] : [];
    }
    onEvent(eventName, params) {
        this.owner && this.owner.onEvent && this.owner.onEvent(eventName, params);
    }
    onRemove() {
        this.owner && this.owner.onRemove && this.owner.onRemove();
    }
}

class AppComp extends GComponent {
    constructor(viewComponent, pack) {
        super();
        if (!viewComponent)
            return this;
        if (typeof viewComponent == "string") {
            if (pack && !UIPackage.getByName(pack)) {
                UIPackage.addPackage(pack); //前缀TODO
            }
            this.contentPane = UIPackage.createObject(pack, viewComponent).asCom;
        }
        else {
            this.contentPane = viewComponent.asCom;
        }
        this.addChild(this.contentPane);
        this.fairyAdapter = new FairyChild(this.contentPane, this);
        this.mediatorAdapter = new MediatorUiAdapter(pack + '/' + this.name, this);
        this.uiMediators = [this.mediatorAdapter];
        this.bindChild();
        return this;
    }
    bindChild() { }
    ;
    onResize() { }
    ;
    onClickButton(button) { }
    ;
    onCloseWindow(window) { }
    ;
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
    ;
    onEvent(eventName, params) { }
    ;
    onRemove() { }
    ;
}

class AlertTip extends AppComp {
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

const EVT_FAIRY_CLICK = 'EVT_FAIRY_CLICK';
const EVT_STAGE_ADDED = 'EVT_STAGE_ADDED';
const EVT_FAIRY_SHOW = 'EVT_FAIRY_SHOW';
const EVT_STAGE_REMOVED = 'EVT_STAGE_REMOVED';
const EVT_FAIRY_HIDE = 'EVT_FAIRY_HIDE';
const EVT_STAGE_RESIZE = 'EVT_STAGE_RESIZE';
const EVT_UI_ONREADY = 'EVT_UI_ONREADY';
const EVT_UI_ONHIDE = 'EVT_UI_ONHIDE';
var fairyUrlLocalPrefix = '';
var fairyUrlRemotePrefix = '';
function getFairyPath(obj) {
    var path = obj.name;
    while (obj.parent && obj.parent != GRoot.inst) {
        if (obj.parent.parent != null &&
            !(obj.parent.parent instanceof Window)) {
            path = obj.parent.name + '/' + path;
        }
        obj = obj.parent;
    }
    return path;
}
var instHistory = [];
function getFairyInstence(type, ...args) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < instHistory.length; ++i) {
        var item = instHistory[i];
        if (item.type == type)
            return item.inst;
    }
    var inst = new (type.bind.apply(type, [void 0].concat(args)))();
    instHistory.push({ type: type, inst: inst });
    return inst;
}

class AppWindow extends Window {
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
        this.prefix = fairyUrlRemotePrefix;
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

var EAlertType;
(function (EAlertType) {
    /** 显示两个按钮 */
    EAlertType[EAlertType["DOUBLE"] = 0] = "DOUBLE";
    /** 只显示左边的 */
    EAlertType[EAlertType["LEFT"] = 1] = "LEFT";
    /** 只显示右边的 */
    EAlertType[EAlertType["RIGHT"] = 2] = "RIGHT";
    /** 左右按钮颜色交换[TODO] */
    EAlertType[EAlertType["SWAP"] = 3] = "SWAP";
    /** 什么按钮都没有 */
    EAlertType[EAlertType["NONE"] = 4] = "NONE";
})(EAlertType || (EAlertType = {}));
/**
 *  Alert弹窗，具体界面由fairygui完成，需要遵循以下规则，即可快速完成一个Alert弹窗的制作
 * 1、必须放置一个命名为frame的组件，且里面有一个top控制器，控制closeButton是否显示，0不显示，1显示
 * 2、必须有两个按钮和一个文本框，且按钮需命名为leftButton,rightButton,文本框需命名为contentTextFiled
 * 3、使用方法为继承使用，列子如下
    export class AlertWindow extends kqframe.AlertWindow {
        static inst: AlertWindow;
        static show(content: string, param: kqframe.IAlertParam = {}): AlertWindow {
            if (AlertWindow.inst == null) {
                AlertWindow.inst = new AlertWindow('Alert', 'Gobang');
            }
            AlertWindow.inst.setAndShow(content,param);
            return AlertWindow.inst;
        }
    }
    //也可以直接创建一个全局函数，简化API，例子如下：
    function appAlert(content: string, param: kqframe.IAlertParam = {}) {
        if (null == kqframe.AlertWindow.inst) {
            kqframe.AlertWindow.inst = new kqframe.AlertWindow('Alert', 'Gobang');
        }
        return kqframe.AlertWindow.inst.setAndShow(content, param);
    }
 * 4、如果要默认配置一种类型的文本，可直接在fgui的ide里写死，若需要配置不同的名称，可继承AlertWindow扩展refurbish函数，如下：
    refurbish(){
        super.refurbish();
        this.leftButton.title = this.param.textL || (this.param.type == EAlertType.SWAP ? "取消" : "同意");
        this.rightButton.title = this.param.textR || (this.param.type == EAlertType.DOUBLE ? "拒绝" : "确定");
    }
 * 5、可使用import appAlert = AlertWindow.show 的方式，缩短访问路径
 */
class AlertWindow extends AppWindow {
    bindChild() {
        this.stateCtrl = this.getController('state');
        this.topCtrl = this.getController('frame.top');
        this.leftButton = this.getButton("leftButton");
        this.rightButton = this.getButton("rightButton");
        this.contentTextFiled = this.getTextField("contentTextFiled");
    }
    setAndShow(content, param) {
        if (param === void 0) {
            param = {};
        }
        this.contentString = content;
        this.param = param;
        this.show();
        return this;
    }
    refreshUi() {
        if (this.topCtrl)
            this.topCtrl.selectedIndex = this.param.noClose ? 1 : 0;
        if (this.param.type !== 1 && this.param.type !== 2 && this.param.type !== 3)
            this.param.type = 0;
        this.stateCtrl.selectedIndex = this.param.type;
        this.contentTextFiled.text = this.contentString;
        if (this.param.title)
            this.frame.icon = this.param.title;
        if (this.param.textL)
            this.leftButton.title = this.param.textL;
        if (this.param.textR)
            this.rightButton.title = this.param.textR;
    }
    onClickButton(button) {
        switch (button) {
            case this.leftButton:
                this.param.type == EAlertType.SWAP ? this.onClickRight() : this.onClickLeft();
                break;
            case this.rightButton:
                this.param.type == EAlertType.SWAP ? this.onClickLeft() : this.onClickRight();
                break;
        }
    }
    onClickLeft() {
        if (!this.param.stayL)
            this.hide();
        if (typeof this.param.subL == "function") {
            this.param.subL.call(this.param.objL || this.param.thisObj || this);
        }
    }
    onClickRight() {
        if (!this.param.stayL)
            this.hide();
        if (typeof this.param.subR == "function") {
            this.param.subR.call(this.param.objR || this.param.thisObj || this);
        }
    }
    hide() {
        super.hide();
        if (typeof this.param.onClose == "function") {
            this.param.onClose.call(this.param.objCLose || this.param.thisObj || this);
        }
    }
}

class AppScene extends AppWindow {
    static show(type, param) {
        var scene = getFairyInstence(type);
        scene && scene.showByParams(param);
        return scene;
    }
    initConfig() {
        this.modal = false;
        this.isCenter = false;
        this.isFullScreen = true;
        this.bringToFontOnClick = false;
    }
    /** 场景显示，若已有场景，会自带切换功能(旧版逻辑在代码尾部，若遇到问题可参考) */
    show() {
        let curChild = GRoot.inst._children.concat();
        for (var i = 1; i < curChild.length; i++) {
            let child = curChild[i];
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
    onHide() {
        mvc.off(EVT_STAGE_RESIZE, this.onResize, this);
    }
}

const EVT_SourceLoader_CompleteEvent = "EVT_SourceLoader_CompleteEvent";
const EVT_SourceLoader_FailEvent = "EVT_SL_Fail";
const EVT_SourceLoader_ErrorEvent = "EVT_SL_Error";
const EVT_SourceLoader_ProgressEvent = "EVT_SourceLoader_ProgressEvent";
class ASourceLoader {
    constructor() {
        this.progress = function (completedCount, totalCount) {
            this.completedCount = completedCount;
            this.totalCount = totalCount;
            mvc.send(EVT_SourceLoader_ProgressEvent, this);
        };
        this.loaded = false;
        this.callbacks = [];
        this.thisObjs = [];
        this.failbacks = [];
        this.failObjs = [];
        this.loading = false;
        this.retry = 0;
        this.startime = 0;
        this.loadtime = 0;
        //by myx
        this.completedCount = 0;
        this.totalCount = 0;
    }
    /**
     * 若正在加载过程中，重复调用，将只会注册不同的回调函数，但不会重复换起加载。
     * 加载成功后，将自动清除所有回调。
     *  若想维护监听状态，则不要传入回调函数，使用事件机制来处理回调。
     */
    load(callback, thisObj, atlases) {
        if (callback) {
            var cbidx = this.callbacks.indexOf(callback);
            var toidx = this.thisObjs.indexOf(thisObj);
            if (cbidx == -1 && toidx == -1) {
                this.callbacks.push(callback);
                this.thisObjs.push(thisObj);
            }
        }
        if (this.loaded) {
            this.complete();
            return;
        }
        if (this.loading) {
            return;
        }
        this.succeed = false;
        this.loading = true;
        this.startime = Date.now();
        this.loadtime = 0;
        this.retry += 1;
        this.start(atlases);
    }
    fail(callback, thisObj) {
        if (callback && thisObj) {
            var cbidx = this.failbacks.indexOf(callback);
            var toidx = this.failObjs.indexOf(thisObj);
            if (cbidx == -1 && toidx == -1) {
                this.failbacks.push(callback);
                this.failObjs.push(thisObj);
            }
        }
    }
    complete() {
        this.loading = false;
        this.succeed = true;
        this.loadtime += Date.now() - this.startime;
        mvc.send(EVT_SourceLoader_CompleteEvent, this);
        for (var i = 0; i < this.callbacks.length; ++i) {
            var cb = this.callbacks[i];
            var to = this.thisObjs[i];
            cb && cb.apply(to);
        }
        this.callbacks = [];
        this.thisObjs = [];
    }
    success() {
        this.isPreload = false;
        this.complete();
    }
    onfailed() {
        this.loading = false;
        this.failed = true;
        mvc.send(EVT_SourceLoader_FailEvent, this);
        for (var i = 0, j = this.failbacks.length; i < j; i++) {
            var cb = this.failbacks[i];
            var to = this.failObjs[i];
            cb && cb.apply(to);
        }
        this.failbacks = [];
        this.failObjs = [];
    }
}

class FairyLoader extends ASourceLoader {
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

class SourcePreLoader {
    constructor() {
        this.isLoading = false;
        this.isComplete = false;
        this.hasError = false;
        this.numRetrys = 5;
        mvc.on(EVT_SourceLoader_CompleteEvent, this.onItemLoaded, this);
        mvc.on(EVT_SourceLoader_ErrorEvent, this.onItemLoaded, this);
        this.loaderList = [];
    }
    addSource(...sourceLoader) {
        this.loaderList = sourceLoader;
        this._numSources = this.loaderList.length;
    }
    preload(index) {
        if (index === void 0) {
            index = 0;
        }
        if (this.isComplete) {
            return;
        }
        if (index >= this._numSources) {
            for (var i = 0; i < this._numSources; ++i) {
                var item_1 = this.loaderList[i];
                if (!item_1.loaded) {
                    if (item_1.retry < this.numRetrys) {
                        this.preload(i);
                        return;
                    }
                    else {
                        this.hasError = true;
                    }
                }
            }
            if (!this.hasError) {
                this.isComplete = true;
            }
            return;
        }
        var item = this.loaderList[index];
        if (item.loading || item.loaded) {
            this.preload(index + 1);
            return;
        }
        if (item.retry >= 7) {
            this.hasError = true;
            this.preload(index + 1);
            return;
        }
        this.isLoading = true;
        this.loadPosition = index;
        item.load();
    }
    onItemLoaded(sourceLoader) {
        var index = this.loaderList.indexOf(sourceLoader);
        if (index != -1 && this.loadPosition == index) {
            this.preload(index + 1);
        }
    }
    reload() {
        if (this.isLoading)
            return;
        if (this.isComplete && this.hasError) {
            this.isComplete = false;
            this.hasError = false;
            for (var i = 0; i < this.loaderList.length; ++i) {
                this.loaderList[i].retry = 0;
            }
            this.preload();
        }
    }
    forEach(callback) {
        for (var i = 0; i < this._numSources; ++i) {
            callback(i, this.loaderList[i]);
        }
    }
}

export { ASourceLoader, AlertTip, AlertWindow, AniWindow, AppComp, AppScene, AppWindow, EAlertType, EVT_FAIRY_CLICK, EVT_FAIRY_HIDE, EVT_FAIRY_SHOW, EVT_STAGE_ADDED, EVT_STAGE_REMOVED, EVT_STAGE_RESIZE, EVT_SourceLoader_CompleteEvent, EVT_SourceLoader_ErrorEvent, EVT_SourceLoader_FailEvent, EVT_SourceLoader_ProgressEvent, EVT_UI_ONHIDE, EVT_UI_ONREADY, FairyChild, FairyLoader, SourcePreLoader, getFairyInstence, getFairyPath };
