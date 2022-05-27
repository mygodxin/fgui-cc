import * as mvc from "simple-mvc-cc";

export class MediatorUiAdapter extends mvc.Mediator {
    subMediators: mvc.IMediator[];
    owner: mvc.IMediator;
    constructor(name: any, view: any) {
        super(name, view);
        this.subMediators = [];
        this.owner = view;
        return this;
    }
    onShow(): void {
        mvc.registerMediator(this);
        for (let i = 0; i < this.subMediators.length; ++i) {
            mvc.registerMediator(this.subMediators[i]);
        }
    }
    onReady(): void {
        // mvc.send(EVT_UI_ONREADY, this.owner);
    }
    onHide(): void {
        mvc.removeMediator(this.mediatorName);
        for (var i = 0; i < this.subMediators.length; ++i) {
            mvc.removeMediator(this.subMediators[i].mediatorName);
        }
    }
    bindMediator(...args: mvc.IMediator[]): void {
        this.subMediators.push(...args);
    }
    onRegister(): void {
        this.owner && this.owner.onRegister && this.owner.onRegister();
    }
    get eventList(): (string | mvc.IMediatorCaller)[] {
        return this.owner ? this.owner.eventList || [] : [];
    }
    onEvent(eventName: string, params: any): void {
        this.owner && this.owner.onEvent && this.owner.onEvent(eventName, params);
    }
    onRemove(): void {
        this.owner && this.owner.onRemove && this.owner.onRemove();
    }
}