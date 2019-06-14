import { Game4 } from './../../../../laya2/laya/src/newfunction/game/Game4';
import { RunData } from './../../newfunction/gamecore/util/RunData';
import { BaseObstacel } from "../obstacle/BaseObstacle";
import { PConfig } from '../../sheets/vo/PConfig';
import { Road } from "../road/Road";
import { RoadPlane } from "../road/RoadPlane";
import { GameCtrl } from '../Ctrl/GameCtrl';
import { ObstacelIcon, ICON_TYPE } from "../obstacle/ObstacelIcon";
import { BallSkin } from './../../sheets/vo/BallSkin';
import { BallAI } from './../ai/BallAI';
import { Build } from "../road/Build";
import { ObstacelFactory } from './../obstacle/ObstacelFactory2';
import { GameModel } from "../model/GameModel";
import { Color } from './../../sheets/vo/Color';
import { Ball } from "../ball/Ball";
import { GameSystem } from "./GameSystem";
import { wxInterface } from "../../wx/wxInterface";
import { TweenColor } from "../utils/TweenColor";
import { SoundUtils } from "../utils/SoundUtils";

export class GameScene extends Game4 {
    
    private maxspeed: number;//加速最大速度
    private minspeed: number;//默认速度
    // private curspeed: number;//当前速度
    // private subspeed: number;//减速度
    private offspeed: number;//max-min速度差
    private addspeedtime: number = 0;//加速时间
    private addspeedTargetTime: number = 0;//加速目标时间；
    private oldTime: number;
    private addspeed: boolean;
    private colorIndex: number;
    private robotSprite: Laya.Sprite3D;
    public isAdvRebron: number = 0;
    private maxReNum: number;
    private text_time: Laya.Label;
    private tweenFogcolor: TweenColor;
    private tweenLightcolor: TweenColor;
    public baoxiangnum: number = 0;
    //超过多少玩家
    public static overplayer: number = 0;
    //可能性
    public static perc: number = 0;

    constructor(is2d: boolean) {
        super();
        this.is2d = is2d;
        this.tweenFogcolor = new TweenColor(this.updateFogColor.bind(this));
        this.tweenLightcolor = new TweenColor(this.updateLightColor.bind(this));
        this.text_time = new Laya.Label();
        this.text_time.fontSize = 200;
        this.text_time.scale(1.5, 1.5);
        this.text_time.align = 'center';
        this.text_time.color = '#ffffff';
        this.text_time.centerX = 0;
        this.text_time.centerY = -200;
        this.itScGame();
    }



    private static mInstance: GameScene;
    public static get instance(): GameScene {
        return this.mInstance || (this.mInstance = new GameScene(false));
    }


