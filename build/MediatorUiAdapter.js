import * as mvc from "simple-mvc-cc";
export class MediatorUiAdapter extends mvc.Mediator {
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
