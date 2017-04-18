//JzTree
"use strict";

    Function.prototype.extend = function extend( jPropList ){
        for(var jMethod in jPropList )
            this.prototype[ jMethod ] = jPropList[ jMethod ];
    };

    Element.prototype.remove = Element.prototype.remove || function(){
        var helemParent = this.parentNode;
        if( !!helemParent ) helemParent.removeChild( this );
    };

    Element.prototype.empty = Element.prototype.empty || function(){
        this.textContent = '';
    };

    if( !Event.prototype.hasOwnProperty('path') ){
        Object.defineProperty( Event.prototype, 'path', {
            get: function() {
                var path = [],
                    helemCurrent = this.target;
                while( helemCurrent.nodeType === 1 ){
                    path.push( helemCurrent );
                    helemCurrent = helemCurrent.parentNode;
                }
                path.push( document, window );
                return path;
            }
        } );
    }


   if( !window.hasOwnProperty('scrollX') ){
        Object.defineProperty( window, 'scrollX', {
            get: function(){
                return window.pageXOffset;
            }
        } );
        Object.defineProperty( window, 'scrollY', {
            get: function(){
                return window.pageYOffset;
            }
        } );
    }

    window.requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function( jCallback ){ setTimeout( jCallback, 1000 / 60 ); };

    window.jz = {
        wCode: {
            evtBind: function( HElem, jMethod, jEvtList ){
                if( jMethod !== 'add' && jMethod !== 'remove' ) return;
                else jMethod = jMethod + 'EventListener';

                for(var jName in jEvtList )
                    HElem[ jMethod ]( jName, jEvtList[ jName ], false );
            },
            evtStopDefault: function( evt ){
                evt.preventDefault();
            },
            evtStopBubble: function( evt ){
                evt.stopPropagation();
            },
        },
        qs: {
            HElem: function( Q ){
                return document.querySelector( Q );
            },
            before: function( HElemPre, HElem ){
                HElemPre.insertAdjacentElement( 'beforebegin', HElem );
            },
            after: function( HElemPre, HElem ){
                HElemPre.insertAdjacentElement( 'afterend', HElem );
            },
            hasClass: function( HElem, jClassName ){
                return HElem.classList.contains( jClassName );
            },
            addClass: function( HElem, jClassName ){
                var jClassNameList = jClassName.split(' ');
                for(var p = 0, jItem; jItem = jClassNameList[ p++ ] ; )
                    HElem.classList.add( jItem );
            },
            removeClass: function( HElem, jClassName ){
                var jClassNameList = jClassName.split(' ');
                for(var p = 0, jItem; jItem = jClassNameList[ p++ ] ; )
                    HElem.classList.remove( jItem );
            },
            css: function( HElem, jStyleList ){
                for(var jName in jStyleList ){
                    HElem.style[ jName ] = jStyleList[ jName ];
                }
            },
            attr: function( HElem, jAttrList ){
                for(var jName in jAttrList ){
                    HElem.setAttribute( jName, jAttrList[ jName ] );
                }
            },
        },
        actFilter: new function jzActFilter(){
            var i = this;

            var ion_funcGroup = {};

            i.set = function( jName ){
                if( !( jName in ion_funcGroup ) )
                    ion_funcGroup[ jName ] = {
                        lockStatus: false,
                        timer: null,
                        ArrFunc: []
                    };

                var jArrFunc = ion_funcGroup[ jName ].ArrFunc;
                for( var p = 1, len = arguments.length ; p < len ; p++ )
                    if( typeof arguments[ p ] === 'function' )
                        jArrFunc.push( arguments[ p ] );
            };

            i.locksmith = function( jName, ChoA ){
                if( !( jName in ion_funcGroup )
                    || typeof ChoA !== "boolean"
                ) return;

                var jFuncGroup = ion_funcGroup[ jName ];
                jFuncGroup.lockStatus = ChoA;
                clearTimeout( jFuncGroup.timer );
            };

            i.clear = function( jName ){
                if( jName in ion_funcGroup ) delete ion_funcGroup[ jName ];
            };

            function ion_actFilter( jName, jTimeMS ){
                if( !( jName in ion_funcGroup )
                    || typeof jTimeMS !== 'number'
                ) return;

                var jArgu = [ this, jName, jTimeMS ];
                jArgu[3] =
                    ( arguments[2] && arguments[2].constructor === Array )? arguments[2] : [];
                jArgu[4] =
                    ( arguments[ ( arguments.length < 4 )? 2 : 3 ] === 'delete' )? true : false;

                ion_evtTimer.apply( null , jArgu );
            };

            i.do = function(){
                ion_actFilter.apply( 'do', arguments );
            };

            i.wait = function(){
                ion_actFilter.apply( 'wait', arguments );
            };

            function ion_ActArrFunc( jArrFunc, jArgu ){
                var p = 0,
                    len = jArrFunc.length;
                for( ; p < len ; p++ )
                    jArrFunc[ p ].apply( null, jArgu );
            }

            function ion_evtTimer( jActType, jName, jTimeMS, jFuncArgu, isDelete ){
                var jFuncGroup = ion_funcGroup[ jName ];

                if( jFuncGroup.lockStatus )
                    clearTimeout( jFuncGroup.timer );
                else if( jActType === 'do' )
                    ion_ActArrFunc( jFuncGroup.ArrFunc, jFuncArgu );

                jFuncGroup.lockStatus = true;
                jFuncGroup.timer = setTimeout( function(){
                    jFuncGroup.lockStatus = false;

                    if( jActType === 'wait' )
                        ion_ActArrFunc( jFuncGroup.ArrFunc, jFuncArgu );

                    if( isDelete )
                        delete ion_funcGroup[ jName ];
                    else
                        ion_funcGroup.timer = null;
                }, jTimeMS );
            }
        },
        prop: {
            //> jDirection: horizontal, vertical
            mouseOverPlacePercent: function( jDirection, evt, HElem ){
                HElem = HElem || evt.currentTarget;

                var jStyle = getComputedStyle( HElem ),
                    jClient = HElem.getBoundingClientRect(),
                    evtPage, HElem_size, HElem_pageOffset;
                switch( jDirection ){
                    case 'horizontal':
                        evtPage = evt.pageX;
                        HElem_size = jStyle.width;
                        HElem_pageOffset = window.scrollX + jClient.left;
                        [ 'borderRightWidth', 'borderLeftWidth', 'paddingRight', 'paddingLeft' ]
                            .map(function( jItem ){
                                HElem_pageOffset -= parseFloat( jStyle[ jItem ] );
                            });
                        break;
                    case 'vertical':
                        evtPage = evt.pageY;
                        HElem_size = jStyle.height;
                        HElem_pageOffset = window.scrollY + jClient.top;
                        [ 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom' ]
                            .map(function( jItem ){
                                HElem_pageOffset -= parseFloat( jStyle[ jItem ] );
                            });
                        break;
                    default: return;
                }
                HElem_size = parseFloat( HElem_size );

                var jPercent = ( evtPage - HElem_pageOffset ) / HElem_size;
                jPercent = parseFloat( jPercent.toFixed(3) );

                if( jDirection === 'vertical' ) jPercent = 1 - jPercent;

                if( jPercent > 1 ){ jPercent = 1; }
                else if( jPercent < 0 ){ jPercent = 0; }

                return jPercent;
            },
        },
    };

     var jDFPQuick = {
            gSign: null,
            src: ( 'https:' == document.location.protocol ? 'https:' : 'http:' ) + '//www.googletagservices.com/tag/js/gpt.js',
            resize: null,
            setResize: function( jResizeList ){
                    var jSelf = this;
                    this.gSign.push(function(){
                            var jGSizeMap = googletag.sizeMapping();
                            for(var p = 0, jItem; jItem = jResizeList[ p++ ] ; )
                                    jGSizeMap = jGSizeMap.addSize( jItem[0], jItem[1] );

                            jSelf.resize = jGSizeMap.build();
                    });
            },
            infrastructure: function(){
                    if( this.gSign ) return;

                    var jScriptList = document.scripts,
                            p = 0, jScript,
                            isNewCreate = true;

                    while( jScript = jScriptList[ p++ ] ){
                            if( jScript.src === this.src ){
                                    isNewCreate = false;
                                    break;
                            }
                    }

                    if( isNewCreate ){
                            this.gSign = [];
                            window.googletag = { cmd: this.gSign };
                            this.createScript();
                    }else{
                            this.gSign = window.googletag.cmd;
                    }
            },
            createScript: function(){
                var HElem_script = document.createElement('script');
                HElem_script.async = true;
                HElem_script.type = 'text/javascript';
                HElem_script.src = this.src;
                document.head.appendChild( HElem_script );
            },
            getNewContent: function( jID, jADSpace, jSizeList ){
                var jSelf = this;

                jSelf.gSign.push(function( isActOpen ){
                    googletag
                        .defineSlot( jADSpace, jSizeList, jID )
                        .defineSizeMapping( jSelf.resize )
                        .setCollapseEmptyDiv( true )
                        .addService( googletag.pubads() );
                    googletag.pubads().enableSingleRequest();

                    // 開始擷取廣告
                    googletag.enableServices();
                });

                var HElem_div = document.createElement('div'),
                    HElem_script = document.createElement('script');
                HElem_script.innerHTML = 'googletag.cmd.push(function(){'
                        + 'googletag.display("' + jID + '");'
                    + '});';
                HElem_div.id = jID;
                HElem_div.appendChild( HElem_script );

                return HElem_div;
            },
            getNewRefreshContent: function( jID, jADSpace, jSizeList ){
                var jSelf = this,
                    jLength = Object.keys( jSelf.waitRequestList ).length;

                var jSlot;
                jSelf.gSign.push(function( isActOpen ){
                    jSlot = googletag
                        .defineSlot( jADSpace, jSizeList, jID )
                        .defineSizeMapping( jSelf.resize )
                        .setCollapseEmptyDiv( true )
                        .addService( googletag.pubads() );

                    googletag.enableServices();
                });

                function jDFPRefresh(){
                    if( jSlot ) googletag.pubads().refresh([ jSlot ]);
                }

                jSelf.waitRequestList[ jLength ] = function(){
                    googletag.display( jID );
                }

                var HElem_div = document.createElement('div'),
                    HElem_script = document.createElement('script');
                HElem_script.innerHTML =
                    'var jSelf = jDFPQuick, jLength = ' + jLength + ';'
                    + 'googletag.cmd.push(function(){'
                        + 'jSelf.waitRequestList[ jLength ]();'
                        + 'delete jSelf.waitRequestList[ jLength ];'
                    + '});';
                HElem_div.id = jID;
                HElem_div.appendChild( HElem_script );

                return {
                    HElemMain: HElem_div,
                    refresh: jDFPRefresh,
                };
            },
            waitRequestList: {},
        };

    jDFPQuick.infrastructure();
    jDFPQuick.setResize([
        [ [ 1024, 0 ], [ 728, 90 ] ],
        [ [ 520, 0 ], [ 320, 100 ] ],
        [ [ 0, 0 ], [] ],
    ]);

    function jFlyMsg_forDanmu( HElemQ, jSetInf ){
        jSetInf = jSetInf || {};

        var i = this;

        i.HElem = $( HElemQ );
        i.HElem.each(function(){
            if( !this.id )
                this.id = 'TxFlyMsg-' + Math.random().toString().substr( 2, 10 );
        });

        var jInf = {};
        for(var jTitle in i.defaultInf )
            jInf[ jTitle ] = ( jTitle in jSetInf )? jSetInf[ jTitle ] : i.defaultInf[ jTitle ];

        i.HElem.danmu( jInf );
    }

    jFlyMsg_forDanmu.extend({
        defaultInf: {
            //CSS 框
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            opacity: '0.8',
            zindex: '100',
            //總時間
            sumTime: 3 * 3600,//無法使用 Infinity
            //是否循環撥放
            danmuLoop: false,
            //(寬+400)*speed/1000（毫秒）
            speed: 10000,
            //上下底字幕持續顯示時間
            topBottomDanmuTime: 5000,
            //文字選擇大小
            fontSizeSmall: 20,
            FontSizeBig: 32,
            //默認顏色
            defaultFontColor: 'yellow',
            //是否（取消）字幕保護（底層位置向上移動 3 個單位）
            SubtitleProtection: false,
            // danmuList: {}, // 不懂
            //未實現 是否位置优化，位置优化是指像AB站那样弹幕主要漂浮于区域上半部分
            positionOptimize: false,
            //畫面上最多彈幕個數 數量過多時以最新留言優先顯示
            maxCountInScreen: 40,
            //每分鐘最多彈幕個數 數量過多時以最新留言優先顯示
            maxCountPerSec: Infinity,//Infinity
        },
        actName: {
            addMsgList: 'addDanmu',// [ { 字幕參數 }, [ { 字幕參數 }, ...] ]
            onlyRunTime: 'danmuStart',//奇異功能： 時間在跑 但字幕停留
            topBottomAdd1: 'danmuStop',//奇異功能： 彈幕清空 但卻縮小上下顯示範圍
            play: 'danmuResume',
            pause: 'danmuPause',
            //調整透明度函數
            setTime: 'setTime',//數值
            setOpacity: 'setOpacity',//數字字串
        },
        getVal: {
            paused: 'paused',
            nowTime: 'nowTime',
        },
        actFlyMsg: function( jActType, jInf ){
            var jDanmuName = this.actName[ jActType ];
            if( !jDanmuName ) return;

            this.HElem.danmu( jDanmuName, jInf );
        },
        getInf: function( jActType ){
            var jDanmuName = this.getVal[ jActType ];
            if( !jDanmuName ) return;

            return this.HElem.data( jDanmuName );
        },
        timeCurrent: function( Num ){
            if( typeof Num === 'number' ) this.HElem.danmu( 'setTime', Num * 10 );
            return this.HElem.data('nowTime') / 10;
        },
        getMsg: function( jInf ){
            var Ans = {
                    text: jInf.text,
                    position: jInf.position || '0',// 0~2
                    size: jInf.size || '0',// 0~1
                    color: jInf.color || 'white',
                    time: jInf.time * 10 || this.getInf('nowTime') + 1,
                };

            if( jInf.isnew ) Ans.isnew = '';

            return Ans;
        },
        clearMsgList: function( jInf ){
            return this.HElem.data( 'danmuList', {} );
        },
    });

