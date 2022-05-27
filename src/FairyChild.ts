import { Controller, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GMovieClip, GObject, GProgressBar, GRichTextField, GSlider, GTextField, GTextInput, Transition, Window } from "fairygui-cc";
import { AniWindow } from "./AniWindow";


export interface IFairyChildOnwer {
    onClickButton(view: GButton): void;
    onCloseWindow(window: Window): void;
}

export interface IFairyChild {
    setRoot(view: GComponent): void;
    getComp(path: string): GComponent;
    getButton(path: string): GButton;
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
    getWindow(path: string): Window;
}

export class FairyChild implements IFairyChildOnwer {
    private windowDict: { [name: string]: Window } = {};
    static TEMP: FairyChild;
    protected owner: IFairyChildOnwer;
    protected viewComponent: GComponent;
    constructor(viewComponent?: any, owner?: IFairyChildOnwer) {
        this.windowDict = {};
        this.setRoot(viewComponent, owner);
    }
    setRoot(viewRoot: GComponent, owner?: IFairyChildOnwer): FairyChild {
        this.viewComponent = viewRoot;
        this.owner = owner;
        if (!this.owner)
            this.owner = this;
        return this;
    }
    onClickButton(button: GButton): void {
        if (this.owner != this)
            this.owner.onClickButton(button);
    };
    onCloseWindow(window: Window): void {
        if (this.owner != this)
            this.owner.onCloseWindow(window);
    };
    /**
     * 根据点运算符获取末端对象
     * @param path 点运算路径
     * @param view 要获取的对象的相对更路径
     * @param type 要获取对象的类型（全小写的对象类型名称）
     */
    protected getObj(path: string, view?: GComponent, type?: string): GObject | Controller | Transition {
        if (type === void 0) { type = 'component'; }
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
    };
    getComp(path: string): GComponent {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GComponent;
    };
    getButton(path: string, clickListener?: Function, parent?: GComponent): GButton {
        var _this = this;
        if (parent == null)
            parent = this.viewComponent;
        var gobj = this.getObj(path, parent);
        if (gobj != null) {
            gobj && (gobj as GButton).onClick(function () {
                clickListener && clickListener.apply(_this.owner);
                _this.onClickButton(gobj as GButton);
            }, this);
        }
        return gobj == null ? null : gobj as GButton;
    };
    getLabel(path: string): GLabel {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GLabel;
    };
    getProgressBar(path: string): GProgressBar {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GProgressBar;
    };
    getTextField(path: string): GTextField {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GTextField;
    };
    getRichTextField(path: string): GRichTextField {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GRichTextField;
    };
    getTextInput(path: string): GTextInput {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GTextInput;
    };
    getLoader(path: string): GLoader {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GLoader;
    };
    getList(path: string): GList {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GList;
    };
    getGraph(path: string): GGraph {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GGraph;
    };
    getGroup(path: string): GGroup {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GGroup;
    };
    getSlider(path: string): GSlider {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GSlider;
    };
    getComboBox(path: string): GComboBox {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GComboBox;
    };
    getImage(path: string): GImage {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GImage;
    };
    getMovieClip(path: string): GMovieClip {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj as GMovieClip;
    };
    getController(path: string): Controller {
        return this.getObj(path, null, 'controller') as Controller;
    };
    getTransition(path: string): Transition {
        return this.getObj(path, null, 'transition') as Transition;
    };
    getWindow(name: string, closeListener?: Function, parent?: GComponent): Window {
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
    };
}