    public lklsjdfkjs() {
        pScene = new THREE.Scene();
        pCamera = new THREE.OrthographicCamera(-1.2 * _unitLength / 1.4142, 1.2 * _unitLength / 1.4142, 1.2 * 7 / 4 * _unitLength / 1.4142, -(1.2 * _unitLength / 1.4142) / 4, 10, 100);
        pCamera.position.set(-_unitLength, -_unitLength, 2 * _unitLength);
        pCamera.lookAt(mat2Vector3(p12Center));
        pRenderer = new THREE.WebGLRenderer();
        pRenderer.setClearColor(new THREE.Color(0xffffff));
        pRenderer.setSize(frameLength, frameLength);
        var ambientLight = new THREE.AmbientLight(0xffffff);
        pScene.add(ambientLight);
        document.getElementById("plane").appendChild(pRenderer.domElement);
        triVsOnPlane = new THREE.Geometry();
        triVsOnPlane.vertices.push(mat2Vector3(p1));
        triVsOnPlane.vertices.push(mat2Vector3(p2));
        triVsOnPlane.vertices.push(v03);
        triVsOnPlane.vertices.push(mat2Vector3(p1));
        var material = new THREE.LineBasicMaterial({
            color: new THREE.Color(0x000000),
            linewidth: 1,
            linejoin: 'miter'//'bevel'
        });
        var tri = new THREE.Line(triVsOnPlane, material);
        pScene.add(tri);
        function makeLine(aP, aQ, aColor) {
            var gl = new THREE.Geometry();
            gl.vertices.push(mat2Vector3(aP));
            gl.vertices.push(mat2Vector3(aQ));
            var ml = new THREE.LineBasicMaterial({
                color: new THREE.Color(aColor),
                linewidth: 1,
                linejoin: 'miter'//'bevel'
            });
            return new THREE.Line(gl, ml);
        }

        lineR12 = makeLine(p03, p12, r12Color);
        lineR01 = makeLine(p01, p2, r01Color);
        lineR02 = makeLine(p02, p1, r02Color);

        lineR13 = makeLine(p13, p2, r13Color);
        lineR23 = makeLine(p12, p1, r23Color);
        pScene.add(lineR12);
        pScene.add(lineR01);
        pScene.add(lineR02);
        pScene.add(lineR13);
        pScene.add(lineR23);
        psC1 = makeSlicePoints(matPsofC1, c1Color);
        psC2 = makeSlicePoints(matPsofC2, c2Color);
        psC3 = makeSlicePoints(matPsofC3, c3Color);
        for (var j = 0; j < psC3.length; j++) {
            psC1[j].visible = false;
            psC2[j].visible = false;
            psC3[j].visible = false;
            pScene.add(psC1[j]);
            pScene.add(psC2[j]);
            pScene.add(psC3[j]);
        }
        pConv1 = makePConv();
        pConv2 = makePConv();
        pConv3 = makePConv();
        pConv1Mesh = makePConvMesh(pConv1, c1Color);
        pConv2Mesh = makePConvMesh(pConv2, c2Color);
        pConv3Mesh = makePConvMesh(pConv3, c3Color);
        pScene.add(pConv1Mesh);
        pScene.add(pConv2Mesh);
        pScene.add(pConv3Mesh);
        pGMp = makePoint(mat2Vector3(pGM), 5, 1.0, 0x000000);
        pGMp.visible = false;
        pScene.add(pGMp);
        pEigenp = makePoint(mat2Vector3(pEigen), 5, 1.0, 0xff0000);
        pEigenp.visible = false;
        pScene.add(pEigenp);
        makeText(pScene, "  2", p1);
        makeText(pScene, "3", p2);
        updateM();
        /**
         * 什么是生活，这是一个很大的概念，我觉得可以分开来理解，先理解生，而后才能谈活。
        什么是生，每个人从降生开始，生也就开始了。这里的生，讲的是一个存在的状态，是死的对立面。我们从出生开始就要维持这种生的状态，我们吃饭，喝水，对抗疾病，残疾，满足最基本的生理需求，来维持我们在这个世界上的存在，这就是生。
        而对于活呢？那是我们在满足了最基本的需求之后的其他活动。活，是一个过程。一个生命从诞生到逝去的过程。我们的学习，工作，社交，娱乐，情感等等，这就是一个活的过程。人生是很短暂的，多数人短短不过七八十年光阴，而正是因为短暂，选择怎么样的去活才显得更加重要。
        
        那我们总的来讲，对于生活你会选择怎样去选择呢。
        我有一个朋友，他早年辍学，很早就开始在社会上工作了，当然因为没有专业的技能只能从事简单的工作，出来大概6年的样子，存款十万左右，自己和他再次遇见是在去年6月的时候。那时候我觉着，他应该是很着急的，压力比较大的状态，因为我想的是他应该会是在操心生活和未来，操心怎么赚钱。但当我真正见到他时，我发现不是的，人家并没有我想象的对生活很急躁，有很大的压力。也没有说对自己的未来很担忧。他告诉我这几年还是在从事些简单的工作，一个月3000多的工资，不过已经有了些存款。他说打算买辆车，我和他说，可以把这些钱用去投点小生意，但是他还是去买了辆车。我问他对未来有什么打算吗，他说这几年先在当地工作看，过几年可能就回老家县城，那里工资也不算低了，自己家里在县城有房，而且离父母近，可以照顾到老人。我说不想好好奋斗下多赚点钱吗。他说这样的日子过得也很舒服了，找了个家附近的女朋友，不用过那么忙碌，压力大的生活，在家里朋友也很多。
        
        我想了下，确实啊，原来急躁的人是我，人活一辈子为了什么，其实是不为了什么的，除了解决生存，剩下的不是我们的自由吗，我们想怎么过就怎么过。这才是活的自由。之所以很多人觉得活着累，是因为放不下太多东西，想要追求的东西太多了，但是这是一种解释，当然不是说不该去奋斗，去追求很多东西，这也是每个人的自由。没有什么不同。
        生活很重要的是选择，你做出什么样的选择是自由的，而有决心，有勇气去排除各种社会的压力，各种人际间的干扰，坚持自己的选择才是最不容易的。你过的生活怎么样在于你怎么去对待生活，在于你怎么去选择你过的生活。我们一生最渴望的是什么，其实是自由，是选择的自由，对于生活最主要束缚我们自由的不是社会的压力，不是人际的干扰，而是我们自己。
        
        总而言之我想说的有三个
        第一，在满足生存的基础上你有选择的自由，你选择了生活，而不是生活选择了你
        第二，当你对当下生活不满意的时候，你也有改变的自由，只是看你有没有勇气去做决定
        第三，当你选择好了你怎样去生活，想要怎样的生活时，坚定自
         */

        monkey1Res = Laya.loader.getRes(monkey1Str),
            monkey2Res = Laya.loader.getRes(monkey2Str);
        this.ape = new Laya.Sprite();
        Laya.stage.addChild(this.ape);
        this.ape.pivot(55, 72);
        this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);

