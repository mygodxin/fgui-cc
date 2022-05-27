import { IUISource } from "fairygui-cc/Window";
import * as mvc from "simple-mvc-cc";

export const EVT_SourceLoader_CompleteEvent = "EVT_SourceLoader_CompleteEvent";
export const EVT_SourceLoader_FailEvent = "EVT_SL_Fail";
export const EVT_SourceLoader_ErrorEvent = "EVT_SL_Error";
export const EVT_SourceLoader_ProgressEvent = "EVT_SourceLoader_ProgressEvent";
export abstract class ASourceLoader implements IUISource {
    fileName: string;
    loaded: boolean;
    callbacks: Function[];
    thisObjs: any[];
    loading: boolean;
    retry: number;
    startime: number;
    loadtime: number;
    completedCount: number;
    totalCount: number;
    constructor() {
        this.loaded = false;
        this.callbacks = [];
        this.thisObjs = [];
        this.loading = false;
        this.retry = 0;
        this.startime = 0;
        this.loadtime = 0;
        this.completedCount = 0;
        this.totalCount = 0;
    }
    /**
     * 若正在加载过程中，重复调用，将只会注册不同的回调函数，但不会重复换起加载。
     * 加载成功后，将自动清除所有回调。
     *  若想维护监听状态，则不要传入回调函数，使用事件机制来处理回调。
     */
    load(callback?: Function, thisObj?: any): void {
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
        this.loading = true;
        this.startime = Date.now();
        this.retry += 1;
        this.start();
    }
    /**
     * 由具体业务抽象实现加载过程
     */
    protected abstract start(): any;
    protected complete(): void {
        this.loading = false;
        this.loadtime += Date.now() - this.startime;
        for (var i = 0; i < this.callbacks.length; ++i) {
            var cb = this.callbacks[i];
            var to = this.thisObjs[i];
            cb && cb.apply(to);
        }
        mvc.send(EVT_SourceLoader_CompleteEvent, this);
    }
    protected success(): void {
        this.loaded = true;
        this.complete();
    }
    protected onfailed(): void {
        this.complete();
        mvc.send(EVT_SourceLoader_FailEvent, this);
    }

    protected progress = function (completedCount, totalCount) {
        this.completedCount = completedCount;
        this.totalCount = totalCount;
        mvc.send(EVT_SourceLoader_ProgressEvent, this);
    };
}