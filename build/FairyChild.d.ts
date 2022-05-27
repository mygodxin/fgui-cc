import { Controller, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GMovieClip, GObject, GProgressBar, GRichTextField, GSlider, GTextField, GTextInput, Transition, Window } from "fairygui-cc";
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
export declare class FairyChild implements IFairyChildOnwer {
    private windowDict;
    static TEMP: FairyChild;
    protected owner: IFairyChildOnwer;
    protected viewComponent: GComponent;
    constructor(viewComponent?: any, owner?: IFairyChildOnwer);
    setRoot(viewRoot: GComponent, owner?: IFairyChildOnwer): FairyChild;
    onClickButton(button: GButton): void;
    onCloseWindow(window: Window): void;
    /**
     * 根据点运算符获取末端对象
     * @param path 点运算路径
     * @param view 要获取的对象的相对更路径
     * @param type 要获取对象的类型（全小写的对象类型名称）
     */
    protected getObj(path: string, view?: GComponent, type?: string): GObject | Controller | Transition;
    getComp(path: string): GComponent;
    getButton(path: string, clickListener?: Function, parent?: GComponent): GButton;
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
    getWindow(name: string, closeListener?: Function, parent?: GComponent): Window;
}