        this.switchTexture();

        this.ape.on(Laya.Event.CLICK, this, this.switchTexture);


        let monkey = (this.flag = !this.flag) ? monkey1Res : monkey2Res;

        this.ape.graphics.clear();
        this.ape.graphics.drawTexture(monkey, 0, 0);

        this.ape.size(monkey.width, monkey.height);

        const
            Sprite = Laya.Sprite;

        // 绘制底图
        gameContainer = new Sprite();
        Laya.stage.addChild(gameContainer);
        gameContainer.loadImage("res/guide/crazy_snowball.png");
        gameContainer.on(Laya.Event.CLICK, this, this.nextStep);

        // 引导所在容器
        guideContainer = new Sprite();
        Laya.stage.addChild(guideContainer);
        guideContainer.cacheAs = "bitmap";

        // 绘制遮罩区，含透明度，可见游戏背景
        maskArea = new Sprite();
        guideContainer.addChild(maskArea);
        maskArea.alpha = 0.5;
        maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");

        // 绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        interactionArea = new Sprite();
        guideContainer.addChild(interactionArea);
        // 设置叠加模式
        interactionArea.blendMode = "destination-out";

        // 设置点击区域
        hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
        guideContainer.hitArea = hitArea;
        guideContainer.mouseEnabled = true;

        tipContainer = new Sprite();
        Laya.stage.addChild(tipContainer);

        this.nextStep();

        if (guideStep === guideSteps.length) {
            Laya.stage.removeChild(guideContainer);
            Laya.stage.removeChild(tipContainer);
            return;
        }
        let step = guideSteps[guideStep++];

        hitArea.unHit.clear();
        hitArea.unHit.drawCircle(step.x, step.y, step.radius, "#000000");

        interactionArea.graphics.clear();
        interactionArea.graphics.drawCircle(step.x, step.y, step.radius, "#000000");

        tipContainer.graphics.clear();
        tipContainer.loadImage(step.tip);
        tipContainer.pos(step.tipx, step.tipy);


        let sp = new Laya.Sprite();
        Laya.stage.addChild(sp);
        //画线
        sp.graphics.drawLine(10, 58, 146, 58, "#ff0000", 3);
        //画连续直线
        sp.graphics.drawLines(176, 58, [0, 0, 39, -50, 78, 0, 117, 50, 156, 0], "#ff0000", 5);
        //画曲线
        sp.graphics.drawCurves(352, 58, [0, 0, 19, -100, 39, 0, 58, 100, 78, 0, 97, -100, 117, 0, 136, 100, 156, 0], "#ff0000", 5);
        //画矩形
        sp.graphics.drawRect(10, 166, 166, 90, "#ffff00");
        //画多边形
        sp.graphics.drawPoly(264, 166, [0, 0, 60, 0, 78.48, 57, 30, 93.48, -18.48, 57], "#ffff00");
        //画三角形
        sp.graphics.drawPoly(400, 166, [0, 100, 50, 0, 100, 100], "#ffff00");
        //画圆
        sp.graphics.drawCircle(98, 332, 50, "#00ffff");
        //画扇形
        sp.graphics.drawPie(240, 290, 100, 10, 60, "#00ffff");
        //绘制圆角矩形，自定义路径
        sp.graphics.drawPath(400, 310, [
            ["moveTo", 5, 0],
            ["lineTo", 105, 0],
            ["arcTo", 110, 0, 110, 5, 5],
            ["lineTo", 110, 55],
            ["arcTo", 110, 60, 105, 60, 5],
            ["lineTo", 5, 60],
            ["arcTo", 0, 60, 0, 55, 5],
            ["lineTo", 0, 5],
            ["arcTo", 0, 0, 5, 0, 5],
            ["closePath"]
        ],
            {
                fillStyle: "#00ffff"
            });

        const Sprite = Laya.Sprite;

        for (var i = 0; i < starCount; i++) {
            var tempBall = new Sprite();
            tempBall.loadImage("res/pixi/bubble_32x32.png");

            tempBall.x = (Math.random() * w) - slideX;
            tempBall.y = (Math.random() * h) - slideY;
            tempBall.pivot(16, 16);

            stars.push({
                sprite: tempBall,
                x: tempBall.x,
                y: tempBall.y
            });

            Laya.stage.addChild(tempBall);
        }

        Laya.stage.on('click', this, this.newWave);
        speedInfo.text = 'SX: ' + sx + '\nSY: ' + sy;

        this.resize();

