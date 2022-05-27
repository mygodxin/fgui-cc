import * as mvc from "simple-mvc-cc";
export declare class MediatorUiAdapter extends mvc.Mediator {
    subMediators: mvc.IMediator[];
    owner: mvc.IMediator;
    constructor(name: any, view: any);
    onShow(): void;
    onReady(): void;
    onHide(): void;
    bindMediator(...args: mvc.IMediator[]): void;
    onRegister(): void;
    get eventList(): (string | mvc.IMediatorCaller)[];
    onEvent(eventName: string, params: any): void;
    onRemove(): void;
}
