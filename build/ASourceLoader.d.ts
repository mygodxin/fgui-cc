import { IUISource } from "fairygui-cc/Window";
export declare const MAX_FUI_RETRY_NUM = 5;
export declare const EVT_SourceLoader_CompleteEvent = "EVT_SourceLoader_CompleteEvent";
export declare const EVT_SourceLoader_FailEvent = "EVT_SL_Fail";
export declare const EVT_SourceLoader_ErrorEvent = "EVT_SL_Error";
export declare const EVT_SourceLoader_ProgressEvent = "EVT_SourceLoader_ProgressEvent";
export declare abstract class ASourceLoader implements IUISource {
    fileName: string;
    /**file name 对应的包所有资源已经加载完成 */
    loaded: boolean;
    /**本次加载任务成功 */
    succeed: boolean;
    /**本次加载任务失败 */
    failed: boolean;
    /**本次任务是否预加载 */
    preload: boolean;
    callbacks: Function[];
    thisObjs: any[];
    loading: boolean;
    retry: number;
    startime: number;
    loadtime: number;
    completedCount: any;
    totalCount: any;
    isPreload: any;
    failbacks: any;
    failObjs: any;
    constructor();
    /**
     * 若正在加载过程中，重复调用，将只会注册不同的回调函数，但不会重复换起加载。
     * 加载成功后，将自动清除所有回调。
     *  若想维护监听状态，则不要传入回调函数，使用事件机制来处理回调。
     */
    load(callback?: Function, thisObj?: any, atlases?: number[]): void;
    fail(callback?: Function, thisObj?: any): void;
    /**
     * 由具体业务抽象实现加载过程
     */
    protected abstract start(atlases: number[]): any;
    protected complete(): void;
    protected success(): void;
    protected onfailed(): void;
    protected progress: (completedCount: any, totalCount: any) => void;
}
