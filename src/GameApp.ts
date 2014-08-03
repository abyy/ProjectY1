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

class GameApp extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private textContainer:egret.Sprite;
    private startBtn:egret.Bitmap;
    private appLogo:egret.Bitmap;
    private timerContainer:egret.Sprite;
    private scoreContainer:egret.Sprite;
    private scoreLbl:egret.TextField;

    private fruitImgs:egret.SpriteSheet;
    private fruits:egret.Bitmap[] = [];
    private fruitContainers:egret.Sprite[] = [];
    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;

        // 背景
        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;

        // Logo
        var appLogo:egret.Bitmap = this.createBitmapByName("logo");
        this.addChild(appLogo);
        appLogo.scaleX = 0.5;
        appLogo.scaleY = 0.5;
        appLogo.anchorX = 0.5;
        appLogo.x = stageW / 2;
        appLogo.y = 15;
        this.appLogo = appLogo;

        // 底部青蛙
        var frog:egret.Bitmap = this.createBitmapByName("frogImg");
        this.addChild(frog);
        frog.scaleX = frog.scaleY = 0.5;
        frog.anchorOffsetY = frog.height;
        frog.y = stageH;

        // 开始按钮
        var startBtn:egret.Bitmap = this.createBitmapByName("startBtn");
        this.addChild(startBtn);
        startBtn.anchorX = startBtn.anchorY = 0.5;
        startBtn.scaleX = startBtn.scaleY = 0.5;
        startBtn.x = stageW / 2;
        startBtn.y = stageH / 2;
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startBtnOnTouch,this);
        this.startBtn = startBtn;

        // 倒计时容器
        var timerContainer:egret.Sprite = new egret.Sprite();
        this.addChild(timerContainer);
        timerContainer.anchorX = 0.5;
        timerContainer.x = stageW / 2;
        timerContainer.y = 6;
        timerContainer.visible = false;
        this.timerContainer = timerContainer;

        // 倒计时icon
        var timerIcon:egret.Bitmap = this.createBitmapByName("timerImg");
        timerContainer.addChild(timerIcon);
        timerIcon.scaleX = timerIcon.scaleY = 0.5;
        timerIcon.x = -6;

        // 倒计时label
        var timerLbl:egret.TextField = new egret.TextField();
        timerContainer.addChild(timerLbl);
        timerLbl.text = "20,00";
        timerLbl.size = 14;
        timerLbl.x = timerIcon.width / 2 + timerIcon.x + 4;
        timerLbl.y = 8;

        // 得分容器
        var scoreContainer:egret.Sprite = new egret.Sprite();
        this.addChild(scoreContainer);
        scoreContainer.x = 8;
        scoreContainer.y = 14;
        scoreContainer.visible = false;
        this.scoreContainer = scoreContainer;

        // 得分标题
        var scoreHeadline:egret.TextField = new egret.TextField();
        scoreContainer.addChild(scoreHeadline);
        scoreHeadline.text = "得分";
        scoreHeadline.size = 14;

        // 得分label
        var scoreLbl:egret.TextField = new egret.TextField();
        scoreContainer.addChild(scoreLbl);
        scoreLbl.size = 14;
        scoreLbl.x = scoreHeadline.width + 4;
        this.scoreLbl = scoreLbl;

        // 水果初始化
        this.fruitImgs = RES.getRes("fruits");
        var fruits:egret.Bitmap[] = [this.createBitmapByName("fruitBg"),
                                        this.createBitmapByName("fruitBg"),
                                        this.createBitmapByName("fruitBg")];
        var fruitBgs:egret.Bitmap[] = [this.createBitmapByName("fruitBg"),
                                        this.createBitmapByName("fruitBg"),
                                        this.createBitmapByName("fruitBg")];
        var fruitContainers:egret.Sprite[] = [];
        for(var i=0;i<3;i++){
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
        fruits[1].scaleX = fruits[1].scaleY =
            fruits[2].scaleX = fruits[2].scaleY = 0.35;
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
    }

    private RefreshFruits() {
        var dif,other,difElement:number;

        dif = Math.random() * 12;
        other = Math.random() * 12;
        while(other == dif)
            other= Math.random() * 12;
        difElement = Math.random() * 3;

        dif = Math.floor(dif);
        other = Math.floor(other);
        difElement = Math.floor(difElement);

        for(var i=0;i<3;i=i+1){
            if(i == difElement)
                this.refreshFruit(this.fruits[i],dif);
            else
                this.refreshFruit(this.fruits[i],other);
            this.fruitContainers[i].visible = true;
            var fruitsTw = egret.Tween.get(this.fruitContainers[i]);
            this.fruitContainers[i].scaleX = this.fruitContainers[i].scaleY = 0;
            fruitsTw.to({
                "scaleX": 1,
                "scaleY": 1
            }, 200, egret.Ease.quintInOut);
        }
    }

    private refreshFruit(fruit:egret.Bitmap,index:number) {
        var fruits:egret.SpriteSheet = this.fruitImgs;
        var texture = fruits.getTexture("fruit" + index.toString());
        fruit.texture = texture;
    }

    private startBtnOnTouch()
    {
        this.startBtn.touchEnabled = false;
        this.HideStartView();
        this.ShowGameView();
    }

    private HideStartView(){
        var startbtnTw = egret.Tween.get(this.startBtn);
        var logoTw = egret.Tween.get(this.appLogo);
        logoTw.to({"y": -this.appLogo.height}, 200);
        startbtnTw.to({"alpha":0}, 200);
        startbtnTw.wait(200);
    }

    private ShowGameView(){
        this.timerContainer.visible = true;
        var timerTw = egret.Tween.get(this.timerContainer);
        var timerDefaultY:number = this.timerContainer.y;
        this.timerContainer.y = -this.timerContainer.height;
        timerTw.to({"y": timerDefaultY}, 200);

        this.scoreContainer.visible = true;
        var scoreTw = egret.Tween.get(this.scoreContainer);
        var scoreDefaultX:number = this.scoreContainer.x;
        this.scoreContainer.x = -this.scoreContainer.width;
        scoreTw.to({"x": scoreDefaultX}, 200);

        this.GameInit();
    }

    private score:number;
    private GameInit(){
        this.score = 0;
        this.scoreLbl.text = this.score.toString();

        this.RefreshFruits();
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    public createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     */
    private startAnimation(result:Array<any>):void{
        var textContainer:egret.Sprite = this.textContainer;
        var count:number = -1;
        var self:any = this;
        var change:Function = function() {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = egret.Tween.get(textContainer);
            tw.to({"alpha":1}, 200);
            tw.wait(2000);
            tw.to({"alpha":0}, 200);
            tw.call(change, this);
        }

        change();
    }
    /**
     * 切换描述内容
     */
    private changeDescription(textContainer:egret.Sprite, lineArr:Array<any>):void {
        textContainer.removeChildren();
        var w:number = 0;
        for (var i:number = 0; i < lineArr.length; i++) {
            var info:any = lineArr[i];
            var colorLabel:egret.TextField = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    }
}


