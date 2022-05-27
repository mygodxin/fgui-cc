import { AppWindow } from "./AppWindow";
export var EAlertType;
(function (EAlertType) {
    /** 显示两个按钮 */
    EAlertType[EAlertType["DOUBLE"] = 0] = "DOUBLE";
    /** 只显示左边的 */
    EAlertType[EAlertType["LEFT"] = 1] = "LEFT";
    /** 只显示右边的 */
    EAlertType[EAlertType["RIGHT"] = 2] = "RIGHT";
    /** 左右按钮颜色交换[TODO] */
    EAlertType[EAlertType["SWAP"] = 3] = "SWAP";
    /** 什么按钮都没有 */
    EAlertType[EAlertType["NONE"] = 4] = "NONE";
})(EAlertType || (EAlertType = {}));
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
export class AlertWindow extends AppWindow {
    bindChild() {
        this.stateCtrl = this.getController('state');
        this.topCtrl = this.getController('frame.top');
        this.leftButton = this.getButton("leftButton");
        this.rightButton = this.getButton("rightButton");
        this.contentTextFiled = this.getTextField("contentTextFiled");
    }
    setAndShow(content, param) {
        if (param === void 0) {
            param = {};
        }
        this.contentString = content;
        this.param = param;
        this.show();
        return this;
    }
    refreshUi() {
        if (this.topCtrl)
            this.topCtrl.selectedIndex = this.param.noClose ? 1 : 0;
        if (this.param.type !== 1 && this.param.type !== 2 && this.param.type !== 3)
            this.param.type = 0;
        this.stateCtrl.selectedIndex = this.param.type;
        this.contentTextFiled.text = this.contentString;
        if (this.param.title)
            this.frame.icon = this.param.title;
        if (this.param.textL)
            this.leftButton.title = this.param.textL;
        if (this.param.textR)
            this.rightButton.title = this.param.textR;
    }
    onClickButton(button) {
        switch (button) {
            case this.leftButton:
                this.param.type == EAlertType.SWAP ? this.onClickRight() : this.onClickLeft();
                break;
            case this.rightButton:
                this.param.type == EAlertType.SWAP ? this.onClickLeft() : this.onClickRight();
                break;
        }
    }
    onClickLeft() {
        if (!this.param.stayL)
            this.hide();
        if (typeof this.param.subL == "function") {
            this.param.subL.call(this.param.objL || this.param.thisObj || this);
        }
    }
    onClickRight() {
        if (!this.param.stayL)
            this.hide();
        if (typeof this.param.subR == "function") {
            this.param.subR.call(this.param.objR || this.param.thisObj || this);
        }
    }
    hide() {
        super.hide();
        if (typeof this.param.onClose == "function") {
            this.param.onClose.call(this.param.objCLose || this.param.thisObj || this);
        }
    }
}
