import { AniWindow } from "./AniWindow";
export class FairyChild {
    constructor(viewComponent, owner) {
        this.windowDict = {};
        this.windowDict = {};
        this.setRoot(viewComponent, owner);
    }
    setRoot(viewRoot, owner) {
        this.viewComponent = viewRoot;
        this.owner = owner;
        if (!this.owner)
            this.owner = this;
        return this;
    }
    onClickButton(button) {
        if (this.owner != this)
            this.owner.onClickButton(button);
    }
    ;
    onCloseWindow(window) {
        if (this.owner != this)
            this.owner.onCloseWindow(window);
    }
    ;
    /**
     * 根据点运算符获取末端对象
     * @param path 点运算路径
     * @param view 要获取的对象的相对更路径
     * @param type 要获取对象的类型（全小写的对象类型名称）
     */
    getObj(path, view, type) {
        if (type === void 0) {
            type = 'component';
        }
        var pathStr = path.split(".");
        var len = pathStr.length;
        if (view == null)
            view = this.viewComponent;
        for (var i = 0; i < len - 1; ++i) {
            view = view.getChild(pathStr[i]).asCom;
            if (view == null)
                return null;
        }
        switch (type) {
            case 'controller': return view ? view.getController(pathStr[i]) : null;
            case 'transition': return view ? view.getTransition(pathStr[i]) : null;
        }
        return view ? view.getChild(pathStr[i]) : null;
    }
    ;
    getComp(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getButton(path, clickListener, parent) {
        var _this = this;
        if (parent == null)
            parent = this.viewComponent;
        var gobj = this.getObj(path, parent);
        if (gobj != null) {
            gobj && gobj.onClick(function () {
                clickListener && clickListener.apply(_this.owner);
                _this.onClickButton(gobj);
            }, this);
        }
        return gobj == null ? null : gobj;
    }
    ;
    getLabel(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getProgressBar(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getTextField(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getRichTextField(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getTextInput(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getLoader(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getList(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getGraph(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getGroup(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getSlider(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getComboBox(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getImage(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getMovieClip(path) {
        var gobj = this.getObj(path);
        return gobj == null ? null : gobj;
    }
    ;
    getController(path) {
        return this.getObj(path, null, 'controller');
    }
    ;
    getTransition(path) {
        return this.getObj(path, null, 'transition');
    }
    ;
    getWindow(name, closeListener, parent) {
        var _this = this;
        if (parent == null)
            parent = this.viewComponent;
        if (this.windowDict[name] == null) {
            var win = new AniWindow(parent.getChild(name).asCom);
            if (win.closeButton == null) {
                win.closeButton = win.contentPane.getChild("closeButton");
            }
            if (win.closeButton != null) {
                win.closeButton.onClick(function () {
                    if (closeListener != null) {
                        closeListener.apply(_this.owner);
                    }
                    _this.onCloseWindow(win);
                }, this);
            }
            this.windowDict[name] = win;
        }
        return this.windowDict[name];
    }
    ;
}
