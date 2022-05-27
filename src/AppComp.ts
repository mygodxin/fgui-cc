import { Controller, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GMovieClip, GObject, GProgressBar, GRichTextField, GSlider, GTextField, GTextInput, Transition, UIPackage, Window } from "fairygui-cc";
import { FairyChild } from "./FairyChild";
import { MediatorUiAdapter } from "./MediatorUiAdapter";


export class AppComp extends GComponent {
    contentPane: GComponent;
    private fairyAdapter;
    private mediatorAdapter;
    private uiMediators;
    constructor(viewComponent: GObject | string, pack?: string) {
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
    bindChild() { };
    onResize() { };
    onClickButton(button: GButton) { };
    onCloseWindow(window: Window) { };
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

    get mediatorName(): string {
        return this.mediatorAdapter.mediatorName;
    }
    get viewComponent(): AppComp {
        return this;
    }
    onRegister(): void { };
    onEvent(eventName: string, params?: any): void { };
    onRemove(): void { };
}