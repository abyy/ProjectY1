/**
* Created by arua on 14-7-31.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ButtonSkin = (function (_super) {
    __extends(ButtonSkin, _super);
    function ButtonSkin() {
        _super.call(this);
        this.skinParts = ["labelDisplay"];
        this.minWidth = 140;
        this.height = 60;
        this.states = ["up", "down", "disabled"];
    }
    ButtonSkin.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        var background = new egret.UIAsset();
        background.percentHeight = background.percentWidth = 100;
        background.source = "images/btn_start.png";
        this.addElement(background);

        this.labelDisplay = new egret.Label();
        this.labelDisplay.left = 10;
        this.labelDisplay.right = 10;
        this.labelDisplay.top = 10;
        this.labelDisplay.bottom = 10;
        this.labelDisplay.textAlign = egret.HorizontalAlign.CENTER;
        this.labelDisplay.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addElement(this.labelDisplay);
    };
    return ButtonSkin;
})(egret.Skin);
