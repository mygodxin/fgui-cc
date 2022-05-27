import * as mvc from "simple-mvc-cc";
//FairyLoader本次加载任务最大重试次数
export const MAX_FUI_RETRY_NUM = 5;
export const EVT_SourceLoader_CompleteEvent = "EVT_SourceLoader_CompleteEvent";
export const EVT_SourceLoader_FailEvent = "EVT_SL_Fail";
export const EVT_SourceLoader_ErrorEvent = "EVT_SL_Error";
export const EVT_SourceLoader_ProgressEvent = "EVT_SourceLoader_ProgressEvent";
export class ASourceLoader {
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
