import { GObject, GRoot, Window } from "fairygui-cc";

export const EVT_FAIRY_CLICK = 'EVT_FAIRY_CLICK';
export const EVT_STAGE_ADDED = 'EVT_STAGE_ADDED';
export const EVT_FAIRY_SHOW = 'EVT_FAIRY_SHOW';
export const EVT_STAGE_REMOVED = 'EVT_STAGE_REMOVED';
export const EVT_FAIRY_HIDE = 'EVT_FAIRY_HIDE';
export const EVT_STAGE_RESIZE = 'EVT_STAGE_RESIZE';
export const EVT_UI_ONREADY = 'EVT_UI_ONREADY';
export const EVT_UI_ONHIDE = 'EVT_UI_ONHIDE';
export var fairyUrlLocalPrefix = '';
export var fairyUrlRemotePrefix = '';
export function getFairyPath(obj) {
    var path = obj.name;
    while (obj.parent && obj.parent != GRoot.inst) {
        if (obj.parent.parent != null &&
            !(obj.parent.parent instanceof Window)) {
            path = obj.parent.name + '/' + path;
        }
        obj = obj.parent;
    }
    return path;
}
var instHistory = [];
export function getFairyInstence(type, ...args) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < instHistory.length; ++i) {
        var item = instHistory[i];
        if (item.type == type)
            return item.inst;
    }
    var inst = new (type.bind.apply(type, [void 0].concat(args)))();
    instHistory.push({ type: type, inst: inst });
    return inst;
}