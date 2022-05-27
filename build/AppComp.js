import { GComponent, UIPackage } from "fairygui-cc";
import { FairyChild } from "./FairyChild";
import { MediatorUiAdapter } from "./MediatorUiAdapter";
export class AppComp extends GComponent {
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
