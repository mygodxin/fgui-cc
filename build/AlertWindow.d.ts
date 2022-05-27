import { Controller, GButton, GTextField } from "fairygui-cc";
import { AppWindow } from "./AppWindow";
export interface IAlertParam {
    /** 按钮数量及颜色配置 */
    type?: EAlertType;
    /** 默认this指针 */
    thisObj?: any;
    /** 自定义左按钮文字 */
    textL?: string;
    /** 左按钮回调 */
    subL?: Function;
    /**  */
    objL?: any;
    /** 点击后界面是否停留不关闭 */
    stayL?: boolean;
    /** 自定义右按钮文字 */
    textR?: string;
    /** 右按钮回调 */
    subR?: Function;
    /**  */
    objR?: any;
    /** 点击后界面是否停留不关闭 */
    stayR?: boolean;
    title?: string;
    /** 没有关闭按钮 */
    noClose?: boolean;
    /** 关闭回调(只要关闭就会回调，和关闭方式无关) */
    onClose?: Function;
    /**  */
    objCLose?: any;
}
export declare enum EAlertType {
    /** 显示两个按钮 */
    DOUBLE = 0,
    /** 只显示左边的 */
    LEFT = 1,
    /** 只显示右边的 */
    RIGHT = 2,
    /** 左右按钮颜色交换[TODO] */
    SWAP = 3,
    /** 什么按钮都没有 */
    NONE = 4
}
/**
 *  Alert弹窗，具体界面由fairygui完成，需要遵循以下规则，即可快速完成一个Alert弹窗的制作
 * 1、必须放置一个命名为frame的组件，且里面有一个top控制器，控制closeButton是否显示，0不显示，1显示
 * 2、必须有两个按钮和一个文本框，且按钮需命名为leftButton,rightButton,文本框需命名为contentTextFiled
 * 3、使用方法为继承使用，列子如下
    export class AlertWindow extends kqframe.AlertWindow {
        static inst: AlertWindow;
        static show(content: string, param: kqframe.IAlertParam = {}): AlertWindow {
            if (AlertWindow.inst == null) {
                AlertWindow.inst = new AlertWindow('Alert', 'Gobang');
            }
            AlertWindow.inst.setAndShow(content,param);
            return AlertWindow.inst;
        }
    }
    //也可以直接创建一个全局函数，简化API，例子如下：
    function appAlert(content: string, param: kqframe.IAlertParam = {}) {
        if (null == kqframe.AlertWindow.inst) {
            kqframe.AlertWindow.inst = new kqframe.AlertWindow('Alert', 'Gobang');
        }
        return kqframe.AlertWindow.inst.setAndShow(content, param);
    }
 * 4、如果要默认配置一种类型的文本，可直接在fgui的ide里写死，若需要配置不同的名称，可继承AlertWindow扩展refurbish函数，如下：
    refurbish(){
        super.refurbish();
        this.leftButton.title = this.param.textL || (this.param.type == EAlertType.SWAP ? "取消" : "同意");
        this.rightButton.title = this.param.textR || (this.param.type == EAlertType.DOUBLE ? "拒绝" : "确定");
    }
 * 5、可使用import appAlert = AlertWindow.show 的方式，缩短访问路径
 */
export declare class AlertWindow extends AppWindow {
    static inst: AlertWindow;
    protected contentString: string;
    protected param: IAlertParam;
    protected stateCtrl: Controller;
    protected topCtrl: Controller;
    protected leftButton: GButton;
    protected rightButton: GButton;
    protected contentTextFiled: GTextField;
    bindChild(): void;
    setAndShow(content: string, param?: IAlertParam): AlertWindow;
    refreshUi(): void;
    onClickButton(button: GButton): void;
    onClickLeft(): void;
    onClickRight(): void;
    hide(): void;
}
