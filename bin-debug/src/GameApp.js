/**
* Copyright (c) 2014,Egret-Labs.org
* All rights reserved.
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of the Egret-Labs.org nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameApp = (function (_super) {
    __extends(GameApp, _super);
    function GameApp() {
        _super.call(this);
        this.fruits = [];
        this.fruitContainers = [];
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    GameApp.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };

    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    GameApp.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };

    /**
    * preload资源组加载完成
    */
    GameApp.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };

    /**
    * preload资源组加载进度
    */
    GameApp.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };

    /**
    * 创建游戏场景
    */
    GameApp.prototype.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;

        // 背景
        var sky = this.createBitmapByName("bgImage");
        this.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;

        // Logo
        var appLogo = this.createBitmapByName("logo");
        this.addChild(appLogo);
        appLogo.scaleX = 0.5;
        appLogo.scaleY = 0.5;
        appLogo.anchorX = 0.5;
        appLogo.x = stageW / 2;
        appLogo.y = 15;
        this.appLogo = appLogo;

        // 底部青蛙
        var frog = this.createBitmapByName("frogImg");
        this.addChild(frog);
        frog.scaleX = frog.scaleY = 0.5;
        frog.anchorOffsetY = frog.height;
        frog.y = stageH;

        // 开始按钮
        var startBtn = this.createBitmapByName("startBtn");
        this.addChild(startBtn);
        startBtn.anchorX = startBtn.anchorY = 0.5;
        startBtn.scaleX = startBtn.scaleY = 0.5;
        startBtn.x = stageW / 2;
        startBtn.y = stageH / 2;
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startBtnOnTouch, this);
        this.startBtn = startBtn;

        // 倒计时容器
        var timerContainer = new egret.Sprite();
        this.addChild(timerContainer);
        timerContainer.anchorX = 0.5;
        timerContainer.x = stageW / 2;
        timerContainer.y = 6;
        timerContainer.visible = false;
        this.timerContainer = timerContainer;

        // 倒计时icon
        var timerIcon = this.createBitmapByName("timerImg");
        timerContainer.addChild(timerIcon);
        timerIcon.scaleX = timerIcon.scaleY = 0.5;
        timerIcon.x = -6;

        // 倒计时label
        var timerLbl = new egret.TextField();
        timerContainer.addChild(timerLbl);
        timerLbl.text = "20,00";
        timerLbl.size = 14;
        timerLbl.x = timerIcon.width / 2 + timerIcon.x + 4;
        timerLbl.y = 8;

        // 得分容器
        var scoreContainer = new egret.Sprite();
        this.addChild(scoreContainer);
        scoreContainer.x = 8;
        scoreContainer.y = 14;
        scoreContainer.visible = false;
        this.scoreContainer = scoreContainer;

        // 得分标题
        var scoreHeadline = new egret.TextField();
        scoreContainer.addChild(scoreHeadline);
        scoreHeadline.text = "得分";
        scoreHeadline.size = 14;

        // 得分label
        var scoreLbl = new egret.TextField();
        scoreContainer.addChild(scoreLbl);
        scoreLbl.size = 14;
        scoreLbl.x = scoreHeadline.width + 4;
        this.scoreLbl = scoreLbl;

        // 水果初始化
        this.fruitImgs = RES.getRes("fruits");
        var fruits = [
            this.createBitmapByName("fruitBg"),
            this.createBitmapByName("fruitBg"),
            this.createBitmapByName("fruitBg")];
        var fruitBgs = [
            this.createBitmapByName("fruitBg"),
            this.createBitmapByName("fruitBg"),
            this.createBitmapByName("fruitBg")];
        var fruitContainers = [];
        for (var i = 0; i < 3; i++) {
            fruitContainers[i] = new egret.Sprite;
            this.addChild(fruitContainers[i]);
            fruitContainers[i].anchorX = fruitContainers[i].anchorY = 0.5;
            fruitContainers[i].x = stageW * (1.1 + 1.5 * i) / 5;
            fruitContainers[i].addChild(fruitBgs[i]);
            fruitContainers[i].addChild(fruits[i]);
            fruits[i].x = fruits[i].y = 10;
            fruitContainers[i].visible = false;
        }
        fruitContainers[0].y = stageH * 0.53;
        fruitContainers[1].y = stageH * 0.35;
        fruitContainers[2].y = stageH * 0.57;
        fruitBgs[0].scaleX = fruitBgs[0].scaleY = 0.5;
        fruitBgs[1].scaleX = fruitBgs[1].scaleY = 0.42;
        fruitBgs[2].scaleX = fruitBgs[2].scaleY = 0.45;
        fruits[0].scaleX = fruits[0].scaleY = 0.4;
        fruits[1].scaleX = fruits[1].scaleY = fruits[2].scaleX = fruits[2].scaleY = 0.35;
        this.fruits = fruits;
        this.fruitContainers = fruitContainers;
        /*
        var topMask:egret.Shape = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        //        this.addChild(topMask);
        
        var icon:egret.Bitmap = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        //        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;
        
        var colorLabel:egret.TextField = new egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        //        this.addChild(colorLabel);
        
        var textContainer:egret.Sprite = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        //        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;
        
        this.textContainer = textContainer;
        
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description",this.startAnimation,this)
        */
    };

    GameApp.prototype.RefreshFruits = function () {
        var dif, other, difElement;

        dif = Math.random() * 12;
        other = Math.random() * 12;
        while (other == dif)
            other = Math.random() * 12;
        difElement = Math.random() * 3;

        dif = Math.floor(dif);
        other = Math.floor(other);
        difElement = Math.floor(difElement);

        for (var i = 0; i < 3; i = i + 1) {
            if (i == difElement)
                this.refreshFruit(this.fruits[i], dif);
            else
                this.refreshFruit(this.fruits[i], other);
            this.fruitContainers[i].visible = true;
            var fruitsTw = egret.Tween.get(this.fruitContainers[i]);
            this.fruitContainers[i].scaleX = this.fruitContainers[i].scaleY = 0;
            fruitsTw.to({
                "scaleX": 1,
                "scaleY": 1
            }, 200, egret.Ease.quintInOut);
        }
    };

    GameApp.prototype.refreshFruit = function (fruit, index) {
        var fruits = this.fruitImgs;
        var texture = fruits.getTexture("fruit" + index.toString());
        fruit.texture = texture;
    };

    GameApp.prototype.startBtnOnTouch = function () {
        //        this.startBtn.touchEnabled = false;
        this.HideStartView();
        this.ShowGameView();
    };

    GameApp.prototype.HideStartView = function () {
        var startbtnTw = egret.Tween.get(this.startBtn);
        var logoTw = egret.Tween.get(this.appLogo);
        logoTw.to({ "y": -this.appLogo.height }, 200);
        startbtnTw.to({ "alpha": 0 }, 200);
        startbtnTw.wait(200);
    };

    GameApp.prototype.ShowGameView = function () {
        this.timerContainer.visible = true;
        var timerTw = egret.Tween.get(this.timerContainer);
        var timerDefaultY = this.timerContainer.y;
        this.timerContainer.y = -this.timerContainer.height;
        timerTw.to({ "y": timerDefaultY }, 200);

        this.scoreContainer.visible = true;
        var scoreTw = egret.Tween.get(this.scoreContainer);
        var scoreDefaultX = this.scoreContainer.x;
        this.scoreContainer.x = -this.scoreContainer.width;
        scoreTw.to({ "x": scoreDefaultX }, 200);

        this.GameInit();
    };

    GameApp.prototype.GameInit = function () {
        this.score = 0;
        this.scoreLbl.text = this.score.toString();

        this.RefreshFruits();
    };

    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    */
    GameApp.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };

    /**
    * 描述文件加载成功，开始播放动画
    */
    GameApp.prototype.startAnimation = function (result) {
        var textContainer = this.textContainer;
        var count = -1;
        var self = this;
        var change = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = egret.Tween.get(textContainer);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    };

    /**
    * 切换描述内容
    */
    GameApp.prototype.changeDescription = function (textContainer, lineArr) {
        textContainer.removeChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    };
    return GameApp;
})(egret.DisplayObjectContainer);
