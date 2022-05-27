import { EVT_SourceLoader_CompleteEvent, EVT_SourceLoader_ErrorEvent } from "./ASourceLoader";
import * as mvc from "simple-mvc-cc";
export class SourcePreLoader {
    constructor() {
        this.isLoading = false;
        this.isComplete = false;
        this.hasError = false;
        this.numRetrys = 5;
        mvc.on(EVT_SourceLoader_CompleteEvent, this.onItemLoaded, this);
        mvc.on(EVT_SourceLoader_ErrorEvent, this.onItemLoaded, this);
        this.loaderList = [];
    }
    addSource(...sourceLoader) {
        this.loaderList = sourceLoader;
        this._numSources = this.loaderList.length;
    }
    preload(index) {
        if (index === void 0) {
            index = 0;
        }
        if (this.isComplete) {
            return;
        }
        if (index >= this._numSources) {
            for (var i = 0; i < this._numSources; ++i) {
                var item_1 = this.loaderList[i];
                if (!item_1.loaded) {
                    if (item_1.retry < this.numRetrys) {
                        this.preload(i);
                        return;
                    }
                    else {
                        this.hasError = true;
                    }
                }
            }
            if (!this.hasError) {
                this.isComplete = true;
            }
            return;
        }
        var item = this.loaderList[index];
        if (item.loading || item.loaded) {
            this.preload(index + 1);
            return;
        }
        if (item.retry >= 7) {
            this.hasError = true;
            this.preload(index + 1);
            return;
        }
        this.isLoading = true;
        this.loadPosition = index;
        item.load();
    }
    onItemLoaded(sourceLoader) {
        var index = this.loaderList.indexOf(sourceLoader);
        if (index != -1 && this.loadPosition == index) {
            this.preload(index + 1);
        }
    }
    reload() {
        if (this.isLoading)
            return;
        if (this.isComplete && this.hasError) {
            this.isComplete = false;
            this.hasError = false;
            for (var i = 0; i < this.loaderList.length; ++i) {
                this.loaderList[i].retry = 0;
            }
            this.preload();
        }
    }
    forEach(callback) {
        for (var i = 0; i < this._numSources; ++i) {
            callback(i, this.loaderList[i]);
        }
    }
}