        Laya.timer.frameLoop(1, this, this.update);

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }


        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }


        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

        var pcmArea = document.getElementById("pcm-info");
        var _str = "PCM <BR><BR>";
        _str += "N=" + _N + "<BR>";
        _str += "<TABLE border=\"1\">";
        for (var i = 0; i < _N; i++) {
            _str += "<TR>";
            for (var j = 0; j < i; j++) {
                _str += "<TD>";
                _str += "--";
                _str += "</TD>";
            }
            for (var j = i; j < _N; j++) {
                _str += '<TD>';
                _str += "" + _PCM.at(i, j);
                _str += "</TD>";
            }
            _str += "</TR>";
        }

    }

    private decoder(mtype) {

        /* eslint-disable no-unexpected-multiline */

        var gen = util.codegen(["r", "l"], mtype.name + "$decode")

            ("if(!(r instanceof Reader))")

            ("r=Reader.create(r)")

            ("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function (field) { return field.map; }).length ? ",k" : ""))

            ("while(r.pos<c){")

            ("var t=r.uint32()");

        if (mtype.group) gen

            ("if((t&7)===4)")

            ("break");

        gen

            ("switch(t>>>3){");



        var i = 0;

        for (; i < /* initializes */ mtype.fieldsArray.length; ++i) {

            var field = mtype._fieldsArray[i].resolve(),

                type = field.resolvedType instanceof Enum ? "int32" : field.type,

                ref = "m" + util.safeProp(field.name); gen

                    ("case %i:", field.id);



            // Map fields

            if (field.map) {
                gen

                    ("r.skip().pos++") // assumes id 1 + key wireType

                ("if(%s===util.emptyObject)", ref)

                ("%s={}", ref)

                ("k=r.%s()", field.keyType)

                ("r.pos++"); // assumes id 2 + value wireType

                if (types.long[field.keyType] !== undefined) {

                    if (types.basic[type] === undefined) gen

                        ("%s[typeof k===\"object\"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())", ref, i); // can't be groups

                    else gen

                        ("%s[typeof k===\"object\"?util.longToHash(k):k]=r.%s()", ref, type);

                } else {

                    if (types.basic[type] === undefined) gen

                        ("%s[k]=types[%i].decode(r,r.uint32())", ref, i); // can't be groups

                    else gen

                        ("%s[k]=r.%s()", ref, type);

                }



                // Repeated fields

            } else if (field.repeated) {
                gen



                    ("if(!(%s&&%s.length))", ref, ref)

                ("%s=[]", ref);



                // Packable (always check for forward and backward compatiblity)

                if (types.packed[type] !== undefined) gen

                    ("if((t&7)===2){")

                    ("var c2=r.uint32()+r.pos")

                    ("while(r.pos<c2)")

                    ("%s.push(r.%s())", ref, type)

                    ("}else");



                // Non-packed

                if (types.basic[type] === undefined) gen(field.resolvedType.group

                    ? "%s.push(types[%i].decode(r))"

                    : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);

                else gen

                    ("%s.push(r.%s())", ref, type);



                // Non-repeated

            } else if (types.basic[type] === undefined) gen(field.resolvedType.group

                ? "%s=types[%i].decode(r)"

                : "%s=types[%i].decode(r,r.uint32())", ref, i);

            else gen

                ("%s=r.%s()", ref, type);

            gen

                ("break");

            // Unknown fields

        } gen

            ("default:")

            ("r.skipType(t&7)")

            ("break")



            ("}")

            ("}");



        // Field presence

        for (i = 0; i < mtype._fieldsArray.length; ++i) {

            var rfield = mtype._fieldsArray[i];

            if (rfield.required) gen

                ("if(!m.hasOwnProperty(%j))", rfield.name)

                ("throw util.ProtocolError(%j,{instance:m})", missing(rfield));

        }

        commentType = source.charAt(start++);

        commentLine = line;

        commentLineEmpty = false;

        var lookback;

        if (alternateCommentMode) {

            lookback = 2;  // alternate comment parsing: "//" or "/*"

        } else {

            lookback = 3;  // "///" or "/**"

        }

        var commentOffset = start - lookback,

            c;

        do {

            if (--commentOffset < 0 ||

                (c = source.charAt(commentOffset)) === "\n") {

                commentLineEmpty = true;

                break;

            }

        } while (c === " " || c === "\t");

        var lines = source

            .substring(start, end)

            .split(setCommentSplitRe);

        for (var i = 0; i < lines.length; ++i)

            lines[i] = lines[i]

                .replace(alternateCommentMode ? setCommentAltRe : setCommentRe, "")

                .trim();

        commentText = lines

            .join("\n")

            .trim();
        return gen

            ("return m");

        /* eslint-enable no-unexpected-multiline */


    }






    private itScGame(): void {
        this.colorIndex = ~~PConfig.get(1015).value;
        this.initCamera();//初始化相机
        this.initRoad();
        this.initBall();
        this.initLight();
        this.changeColor();
        this.maxspeed = ~~PConfig.get(1003).value;
        this.minspeed = ~~PConfig.get(1001).value;
        this.offspeed = this.maxspeed - this.minspeed;
        this.addspeedtime = (~~PConfig.get(1004).value);
        GameScene.perc = ~~PConfig.get(1011).value;
        GameScene.overplayer = ~~PConfig.get(1012).value;
    }

    public gameing: boolean = false;
    public readyGame(isChnageColor: boolean = true): void {
        this.baoxiangnum = 0;
        this.ball.setactivie(true);
        if (this.is2d) {
            this.colorIndex = GMath.random(0, 5, true);
        }
        else {
            GameModel.isntance.stepcount = 0;
        }
        isChnageColor && this.changeColor();
        this.colorIndex++;
        ObstacelFactory.starttime = Laya.timer.currTimer;
        this.reset();
        this.maxReNum = ~~PConfig.get(1009).value;
    }

    public startGame(): void {
        //开启重力监听
        if (typeof wx != "undefined") {
            this.startGyroscope();
        }

        if (typeof wx != 'undefined') {
            wx.onGyroscopeChange((res: any) => {
                // console.log("重力监听=========", JSON.stringify(res));
            })
        }

        this.initEvent();
        if (!this.is2d) {
            SoundUtils.instance.playBGM(GameSystem.MUSIC_BG1);
        }
        this.isOver = false;
        this.gameing = true;
        this.isAdvRebron = 0;
        ObstacelFactory.starttime = Laya.timer.currTimer;
    }


    public startGyroscope() {
        if (typeof wx != 'undefined') {
            wx.startGyroscope({
                interval: 'game', success: () => {
                    // console.log("重力监听开启成功")
                }, fail: () => {
                    this.startGyroscope();
                }
            });
        }
    }

    private waittime: number = 3;
    public conitnueGame(): void {
        this.isAdvRebron++;
        this.waittime = 3;
        this.road.curLine.clearbycontinue();
        this.ball.setactivie(true);
        Laya.stage.addChild(this.text_time);
        Laya.timer.loop(1000, this, this.waitGame);
        this.waitGame();
        this.ball.setX(0);
        var pos: Laya.Vector3 = this.camera.transform.localPosition;
        var cameraZ: number;
        var ballz: number = this.ball.transform.position.z;
        pos.x = 0;
        pos.z = (ballz - 3);
        this.camera.transform.localPosition = pos;
        var euler: Laya.Vector3 = this.camera.transform.localRotationEuler;
        euler.z = 0;
        this.camera.transform.localRotationEuler = euler;
    }

    private waitGame(): void {
        this.text_time.text = this.waittime + '';
        this.waittime--;
        if (this.waittime < 0) {
            Laya.timer.clear(this, this.waitGame);
            this.text_time.removeSelf();
            this._continueGame();
        }
    }

    private _continueGame(): void {
        this.initEvent();
        this.isOver = false;
        this.bufftime = 60;
        if (!this.is2d) {
            // SoundUtils.instance.playBGM();
        }
        this.road.stopAll(false)
    }

    private defCameraY: number = 0;
    private bufftime: number = 0;
    private reset(): void {
        this.moveangle = 0;
        this.cameraMovecoe = 0;
        this.camera.clearColor = this.fogColor2;

        this.road.reset(this.fogColor2);
        this.ball.transform.localPosition = new Laya.Vector3(0, 0.25, this.defBallZ);
        this.ballAI && this.ballAI.reset();
        this.road.transform.localPosition = new Laya.Vector3(0, -1, 0);
        //调整相机位置
        var pos: Laya.Vector3 = this.camera.transform.localPosition;
        pos.x = 0;
        pos.y = this.defCameraY;
        pos.z = this.cameraDefaultZ;
        this.camera.transform.localPosition = pos;
        this.camera.transform.localRotationEuler = GameScene.autoCameraRotation.clone();
        this.isOver = false;
        this.scroll(0, 0, false);
    }
    public static autoCameraRotation: Laya.Vector3 = new Laya.Vector3(-3, 180, 0);
    private lightcolor: Laya.Vector3 = new Laya.Vector3(1, 1, 1);
    private updateFogColor() {
        this.fogColor2.x = this.tweenFogcolor.curR;
        this.fogColor2.y = this.tweenFogcolor.curG;
        this.fogColor2.z = this.tweenFogcolor.curB;
        this.road.changeFog(this.fogColor2);
        this.ball.fogcolor = this.fogColor2;
        this.camera.clearColor = this.fogColor2;

    }

    private updateLightColor() {
        let a = ths.tweenLightcolor;
        this.lightcolor.x = this.tweenLightcolor.curR;
        this.lightcolor.y = this.tweenLightcolor.curG;
        this.lightcolor.z = this.tweenLightcolor.curB;
        this.pointLight.color = this.lightcolor;
        // this.ambientColor = this.lightcolor.;
    }
    private changeColor(): void {
        var vo: Color = Color.getCurColor(this.colorIndex);
        this.tweenFogcolor.startstr = vo.fog;
        this.tweenLightcolor.startstr = vo.light;
        if (!this.is2d) {
            Build.defColor = vo.defColor;
        }
        this.road.curLine.res = vo.skin;
    }

    private initLight(): void {
        this.pointLight = this.camera.addChild(new Laya.PointLight()) as Laya.PointLight;
        this.pointLight.intensity = 1.2;
        // this.pointLight.color = new Laya.Vector3(1,1,1);
        this.pointLight.transform.translate(new Laya.Vector3(0, 200, -10))
    }


    private initRoad(): void {
        this.road = new Road(this.is2d);
        this.addChild(this.road);
        this.road.createRoad();
        this.road.transform.localPosition = new Laya.Vector3(0, -1, 0)
        if (!this.is2d) {
            this.robotSprite = new Laya.Sprite3D();
            this.road.addChild(this.robotSprite);
            this.ballAI = new BallAI(this.road, this.robotSprite);
        }
    }

    private defBallZ: number = 4;
    private initBall(): void {
        this.ball = new Ball();
        this.ball.isuser = true;
        this.ball.setPos(0, 0.25, this.defBallZ);
        this.ball.skin = "tex/skin0.png";
        this.ball.afterSkin = "tex/trail0.png";
        this.road.addChild(this.ball);
        this.ball.changeBallRotate(0, 90);
        this.ball.addAfter(this);
    }

    public showTuijianSkin(): void {
        this.ball.transform.localPosition = new Laya.Vector3(0, 0.25, this.defBallZ);
        this.road.transform.position = new Laya.Vector3(0, 0, 0);
        this.readyGame();
        this.startGame();
        this.ball.setweibaStyle(2);
        this.onUp();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onDown);
        // this.camera.transform.localRotationEuler = GameScene.autoCameraRotation.clone();
    }

    private skin2D: boolean = false;
    private skin2Doffz: number = -1.5;
    private skin2Doffx: number = -2;
    public showShopSkin(): void {
        this.skin2D = true;
        this.ball.transform.localPosition = new Laya.Vector3(0, 0.25, this.defBallZ);
        this.road.transform.position = new Laya.Vector3(0, 0, 0);
        // this.camera.orthographic = true;
        // this.camera.orthographicVerticalSize = 1;

        this.readyGame();
        this.startGame();
        this.ball.setweibaStyle(3);

        var pos: Laya.Vector3 = this.camera.transform.localPosition;
        pos.x = this.skin2Doffx;
        pos.y = 1.5;
        pos.z = this.ball.transform.position.z + this.skin2Doffz;
        this.camera.transform.localPosition = pos;
        this.camera.fieldOfView = 20;
        this.camera.transform.localPosition = pos;
        pos = this.ball.transform.position.clone();
        pos.x -= 0;
        pos.z += 0;
        this.camera.transform.lookAt(pos, Laya.Vector3.UnitY, false)
        // if (Laya.Browser.onPC) {
        var stage: Laya.Stage = Laya.stage;
        this.camera.viewport = new Laya.Viewport(0, 120 * stage.clientScaleY, 750 * stage.clientScaleX, 340 * stage.clientScaleY);
        // } else if (Laya.Browser.onMobile) {
        //     this.camera.viewport = new Laya.Viewport(0, 128, 750, 360);
        // }
        if (Laya.Browser.onPC) {
            this.camera.viewport = new Laya.Viewport(0, 50, 750, 200);
        } else if (Laya.Browser.onMobile) {
            this.camera.viewport = new Laya.Viewport(0, 128, 750, 360);
        }
        this.onUp();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onDown);

    }

    private cameraDefaultZ: number = 1;


    private moveangle: number = 0;
    private leftMoveBall(): void {
        if (!this.is2d) return;
        var pos: Laya.Vector3 = this.ball.transform.localPosition;
        this.moveangle += 2;
        var radius: number = this.moveangle * Math.PI / 180;
        if (this.skin2D) {
            pos.x = Math.sin(radius) * 0.5 - 0.2;
        }
        else {
            pos.x = Math.sin(radius) * 0.8;
        }
        this.ball.transform.localPosition = pos;
        // console.log("left============================");

    }

    public changeSKin(skin: BallSkin): void {
        this.ball.skin = skin.skin;
        this.ball.afterSkin = skin.afterSin;
    }

    public getBallSkin(): BallSkin {
        var now_skin: BallSkin = new BallSkin();
        now_skin.skin = this.ball.skin;
        now_skin.afterSin = this.ball.afterSkin;
        return now_skin;
    }
    public initEvent(): void {
        this.changeColortime = 0;
        this.addspeedTargetTime = 0;
        this.addspeed = false;
        this.oldTime = getTimer();
        this.timerLoop(1, this, this.loop);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
    }


    public removeEvent(): void {
        this.clearTimer(this, this.loop);
        this.onUp();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onDown);
    }
    /**
     * 
     */
    private isMouseDown: boolean = false;
    private onDown(): void {
        SoundUtils.instance.playSound(GameSystem.MUSIC_DIANJI)
        this.isMouseDown = true;
        this.lastBallX = this.ball.transform.localPosition.x;
        this.lastMouseX = Laya.MouseManager.instance.mouseX;
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onUp)
        // console.log("鼠标按下==================")
    }

    private onUp(): void {
        this.isMouseDown = false;
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onUp);
    }

    private ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
    private lastMouseX: number;
    private lastBallX: number;
    private _outHitInfo: Laya.RaycastHit = new Laya.RaycastHit;
    private _offset = new Laya.Vector3(0, 0, 0);
    private _vector3 = new Laya.Vector3();
    private onMove(): void {
        //两种方式控制移动。1 重力 2手滑
        var nowx: number = Laya.MouseManager.instance.mouseX;


        // console.log("nowx", nowx)
        var coe: number = (nowx - this.lastMouseX) / (100 * Laya.stage.clientScaleX);
        nowx = Math.min(1.2, Math.max(-1.2, this.lastBallX - coe));
        this.ball.setX(nowx);
        var cameraRoatationz: number = -nowx / 1.2 * 10;
        var euler: Laya.Vector3 = this.camera.transform.localRotationEuler;
        euler.z = cameraRoatationz;
        this.camera.transform.localRotationEuler = euler;
    }





    //87e1de
    public fogColor2: Laya.Vector4 = new Laya.Vector4(104 / 255, 0.8, 0.8, 1)
    public initCamera(): void {
        Laya.stage.bgColor = '#ffffffff';
        this.camera = new Laya.Camera(0, 0.01, 40);
        this.addChild(this.camera);
        this.camera.clearColor = this.fogColor2;
        //this.camera.transform.rotation = new Laya.Quaternion(-0.08, 0, 0, 1);//相机旋转一下，能够看的到上下路的区别
        var pos: Laya.Vector3 = this.camera.transform.localPosition;
        this.camera.transform.localRotationEuler = GameScene.autoCameraRotation.clone();

        pos.x = 0;
        pos.y = this.defCameraY;
        pos.z = this.cameraDefaultZ;
        this.camera.transform.localPosition = pos;

    }
    private changeColortime: number = 0;
    //wlb
    private loop(): void {

        if (this.isOver) return;
        if (!this.is2d) {
            this.changeColortime++;
            if (this.changeColortime % 500 == 0) {
                this.colorIndex++;
                var vo: Color = Color.getCurColor(this.colorIndex);
                this.tweenFogcolor.tween(vo.fog, 3000);
                this.tweenLightcolor.tween(vo.light, 3000);
                if (!this.is2d) {
                    Build.defColor = vo.defColor;
                }
                //this.pointLight.color = vo.lightColor;
                this.road.curLine.res = vo.skin;
            }
            this.tweenFogcolor.loop();
            this.tweenLightcolor.loop();
        }
        if (this.isMouseDown) {
            this.onMove();
        }
        this.leftMoveBall();

        var curTime: number = getTimer();
        var dt: number = curTime - this.oldTime;
        this.oldTime = curTime;
        this.addspeed = false;
        var curspeed: number;
        var speedcoe: number = 0;
        if (this.is2d) {
            curspeed = this.skin2D ? 1 : 2;
        }
        else {
            var offtime: number = this.addspeedTargetTime - curTime;
            //  offtime = 4000;
            if (offtime > this.addspeedtime) {
                speedcoe = 1;
                curspeed = this.maxspeed;
                this.addspeed = true;
            }
            else if (offtime > 0) {
                speedcoe = offtime / this.addspeedtime;
                // if(this.ball.jump)
                // {
                //     speedcoe*=0.5;
                // }
                curspeed = this.maxspeed * speedcoe + this.minspeed * (1 - speedcoe);
                this.addspeed = true;
            }
            else {
                speedcoe = 0;
                curspeed = this.minspeed;
                this.addspeed = false;
                // curspeed =0;
                // this.road.curLine.drawWind(1);
            }
        }
        this.ball.speedCoe = speedcoe;
        this.road.drawWind(speedcoe);
        var speed: number = curspeed / 50;
        GameModel.isntance.stepcount += speed * 0.2;
        this.scroll(speed, speedcoe, this.addspeed);
        if (this.bufftime > 0) {
            this.bufftime--;
        }

        if (!this.ball.jump) this.hit();
    }
    private isUp: number = 0;
    private scroll(speed: number, speedcoe: number, addSpeed: boolean): void {
        this.ball.scroll(speed);
        var ballx: number = this.ball.transform.position.x;
        var ballz: number = this.ball.transform.position.z;
        this.road.scroll(speed, speedcoe, ballx, ballz);
        this.ballAI && this.ballAI.loop();
        var pos: Laya.Vector3 = this.camera.transform.localPosition;
        var cameraZ: number;
        // var cameraX:number;
        if (this.is2d) {
            cameraZ = ballz - 3;
            if (this.skin2D) {
                // pos.x = this.skin2Doffx;
                // pos.y = 0.5;
                pos.z = this.ball.transform.position.z + this.skin2Doffz;
                //this.camera.transform.lookAt(this.ball.transform.position,Laya.Vector3.UnitY,false)

            }
            else {
                pos.y = -0.2;
                pos.z = pos.z * 0.93 + cameraZ * 0.07;

            }
        }
        else {

            pos.x = ballx * 1.4 / RoadPlane.long;
            // pos.y = this.cameraMinY*speedcoe+this.cameraMaxY*(1-speedcoe);
            speedcoe *= 0.8;
            this.cameraMovecoe = this.cameraMovecoe * 0.91 + speedcoe * 0.09;
            pos.z = pos.z * this.cameraMovecoe + (ballz - 3) * (1 - this.cameraMovecoe);
        }
        this.camera.transform.localPosition = pos;
    }

    private cameraMovecoe: number = 1;
    private isOver: boolean = false;
    private overgame(): void {

        this.ball.setactivie(false);
        this.gameing = false;
        this.isOver = true;
        this.removeEvent();
        this.road.stopAll(true);

        GameCtrl.getInstance().runLogic(CGAMES.END);

    }

    public stop2d(): void {
        this.removeEvent();
        this.ball.dispose();
        this.road.curLine.dispose();
        this.destroy(true);
    }

    private speedSound: boolean = false;
    private hit(): void {
        if (this.is2d) return;
        this.ball.updateCollision();
        var obstacels: BaseObstacel[] = this.road.allCollison;
        for (var i: number = 0; i < obstacels.length; i++) {
            var obstacel: any = obstacels[i];
            if (obstacel instanceof BaseObstacel) {
                if (this.ball.intersects(obstacel) && this.bufftime == 0) { //  是否相交
                    this.overgame();
                    this.removeEvent();
                    // Laya.timer.once(1000,this,function(){
                    //   GameCtrl.getInstance().runLogic(CGAMES.END);
                    // });
                    //发送分数
                    wxInterface.I.report(GameModel.isntance.stepcount);
                    RunData.saveWordScore(GameModel.isntance.stepcount);

                    this.road.stopAll(true);
                    // GameCtrl.getInstance().runLogic(CGAMES.STATR);
                    // this.road.transform.translate(new Laya.VeSctor3(0, 0, 2));
                    SoundUtils.instance.playSound(GameSystem.MUSIC_HIT);
                    return;
                }
            } else if (obstacel instanceof ObstacelIcon) {//图标

                if (!this.ball.jump && this.ball.intersects(obstacel) && obstacel.markTag == false) {
                    obstacel.markTag = true;
                    if (obstacel.type == ICON_TYPE.SPEED) {
                        if (!this.speedSound) {
                            this.speedSound = true;
                            // if (typeof wx != "undefined") {
                            //     Laya.Browser.window.wx.vibrateShort(null);
                            // }

                            SoundUtils.instance.playSound(GameSystem.MUSIC_ADDSPEED);
                            Laya.timer.once(30, this, () => {
                                this.speedSound = false;
                            })
                        }
                        obstacel.markTag = true;
                        this.isUp = 0;
                        if (this.addspeed) {
                            this.addspeedTargetTime = getTimer() + this.addspeedtime * 2;
                        }
                        else {
                            this.addspeedTargetTime = getTimer() + this.addspeedtime;
                        }
                    }
                    else if (obstacel.type == ICON_TYPE.BAOXIANG) {
                        SoundUtils.instance.playSound(GameSystem.MUSIC_BAOXIANG);
                        this.baoxiangnum++;
                        obstacel.baoxiangremove();
                    }
                    else if (obstacel.type == ICON_TYPE.JUMP) {
                        this.ball.jump = true;
                        SoundUtils.instance.playSound(GameSystem.MUSIC_JUMP);
                    } else if (obstacel.type == ICON_TYPE.SUBSPEED) {
                        this.addspeedTargetTime = 0;
                    }
                }

            }

        }
    }

}