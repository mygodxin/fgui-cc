import { AppWindow } from "./AppWindow";
export declare class AppScene extends AppWindow {
    static current: AppScene;
    /**在部分场景中，如果直接使用instance of表达式可能会导致循环依赖的异常 */
    sceneName: string;
    static show(type: any, param?: any): AppScene;
    protected initConfig(): void;
    /** 场景显示，若已有场景，会自带切换功能(旧版逻辑在代码尾部，若遇到问题可参考) */
    show(): void;
    onHide(): void;
}
