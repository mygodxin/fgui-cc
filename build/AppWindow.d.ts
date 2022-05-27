import * as mvc from "simple-mvc-cc";
import { Controller, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GMovieClip, GProgressBar, GRichTextField, GSlider, GTextField, GTextInput, Transition, Window } from "fairygui-cc";
import { IUISource } from "fairygui-cc/Window";
import { FairyChild, IFairyChild, IFairyChildOnwer } from "./FairyChild";
export declare class AppWindow extends Window implements IFairyChild, IFairyChildOnwer, mvc.IMediator {
    static configLoadingWaiting: string;
    static show(type: any, param?: any): AppWindow;
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
    constructor(name: string, pack: string, ...sources: IUISource[]);
    protected onStageEvent(type: string): void;
    protected initConfig(): void;
    show(): void;
    showByParams(param?: any): AppWindow;
    hide(): void;
    protected hideThenCall: Function;
    protected hideThenObj: any;
    hideThen(next: Function, nextObj: any): void;
    init(): void;
    protected loadingWaitPane: GComponent;
    protected showLoadingWait(): void;
    protected layoutLoadingWaitPane(): void;
    protected closeLoadingWait(): void;
    protected onInit(): void;
    protected topArea: GComponent;
    protected bottomArea: GComponent;
    protected centerArea: GComponent;
    protected transShowName: string;
    protected transHideName: string;
    protected doShowAnimation(): void;
    protected doHideAnimation(): void;
    protected onShowAniComplete(): void;
    protected onHideAniComplete(): void;
    onResize(): void;
    bindChild(): void;
    refreshUi(): void;
    onClickButton(button: GButton): void;
    onCloseWindow(window: Window): void;
    onSubWindowClose(win: AppWindow): void;
    /** 绑定在此窗口下的子窗口列表 */
    subWindowsList: {
        [name: string]: AppWindow;
    };
    /** 当前窗口绑定在哪个窗口下，缓存在此变量中 */
    ownerWindow: AppWindow;
    /** 注册一个子窗口，随后可以用字符串打开该窗口，并绑定了子窗口该子窗口，详见bindSubWindow */
    registerSubWindow(WinClass: any, name: string, pack?: string, tex?: string): AppWindow;
    /** 绑定一个窗口实例为当前窗口的子窗口，启动关闭将会有冒泡联动通知（比如：用于刷新） */
    bindSubWindow(win: AppWindow): AppWindow;
    /** 打开一个子窗口 */
    showSubWindow(name: string, openData?: any): AppWindow;
    /** 关闭所有子窗口 */
    closeAllSubWindow(): void;
    /** 刷新父窗口界面(使用场景举例：子界面某操作更新大厅数据) */
    refreshOwnerWindow(): void;
    protected uiMediators: mvc.IMediator[];
    registerMediators(): void;
    removeMediators(): void;
    protected fairyAdapter: FairyChild;
    setRoot(view: GComponent): void;
    getComp(path: string): GComponent;
    getLabel(path: string): GLabel;
    getProgressBar(path: string): GProgressBar;
    getTextField(path: string): GTextField;
    getRichTextField(path: string): GRichTextField;
    getTextInput(path: string): GTextInput;
    getLoader(path: string): GLoader;
    getList(path: string): GList;
    getGraph(path: string): GGraph;
    getGroup(path: string): GGroup;
    getSlider(path: string): GSlider;
    getComboBox(path: string): GComboBox;
    getImage(path: string): GImage;
    getMovieClip(path: string): GMovieClip;
    getController(path: string): Controller;
    getTransition(path: string): Transition;
    getButton(path: string, clickListener?: Function, parent?: GComponent): GButton;
    getWindow(path: string, closeListener?: Function, parent?: GComponent): Window;
    protected mediatorAdapter: mvc.Mediator;
    get mediatorName(): string;
    get viewComponent(): AppWindow;
    eventList: (string | mvc.IMediatorCaller)[];
    onRegister(): void;
    onEvent(eventName: string, params: any): void;
    onRemove(): void;
}
