import { Window } from "fairygui-cc";
export class AniWindow extends Window {
    constructor(comp) {
        super();
        this.contentPane = comp;
        this.modal = true;
        if (this.closeButton == null) {
            this.closeButton = comp.getChild("closeButton");
        }
        return this;
    }
    // doShowAnimation() {
    //     this.contentPane.getTransition('show').play(() => { this.onShown() });
    // }
    // doHideAnimation() {
    //     this.contentPane.getTransition('hide').play(() => { this.hideImmediately() });
    // }
    doShowAnimation() {
        this.touchable = false;
        const show = this.contentPane.getTransition('show');
        show && show.play(() => {
            this.onShowAniComplete();
        });
    }
    ;
    onShowAniComplete() {
        this.touchable = true;
        this.onShown();
    }
    ;
    doHideAnimation() {
        this.touchable = false;
        const hide = this.contentPane.getTransition('hide');
        hide && hide.play(() => {
            this.hideImmediately();
        });
    }
    ;
}
