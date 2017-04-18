"use strict";

void function(){
    //裝置訊息
    void function(){
        window.bcvPly_userAgent = naviVerify( navigator.userAgent );

        var Arr = [],
            jBodyClass = document.body.classList;
        if( bcvPly_userAgent.device === 'iPhone' ) Arr.push('esDevice_iPhone');
        Arr.push( bcvPly_userAgent.isMobile ? 'esMobile' : 'esPC' );
        jBodyClass.add.apply( jBodyClass, Arr );
    }();


//>> 關鍵零組件 -----

    if( bcvPly_userAgent.isMobile ) onMultiMouse();

    var ion_focus = null,
        ion_clickList = {
            system: []
        };
    document.addEventListener( 'click', function( evt ){
        var jIndex, jItem, p;
        for( jIndex in ion_clickList ){
            jItem = ion_clickList[ jIndex ];

            p = 0;
            while( jItem[ p ] ) jItem[ p++ ]( evt );
        }
    }, true );

    var ion_objList = [];
    ion_clickList.system.push(function( evt ){
        ion_focus = null;
        for(var p = 0, HElem_bubble; HElem_bubble = evt.path[ p++ ] ; ){
            if( HElem_bubble === document.body ) break;
            else if( !HElem_bubble.classList.contains('video-js') ) continue;

            for(var q = 0, i; i = ion_objList[ q ] ; q++){
                if( i.HElem !== HElem_bubble ) continue;
                ion_focus = i;
                break;
            }
            break;
        }
    })
    jz.wCode.evtBind( document, 'add', {
        keydown: function( evt ){
            if( ion_focus ){
                ion_focus.keyboardShortcut( evt );
                evt.preventDefault();
            }
        },
    } );

    // DFP 標記 //DFP 唯一值 無法製作多撥放器的阻礙
    // var jDFPOnly;
    // if( !bcvPly_userAgent.isMobile ){
        // jDFPOnly = jDFPQuick.getNewRefreshContent(
        //         'dfp-banner-' + Math.random().toString().substr( 2, 10 ),
        //         '/123939770/Vidol_web_All_01', []
        //     );
        // // window.dfp = jDFPOnly.refresh;
    // }

    var ion_initPly_HElemWrap = document.querySelector('#LxBcvPly_wrap');
    ion_initPly_HElemWrap.remove();

    var ion_initPly_inf;
    window.bcvPlyInitInf = function( jInf ){
        ion_initPly_inf = jInf;
        delete window.bcvPlyInitInf;
    };

/* var jVideo = bcvPlyInit( 'SETPly', {
            account: '4338955585001',
            videoID: '',
            player: 'VJxyQW4m0e',
            embed: 'default',
        } );
-*/
    window.bcvPlyInit = function( jID, jBcvInfList, isOnlyShell ){
        var i = this;
        ion_objList.push( i );

        i.v = videojs( jID );

        i.rebuild = function( isSetVideo, FuncReady ){
            var HElemPrev = i.HElem,
                jMediainfo = i.v.mediainfo,
                jVideoID;

            if( jMediainfo && jMediainfo.id ) jVideoID = jMediainfo.id;
            else isSetVideo = false;

            i.v = bc( ion_createVideo( jID, jBcvInfList ) );

            jz.qs.after( HElemPrev, i.v.el_ );
            HElemPrev.remove();

            i.v.ready(function(){
                i.HElem = i.v.el_;
                i.closeList = ion_clickList[ jID ] = [];
                ion_build( i );
                if( isSetVideo ) i.setVideo( jVideoID );
                if( FuncReady ) FuncReady();
            });
        };

        i.v.ready(function(){
            i.HElem = i.v.el_;
            // 若使用 IE 在撥放影片時撥放器會被換成 Flash
            // i.video = i.HElem.querySelector('.vjs-tech');
            i.tagVideo = i.HElem.querySelector('video');
            i.closeList = ion_clickList[ jID ] = [];
            ion_build( i );
            if( jBcvInfList.videoID ) i.setVideo( jBcvInfList.videoID );
        });
    };

    function ion_createVideo( jID, jBcvInfList ){
        var HElem = document.createElement('video');
        HElem.id = jID;

        jz.qs.attr( HElem, {
            'class': 'video-js LxBcvPly',
            'data-account': jBcvInfList.account || '',
            'data-video-id': '',
            'data-player': jBcvInfList.player || 'default',
            'data-embed': jBcvInfList.embed || 'default',
        } );

        return HElem;
    }

    function ion_build( i ){
        ion_ply_arrangement( i );
        // 替代品
        i.video = i.elemList.video;
        ion_ply_player( i );
        if( bcvPly_userAgent.isMobile ) ion_ply_forMobile( i );
        else ion_ply_forPC( i );
        ion_ply_lock( i );
        ion_ply_followPly( i );

        if( typeof i.onrebuild === 'function' ) i.onrebuild();
    }



//>> 零件組 -----

    function ion_ply_arrangement( i ){
        var HElem_Wrap = ion_initPly_HElemWrap.cloneNode( true ),
            HElem_tileOverlay = HElem_Wrap.querySelector('.TxTileOverlay'),
            HElem_floatBlock = HElem_Wrap.querySelector('.TxBillboard'),
            HElem_timeLine = HElem_Wrap.querySelector('.TxPlyerTimeLine'),
            HElem_touchCtrl = HElem_Wrap.querySelector('.TxTouchCtrl'),
            HElem_barCtrl = HElem_Wrap.querySelector('.TxBarCtrl'),
            HElem_topBar = HElem_Wrap.querySelector('.TxTopBar'),
            HElem_ctrlToolBar = HElem_Wrap.querySelector('.TxCtrlToolBar'),
            HElemPoint = i.v.controlBar.el_;

        i.elemList = {
            el: HElem_Wrap,
            video: HElem_Wrap.querySelector('.TxVideoSubstitute'),
            custPly: {
                el: HElem_Wrap.querySelector('.TxCustPly'),
            },
            refPoint: {
                error: i.HElem.querySelector('.vjs-error-display'),
            },
            tileOverlay: {
                el: HElem_tileOverlay,
                watching: HElem_tileOverlay.querySelector('.TxTileOverlay_watching'),
                watching_live: HElem_tileOverlay.querySelector('.TxTileOverlay_watching_live'),
                watching_num: HElem_tileOverlay.querySelector('.TxTileOverlay_watching_num'),
                brightnessForTouch: HElem_tileOverlay.querySelector('.TxTileOverlay_brightnessForTouch'),
            },
            flyMsg: {
                el: HElem_tileOverlay.querySelector('.TxTileOverlay_flyMsg'),
                show: HElem_tileOverlay.querySelector('.TxTileOverlay_flyMsg_show'),
            },
            background: {
                el: HElem_tileOverlay.querySelector('.TxTileOverlay_background'),
                top: HElem_tileOverlay.querySelector('.TxTileOverlay_background_top'),
                bottom: HElem_tileOverlay.querySelector('.TxTileOverlay_background_bottom'),
            },
            floatBlock: {
                el: HElem_floatBlock,
            },
            timeLine: {
                el: HElem_timeLine,
                playPoint: HElem_timeLine.querySelector('.TxPlyerTimeLine_play > b'),
                part: HElem_timeLine.querySelector('.TxPlyerTimeLine_part'),
            },
            topBar: {
                el: HElem_topBar,
                titleBox: HElem_topBar.querySelector('.TxTopBar_title'),
                title: HElem_topBar.querySelector('.TxTopBar_title > span'),
                otherBtnList: HElem_topBar.querySelector('.TxTopBar_otherBtnList'),
                tool: HElem_topBar.querySelector('.TxIcon_tool'),
                episode: HElem_topBar.querySelector('.TxIcon_episode'),
            },
            ctrlToolBar: {
                el: HElem_ctrlToolBar,
                flyMsg: HElem_ctrlToolBar.querySelector('.TxIcon_flyMsg'),
                caption: HElem_ctrlToolBar.querySelector('.TxIcon_caption'),
                collect: HElem_ctrlToolBar.querySelector('.TxIcon_collect'),
                share: HElem_ctrlToolBar.querySelector('.TxIcon_share'),
            },
            block: {
                floatBlock: HElem_Wrap.querySelector('.TxFloatBlock'),
                forceBlock: HElem_Wrap.querySelector('.TxForceBlock'),
                error: HElem_Wrap.querySelector('.TxForceBlock_error'),
                error_title: HElem_Wrap.querySelector('.TxForceBlock_error_title'),
                error_close: HElem_Wrap.querySelector('.TxForceBlock_error_close'),
                error_content: HElem_Wrap.querySelector('.TxForceBlock_error_content'),
                warn: HElem_Wrap.querySelector('.TxForceBlock_warn'),
                warn_title: HElem_Wrap.querySelector('.TxForceBlock_warn_title'),
                warn_content: HElem_Wrap.querySelector('.TxForceBlock_warn_content'),
                showInf: HElem_Wrap.querySelector('.TxForceBlock_showInf'),
                showInf_title: HElem_Wrap.querySelector('.TxForceBlock_showInf_title'),
                showInf_close: HElem_Wrap.querySelector('.TxForceBlock_showInf_close'),
                showInf_content: HElem_Wrap.querySelector('.TxForceBlock_showInf_content'),
                interact: HElem_Wrap.querySelector('.TxForceBlock_interact'),
            },
            inform: {
                share: HElem_Wrap.querySelector('.TxInform_share'),
                episode: HElem_Wrap.querySelector('.TxInform_episode'),
                unLogin: HElem_Wrap.querySelector('.TxInform_unLogin'),
                emailUnValidate: HElem_Wrap.querySelector('.TxInform_emailUnValidate'),
                catchPlayRight: HElem_Wrap.querySelector('.TxInform_catchPlayRight'),
                unBuyValidate: HElem_Wrap.querySelector('.TxInform_unBuyValidate'),
                recommendUseApp: HElem_Wrap.querySelector('.TxInform_recommendUseApp'),
            },
        };

        if( bcvPly_userAgent.isMobile ){
            i.elemList.touch = {
                el: HElem_touchCtrl,
                left: HElem_touchCtrl.querySelector('.TxTouchCtrl_left'),
                center: HElem_touchCtrl.querySelector('.TxTouchCtrl_center'),
                play: HElem_touchCtrl.querySelector('.TxIcon_play'),
                adjustVolume: HElem_touchCtrl.querySelector('.TxTouchCtrl_center_adjust'),
                adjustVolumeR: HElem_touchCtrl.querySelector('.TxTouchCtrl_center_adjustR'),
                right: HElem_touchCtrl.querySelector('.TxTouchCtrl_right'),
                infoState: HElem_touchCtrl.querySelector('.TxTouchCtrl_infoState'),
                live: HElem_touchCtrl.querySelector('.TxIcon_live'),
                cyclicView: HElem_touchCtrl.querySelector('.TxIcon_cyclicView'),
                topToolBar: HElem_touchCtrl.querySelector('.TxTouchCtrl_topToolBar'),
                episode: HElem_touchCtrl.querySelector('.TxIcon_episode'),
                toolBar: HElem_touchCtrl.querySelector('.TxTouchCtrl_toolBar'),
                flyMsg: HElem_touchCtrl.querySelector('.TxIcon_flyMsg'),
                caption: HElem_touchCtrl.querySelector('.TxIcon_caption'),
                collect: HElem_touchCtrl.querySelector('.TxIcon_collect'),
                full: HElem_touchCtrl.querySelector('.TxIcon_full'),
                timeLine: HElem_touchCtrl.querySelector('.TxTouchCtrl_timeLine'),
            };
        }else{
            i.elemList.dfpBanner = {
                el: HElem_floatBlock.querySelector('.TxBillboard_dfpBanner'),
                content: HElem_floatBlock.querySelector('.TxBillboard_dfpBanner_content'),
                defaultAD: HElem_floatBlock.querySelector('.TxBillboard_dfpBanner_default'),
                close: HElem_floatBlock.querySelector('.TxBillboard_dfpBanner_close'),
            };
            i.elemList.bar = {
                el: HElem_barCtrl,
                play: HElem_barCtrl.querySelector('.TxIcon_play'),
                time: HElem_barCtrl.querySelector('.TxBarCtrl_time'),
                timeCurrent: HElem_barCtrl.querySelector('.TxBarCtrl_time_current'),
                timeDuration: HElem_barCtrl.querySelector('.TxBarCtrl_time_duration'),
                live: HElem_barCtrl.querySelector('.TxIcon_live'),
                cyclicView: HElem_barCtrl.querySelector('.TxIcon_cyclicView'),
                voice: HElem_barCtrl.querySelector('.TxIcon_voice'),
                voiceR: HElem_barCtrl.querySelector('.TxIcon_voice > .TxBarCtrl_voiceR'),
                voiceBar: HElem_barCtrl.querySelector('.TxBarCtrl_voice_drawBar'),
                voiceBarStick: HElem_barCtrl.querySelector('.TxBarCtrl_voice_drawBar div'),
                voiceBarShow: HElem_barCtrl.querySelector('.TxBarCtrl_voice_drawBar b'),
                flyMsg: HElem_barCtrl.querySelector('.TxIcon_flyMsg'),
                caption: HElem_barCtrl.querySelector('.TxIcon_caption'),
                collect: HElem_barCtrl.querySelector('.TxIcon_collect'),
                full: HElem_barCtrl.querySelector('.TxIcon_full'),
            };
        }
        i.v.bigPlayButton.el_.remove();

        jz.qs.before( HElemPoint, i.elemList.video );
        jz.qs.before( HElemPoint, i.elemList.custPly.el );
        jz.qs.before( HElemPoint, i.elemList.tileOverlay.el );
        jz.qs.before( HElemPoint, i.elemList.floatBlock.el );
        jz.qs.before( HElemPoint, i.elemList.timeLine.el );
        if( bcvPly_userAgent.isMobile ) jz.qs.before( HElemPoint, i.elemList.touch.el );
        else jz.qs.before( HElemPoint, i.elemList.bar.el );
        jz.qs.before( HElemPoint, i.elemList.ctrlToolBar.el );
        jz.qs.before( HElemPoint, i.elemList.topBar.el );

        HElemPoint.remove();
    }

    function ion_ply_player( i ){
        i.state = {
            ready: false,
            isCyclicView: false,
            ctrlForceList: {
                ctrlForceSwitch: null,
                i_setblock: null,
                publicSwitch: null,
                i_touchAdjustTimeTradition: null,
                pause: true,
            },
            timeLineCtrlForceList: {
                i_central_toolBarSwitch: null,
                pause: null,
            },
            getSwitch: function( jListName ){
                var jStateNow = null,
                    jList = this[ jListName ];
                for(var jName in jList ){
                    var jVal = jList[ jName ];
                    if( jVal !== null ){
                        jStateNow = jVal;
                        break;
                    }
                }
                return jStateNow;
            },
            cueTrackList: null,
            //換片
            mediaInfoPileAttic: 0,
        };

        //框框函數
        i.blockInfList = {
            floatblockInf: null,
            forceBlockInf: null,
            forceBlockList: [ /* [ jActFuncName, jInf ][, ...] */ ],
        };

        i.addClass('esNoVideoReady');

        i.on({
            loadstart: function(){
                var jCheckToken = ++i.state.mediaInfoPileAttic;

                i.setVideoReadyState( false );

                i.onCanPlayFunc( jCheckToken, function(){
                    i.setVideoReadyState( true );

                    if( i.reload ) i.reload();
                } );
            },
        });

        i.central_ctrlSwitch( false );
        i.central_ctrlSwitch( true );

        //中控時間計時 ID
        i._hide_centralCtrlSwitchID = [ null ];

        //時間軸
        i.timeLineCtrl = new createPlyerTimeLine({
            HElemMain: i.elemList.timeLine.el,
            play: function( ChoA ){ i.play( ChoA ); },
            isPaused: function(){ return i.v.paused(); },
            setCurrentPlayShow: function( jInf ){
                if( i.state.getSwitch('timeLineCtrlForceList') === false ){
                    switch( jInf.state ){
                        case 'start':
                            jInf.HElem_floatShow.style.display = 'none';
                            break;
                        case 'end':
                            jInf.HElem_floatShow.style.display = null;
                            break;
                    }
                }else{
                    switch( jInf.type ){
                        case 'hover':
                            i.setCorrectFloatShowPlace( jInf );
                            break;
                        case 'drag':
                            i.setCorrectFloatShowPlace( jInf );
                            i.setCurrentPlayShow( jInf );
                            break;
                        case 'operate':
                            i.setCorrectFloatShowPlace( jInf );
                            i.setCurrentPlayShow( jInf );
                            break;
                        case 'timeUpdate':
                            i.setCurrentPlayShow( jInf );
                            break;
                    }
                    if( jInf.type !== 'operate' ){
                        switch( jInf.state ){
                            case 'start':
                                i.state.ctrlForceList.publicSwitch = true;
                                jInf.HElemMain.style.height
                                    = i.elemList.timeLine.playPoint.style.width
                                    = i.elemList.timeLine.playPoint.style.height
                                    = '0.6em';
                                break;
                            case 'move':
                                break;
                            case 'end':
                                i.state.ctrlForceList.publicSwitch = null;
                                jInf.HElemMain.style.height
                                    = i.elemList.timeLine.playPoint.style.width
                                    = i.elemList.timeLine.playPoint.style.height
                                    = null;
                                i.actFilter( 'centralCtrlSwitch', function(){
                                    i.central_ctrlSwitch( false );
                                }, 3000 );
                                break;
                        }
                    }
                }
            },
            vodBuffer: function(){ return i.v.bufferedPercent(); },
            vodDuration: function(){ return i.v.duration(); },
            vodCurrent: function( NumTime ){ return i.timeCurrent( NumTime ); },
            liveDuration: function( jTypeName ){
                var Ans,
                    jLiveTime = i.v.seekable();
                switch( jTypeName ){
                    case 'start': Ans = jLiveTime.start(0); break;
                    case 'end': Ans = jLiveTime.end(0); break;
                    default: Ans = jLiveTime.end(0) - jLiveTime.start(0);
                }
                return Ans;
            },
            liveCurrent: function( NumTime ){ return i.timeCurrent( NumTime ); },
            isVideoReady: false,
            isLive: true,
            isLivePlayback: true,
            isCumulativeBuffer: false,
            lazyPlayTime: 100,
        });

        // i.elemList.topBar.tool.onclick = function(){
        //     i.central_toolBarSwitch();
        // };
        // i.closeList.push(function( evt ){
            // for(var p = 0, HElem; HElem = evt.path[ p++ ] ; ){
            //     switch( HElem ){
            //         case i.elemList.topBar.tool: return;
            //         case i.elemList.ctrlToolBar.el: return;
            //     }
            // }

            // i.central_toolBarSwitch( false );
        // });

        i.elemList.block.error_close.onclick
            = i.elemList.block.showInf.onclick
            = i.elemList.block.showInf_close.onclick
            = function( evt ){
                i.prevSetblock();
                evt.stopPropagation();
            };

        i.on({
            play: function(){
                // i.state.ctrlForceList.pause = null;
            },
            pause: function(){
                // i.state.ctrlForceList.pause = true;
                // i.central_ctrlSwitch( true );
            },
            timeupdate: function(){
                if( !i.state.ready
                    || i.v.paused() // timeupdate 事件的錯誤
                ) return;

                i.timeLineCtrl.timeChange();
            },
            progress: function(){
                if( !i.state.ready ) return;
                i.timeLineCtrl.streamBufferChange();
            },
            durationchange: function(){
                var isLive = i.isLive(),
                    jDuration = i.v.duration();
                if( !isLive ) i.elemList.bar.timeDuration.innerHTML = i.timeLineCtrl.getTimeString( jDuration ).join(':');
            },
            error: function( evt ){
                var errBcv = i.v.error(),
                    errCode = 'errCode_' + errBcv.code.toString();

                i.error( errCode );
            },
        });
    }

    function ion_ply_forPC( i ){
        // DFP 標記
        // i.elemList.dfpBanner.content.appendChild( jDFPOnly.HElemMain );

        jz.wCode.evtBind( i.HElem, 'add', {
            mousemove: function(){
                i.central_ctrlSwitch( true );

                i.actFilter( 'centralCtrlSwitch', function(){
                    i.central_ctrlSwitch( false );
                }, 3000 );
            },
        } );
        jz.wCode.evtBind( i.video, 'add', {
            click: function(){
                i.play();
            },
        } );


        i.elemList.bar.play.onclick = function(){
            if( i.play() ) jz.qs.addClass( this, 'esPause' );
            else jz.qs.removeClass( this, 'esPause' );
        };

        //音量
        i.elemList.bar.voice.onclick = function(){
            i.adjustVoice( i.v.muted() );
        };
        var jVoiceBarEvtList = {
                mousemove: function( evt ){
                    i.adjustVoiceBar( evt );
                },
                mouseup: function( evt ){
                    jz.wCode.evtBind( document, 'remove', jVoiceBarEvtList );
                    i.state.ctrlForceList.publicSwitch = null;
                    // i.elemList.bar.voiceBar.style.width = null;
                    i.adjustVoiceBar( evt );
                    i.actFilter( 'centralCtrlSwitch', function(){
                        i.central_ctrlSwitch( false );
                    }, 3000 );
                },
            };
        i.elemList.bar.voiceBar.addEventListener( 'mousedown', function( evt ){
            i.state.ctrlForceList.publicSwitch = true;
            // i.elemList.bar.voiceBar.style.width = '3.2em';
            i.adjustVoiceBar( evt );
            jz.wCode.evtBind( document, 'add', jVoiceBarEvtList );
        }, false );

        i.elemList.bar.live.onclick = function(){
            i.setLiveUpdate();
        };

        i.elemList.bar.full.onclick = function(){
            i.fullScreen();
        };

        [   i.elemList.bar.voice,
            i.elemList.bar.live,
            i.elemList.bar.cyclicView,
            i.elemList.bar.full,
            i.elemList.topBar.episode,
            i.elemList.bar.flyMsg,
            i.elemList.bar.caption,
            i.elemList.bar.collect,
        ].map(function( jItem ){
            if( bcvPly_userAgent.isMobile ) return;
            jz.wCode.evtBind( jItem, 'add', {
                mouseenter: function(){
                    i.floatblock({
                        css: {
                            height: '24px',
                            // padding: '6px 10px', // 縮放時會有破版問題 所以將此項變成彈性空間
                            display: 'inline-block',
                            background: 'rgba(51, 51, 51, 0.8)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            lineHeight: '24px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                        },
                        contentText: jItem.dataset.title,
                        setFunc: function(){
                            var jClient_main = i.HElem.getBoundingClientRect(),
                                jClient_item = jItem.getBoundingClientRect(),
                                objStyle_self = getComputedStyle( this ),
                                jOffsetX = jClient_item.left - jClient_main.left + jClient_item.width / 2,
                                jOffsetY = jClient_item.top - jClient_main.top,
                                jTitle = jItem.dataset.title,
                                jMatch_title = jTitle.match(/[\w\d\s]/g),
                                jLen_halfwidth = jMatch_title ? jMatch_title.length : 0,
                                jLen_fullwidth = jTitle.length - jLen_halfwidth,
                                jwidth_self = ( this.offsetWidth || ( jLen_halfwidth * 0.5 + jLen_fullwidth ) * 12 ) + 20;

                            jOffsetX = ( jOffsetX + jwidth_self / 2 > jClient_main.width )?
                                jClient_main.width - jwidth_self : jOffsetX - jwidth_self / 2;
                            jOffsetY -= this.offsetHeight + 15;

                            this.classList.add('esShowCtrlName');
                            jz.qs.css( this, {
                                width: jwidth_self + 'px',
                                top: jOffsetY + 'px',
                                left: jOffsetX + 'px',
                            } );
                        },
                        removeFunc: function(){
                            this.classList.remove('esShowCtrlName');
                            jz.qs.css( this, {
                                width: null,
                                top: null,
                                left: null,
                            } );
                        },
                    });
                },
                mouseleave: function(){
                    i.floatblock();
                },
            } );
        });

        // DFP 標記
        // i.elemList.dfpBanner.close.onclick = function(){
            // i.elemList.dfpBanner.el.style.display = null;
            // jz.qs.removeClass( i.elemList.dfpBanner.el, 'esCanClose' );
        // };

        i.on({
            play: function(){
                jz.qs.addClass( i.elemList.bar.play, 'esPause' );
            },
            pause: function(){
                jz.qs.removeClass( i.elemList.bar.play, 'esPause' );
            },
        });
    }

    function ion_ply_forMobile( i ){
        /* //保留 因為製作邏輯不通
            function ion_closeTouchBlock(){
                i.actFilter( 'centralCtrlSwitch', function(){
                    i.central_ctrlSwitch( false );
                }, 6000 );
            }
        */

        jz.wCode.evtBind( i.HElem, 'add', {
            click: function(){
                if( !i.hasClass('esBarCtrlTurnOn') ) i.central_ctrlSwitch( true );
                else i.central_ctrlSwitch( false );
            },
        } );


        jz.wCode.evtBind( i.elemList.touch.play, 'add', {
            click: jz.wCode.evtStopBubble,
            multimouse: function( evt ){
                evt.stopPropagation();
                if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;

                if( i.play() ) jz.qs.addClass( this, 'esPause' );
                else jz.qs.removeClass( this, 'esPause' );
            },
        } );

        jz.wCode.evtBind( i.elemList.touch.live, 'add', {
            click: jz.wCode.evtStopBubble,
            multimouse: function( evt ){
                evt.stopPropagation();
                if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;

                i.setLiveUpdate();
            },
        } );

        jz.wCode.evtBind( i.elemList.touch.full, 'add', {
            click: jz.wCode.evtStopBubble,
            multimouse: function( evt ){
                evt.stopPropagation();
                if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;

                i.fullScreen();
            },
        } );



        var ion_touchAdjust_strDirection,
            ion_touchAdjust_isActing,
            ion_touchAdjust_preTime,
            ion_touchAdjust_prePlace;
        jz.wCode.evtBind( i.elemList.touch.el, 'add', {
            multimouse: function( evt ){
                if( evt.detail.useType !== 'touch' ) return;

                var strDirection;
                if( ion_touchAdjust_isActing && evt.detail.state === 'end' ){
                    ion_touchAdjust_isActing = false;
                }else if( ion_touchAdjust_isActing ){
                }else if( evt.detail.state === 'start' ){
                    ion_touchAdjust_preTime = +new Date();
                    ion_touchAdjust_prePlace = { x: evt.pageX, y: evt.pageY };
                    return;
                }else if( ion_touchAdjust_preTime && evt.detail.state === 'end' ){
                    ion_touchAdjust_preTime
                        ion_touchAdjust_prePlace
                        = null;
                    return;
                }else if( +new Date() - ion_touchAdjust_preTime < 300 ) return;
                else{
                    var numHorizontalRange = Math.abs( evt.pageX - ion_touchAdjust_prePlace.x ),
                        numVerticalRange = Math.abs( evt.pageY - ion_touchAdjust_prePlace.y );
                    if( numHorizontalRange > numVerticalRange ) ion_touchAdjust_strDirection = 'H';
                    else ion_touchAdjust_strDirection = 'V';

                    ion_touchAdjust_isActing = true;
                    ion_touchAdjust_preTime
                        ion_touchAdjust_prePlace
                        = null;
                }

                var isFind = false;
                for(var p = 0, HElem; HElem = evt.path[ p++ ] ; ){
                    if( ion_touchAdjust_strDirection === 'H' ){
                        i.touchAdjustTime( evt );
                        isFind = true;
                    }else if( ion_touchAdjust_strDirection === 'V' ){
                        switch( HElem ){
                            case i.elemList.touch.left:
                                i.touchAdjustVolume( 'L', evt );
                                break;
                            case i.elemList.touch.right:
                                i.touchAdjustVolume( 'R', evt );
                                break;
                        }
                    }
                    if( isFind ) break;
                }
            },
        } );
        jz.wCode.evtBind( i.elemList.touch.left, 'add', {
            multimouse: jz.wCode.evtStopDefault,
        } );
        jz.wCode.evtBind( i.elemList.touch.right, 'add', {
            multimouse: jz.wCode.evtStopDefault,
        } );

        jz.wCode.evtBind( i.elemList.touch.timeLine, 'add', {
            multimouse: function( evt ){
                if( evt.detail.useType !== 'touch' ) return;
                i.touchAdjustTimeTradition( evt );
                evt.stopPropagation();
            },
        } );


        i.on({
            play: function(){
                jz.qs.addClass( i.elemList.touch.play, 'esPause' );
            },
            pause: function(){
                jz.qs.removeClass( i.elemList.touch.play, 'esPause' );
            },
        });
    }

    function ion_ply_lock( i ){
    }

    function ion_ply_followPly( i ){
    }

    bcvPlyInit.extend({
        //添加事件
        ready: function( Func ){
            var i = this;
            i.v.ready(function(){ Func.call( i ); });
        },
        on: function( jEventList ){
            ion_bindEvt( this, 'on', jEventList );
        },
        off: function( jEventList ){
            ion_bindEvt( this, 'off', jEventList );
        },
        one: function( jEventList ){
            ion_bindEvt( this, 'one', jEventList );
        },
        onCanPlay: function( jCheckToken, jCallback_ready, jCallback_receive ){
            var i = this;
            i.v.one( 'loadstart', function(){
                i.onCanPlayFunc( jCheckToken, jCallback_ready, jCallback_receive );
            } );
        },
        onCanPlayFunc: function( jCheckToken, jCallback_ready, jCallback_receive ){
            var i = this,
                isOneTimes = 0;

            if( typeof jCallback_receive === 'function' ) jCallback_receive();

            // 行動裝置須按撥放後才會得到完整可撥放的狀態
            // 此問題由 itemID itemType 得到解決
            function jActCheck(){
                if( isOneTimes ) return;
                else if( jCheckToken !== i.state.mediaInfoPileAttic ) isOneTimes = 1;
                else if( i.isLive() !== i.isLiveInfo() ) return;
                else if( typeof jCallback_ready === 'function' ){
                    isOneTimes = 1;
                    jCallback_ready();
                }
            }

            i.v.on( 'durationchange', function jTem(){
                jActCheck();
                if( isOneTimes ) i.v.off( 'durationchange', jTem );
            } );
            i.v.one( 'play', function(){
                if( isOneTimes ) return;
                jActCheck();
            } );
        },
        onActOne: function( Func ){
            var jCount = 1;
            this.one({
                loadstart: function(){
                    if( jCount-- > 0 ) Func();
                },
                loadedmetadata: function(){
                    if( jCount-- > 0 ) Func();
                },
                loadeddata: function(){
                    if( jCount-- > 0 ) Func();
                },
                durationchange: function(){
                    if( jCount-- > 0 ) Func();
                },
            });
        },
        //功能性函數
        hasClass: function( jClassName ){
            return this.HElem.classList.contains( jClassName );
        },
        addClass: function(){
            var jMain = this.HElem.classList;
            jMain.add.apply( jMain, arguments );
        },
        removeClass: function(){
            var jMain = this.HElem.classList;
            jMain.remove.apply( jMain, arguments );
        },
        animFPS: function( jIDIndex, FuncA ){
            jIDIndex = this[ '_hide_' + jIDIndex + 'ID' ];
            var jID = jIDIndex[0];
            if( jID ) cancelAnimationFrame( jID );

            if( typeof FuncA === 'function' )
                jIDIndex[0] = requestAnimationFrame(function(){
                    jIDIndex[0] = null;
                    FuncA();
                });
            else
                jIDIndex[0] = null;
        },
        actFilter: function( jIDIndex, FuncA, jTimeMS ){
            jIDIndex = this[ '_hide_' + jIDIndex + 'ID' ];
            var jID = jIDIndex[0];
            if( jID ) clearTimeout( jID );

            jIDIndex[0] = setTimeout( function(){
                jIDIndex[0] = null;
                FuncA();
            }, jTimeMS );
        },
        //恢復初始狀態
        recover: function(){
            var i = this;

            i.state.ctrlForceList = {
                ctrlForceSwitch: null,
                i_setblock: null,
                publicSwitch: null,
                i_touchAdjustTimeTradition: null,
                pause: null,
            };
            i.state.timeLineCtrlForceList = {
                i_central_toolBarSwitch: null,
                pause: null,
            };

            var HElem_play;
            if( bcvPly_userAgent.isMobile ){
                HElem_play = i.elemList.touch.play;
            }else{
                HElem_play = i.elemList.bar.play;
            }
            if( i.v.paused() ) jz.qs.removeClass( HElem_play, 'esPause' );
            else jz.qs.addClass( HElem_play, 'esPause' );

            i.actFilter( 'centralCtrlSwitch', function(){
                i.central_ctrlSwitch( false );
            }, 3000 );

            i.blockInfList = {
                floatblockInf: null,
                forceBlockInf: null,
                forceBlockList: [],
            };

            i.prevSetblock();

            if( typeof i.onrecover === 'function' ) i.onrecover.call( i );
        },
        //狀態
        setVideoReadyState: function( ChoA ){
            var i = this;
            if( ChoA ){
                i.removeClass('esNoVideoReady');
            }else{
                i.addClass('esNoVideoReady');
            }
            this.state.ready = ChoA;
            this.timeLineCtrl.setIsVideoReady( ChoA );
        },
        //控制器開關
        ctrlSwitch: function( ChoA, jChoosePlace ){
            var i = this,
                jClassList = '',
                jClassList_top = 'esBGTopTurnOn esTopBarTurnOn',
                jClassList_bottom = 'esBGBottomTurnOn esBarCtrlTurnOn';
            switch( jChoosePlace ){
                case 'top': jClassList = jClassList_top; break;
                case 'bottom': jClassList = jClassList_bottom; break;
                default: jClassList = jClassList_top + ' ' + jClassList_bottom;
            }

            if( ChoA ) jz.qs.addClass( i.HElem, jClassList );
            else jz.qs.removeClass( i.HElem, jClassList );
        },
        //中控
        central_changeDevice: function(){
            var HElemBody = document.body,
                ChoA = jz.qs.hasClass( HElemBody, 'esMobile' );

            if( ChoA ){
                jz.qs.removeClass( HElemBody, 'esMobile' );
                jz.qs.addClass( HElemBody, 'esPC' );
            }else{
                jz.qs.removeClass( HElemBody, 'esPC' );
                jz.qs.addClass( HElemBody, 'esMobile' );
            }
        },
        //>> 撥放器開關
        // central_bcvCtrlSwitch: function( ChoA ){
             // var i = this;
             // function jSwitch( jClose, jOpen ){
             //     i.addClass( 'vjs-user-' + jOpen );
             //     i.removeClass( 'vjs-user-' + jClose );
             // }
             // ChoA = ( typeof ChoA === 'boolean' )? ChoA : i.hasClass('vjs-user-active');
             // if( ChoA ) jSwitch( 'active', 'inactive' );
             // else jSwitch( 'inactive', 'active' );
        // },
        central_ctrlSwitch: function( ChoA ){
            var i = this,
                isCtrlForceSwitch = i.state.getSwitch('ctrlForceList');
            ChoA = ( typeof isCtrlForceSwitch === 'boolean' )? isCtrlForceSwitch
                    : ( typeof ChoA === 'boolean' )? ChoA : !i.hasClass('esBarCtrlTurnOn');

            var isTopBarShow = i.v.isFullscreen() || bcvPly_userAgent.isMobile;
            if( ChoA === false || isTopBarShow ) i.ctrlSwitch( ChoA );
            else i.ctrlSwitch( ChoA, 'bottom' );
        },
        //>> 強制開關
        central_ctrlForceSwitch: function( ChoA ){
            var i = this;
            i.state.ctrlForceList.ctrlForceSwitch = ChoA;
            if( typeof ChoA === 'boolean' ) i.central_ctrlSwitch( ChoA );
        },
        central_toolBarSwitch: function( ChoA ){
            var i = this,
                HElem = i.elemList.topBar.el;

            ChoA = ( typeof ChoA === 'boolean' )? ChoA : !jz.qs.hasClass( HElem, 'csDisplayBlock' );

            if( ChoA ){
                i.state.ctrlForceList.publicSwitch = true;
                jz.qs.addClass( HElem, 'csDisplayBlock' );
                i.state.timeLineCtrlForceList.i_central_toolBarSwitch = false;
            }else{
                jz.qs.removeClass( HElem, 'csDisplayBlock' );
                i.state.timeLineCtrlForceList.i_central_toolBarSwitch = null;
                i.state.ctrlForceList.publicSwitch = null;
            }
        },
        // DFP 標記
        // central_dfpBannerRequest: function(){
            // jDFPOnly.refresh();

            // var windowWidth = window.innerWidth,
            //     isBigWindow = true;
            // if( windowWidth < 540 ) return;
            // else if( windowWidth < 1041 ) isBigWindow = false;

            // var i = this,
            //     HElem_dfpBanner = i.elemList.dfpBanner.el,
            //     HElem_content = i.elemList.dfpBanner.content;

            // jz.qs.css( HElem_dfpBanner, {
            //     width: isBigWindow ? '728px' : '320px',
            //     height: isBigWindow ? '90px' : '100px',
            //     marginLeft: isBigWindow ? '-364px' : '-160px',
            //     display: 'block',
            // } );

            // setTimeout( function(){
            //     jz.qs.addClass( HElem_dfpBanner, 'esCanClose' );
            // }, 600 );
        // },
        //直播判定
        isLive: function(){
            return this.v.duration() === Infinity;
        },
        isLiveInfo: function(){
            return this.v.mediainfo.custom_fields.programtype === 'Live';
        },
        //撥放
        play: function( ChoA ){
            var i = this;

            ChoA = ( typeof ChoA ===  'boolean' )? ChoA : i.v.paused();
            if( ChoA ) i.v.play();
            else i.v.pause();
            return ChoA;
        },
        //時間
        timeCurrent: function( jCurrent ){
            var i = this;
            if( !i.state.ready ) return;

            var jNowTime;

            if( typeof jCurrent === 'number' ){
                i.v.currentTime( jCurrent );
                jNowTime = i.v.currentTime();
                i.timeLineCtrl.timeChange();
            }else
                jNowTime = i.v.currentTime();

            return jNowTime;
        },
        //時間軸
        //>> 修正顯示框位置
        setCorrectFloatShowPlace: function( jInf ){
            var jTimeLine_width = parseFloat( getComputedStyle( jInf.HElemMain ).width ),
                jFloatShow_width = parseFloat( getComputedStyle( jInf.HElem_floatShow ).width ),
                jDeviation = jFloatShow_width / 2 / jTimeLine_width * 100;

            if( jInf.placePercent < jDeviation )
                jInf.HElem_floatShow.style.left = jDeviation + '%';
            else if( jInf.placePercent + jDeviation > 100 )
                jInf.HElem_floatShow.style.left = ( 100 - jDeviation ) + '%';
        },
        setCurrentPlayShow: function( jInf ){
            var i = this,
                HElem_live = bcvPly_userAgent.isMobile ? i.elemList.touch.live : i.elemList.bar.live;
            if( jInf.isLive ){
                //brightcove 直播節目在無法手機回放
                if( bcvPly_userAgent.isMobile ){
                     jz.qs.addClass( HElem_live, 'esUpdate' );
                }else{
                     if( jInf.timeFromEnd < 20 ){
                         jz.qs.addClass( HElem_live, 'esUpdate' );
                     }else{
                         jz.qs.removeClass( HElem_live, 'esUpdate' );
                     }
                }
            }else{
                if( !bcvPly_userAgent.isMobile ){
                    i.elemList.bar.timeCurrent.innerHTML = jInf.timeStr;
                }
            }
        },
        setLiveUpdate: function(){
            var i = this,
                HElem_live = bcvPly_userAgent.isMobile ? i.elemList.touch.live : i.elemList.bar.live;
            jz.qs.addClass( HElem_live, 'esUpdate' );
            i.timeCurrent( i.v.seekable().end(0) );
        },
        //音量
        volume: function( ChoA ){
            //>> 回傳值: 0~1
            var i = this,
                NumA,
                isChange = true;
            switch( ChoA ){
                case true:
                    i.v.muted( false );
                    NumA = i.v.volume();
                    break;
                case false:
                    i.v.muted( true );
                    NumA = 0;
                    break;
                default:
                    if( typeof ChoA === 'number' ) i.v.volume( ChoA );
                    else isChange = false;

                    NumA = i.v.volume();

                    if( NumA === 0 ) i.v.muted( true );
                    else i.v.muted( false );

                    break;
            }

            return NumA;
        },
        adjustVoice: function( anyChoA ){
            var i = this,
                jVolume = i.volume( anyChoA );

            i.elemList.bar.voiceR.style.width
                = i.elemList.bar.voiceBarShow.style.width
                = jVolume * 100 + '%';
        },
        adjustVoiceBar: function( evt ){
            var i = this,
                HElem_voiceBarStick = i.elemList.bar.voiceBarStick,
                jToPoint = jz.prop.mouseOverPlacePercent( 'horizontal', evt, HElem_voiceBarStick );

            i.adjustVoice( jToPoint );
        },
        //全屏
        fullScreen: function( ChoA ){
            var i = this;
            ChoA = ( typeof ChoA === 'boolean' )? ChoA : !i.v.isFullscreen();
            if( ChoA )
                i.v.requestFullscreen();
            else
                i.v.exitFullscreen();

            i.central_ctrlSwitch( false );
            i.central_ctrlSwitch( true );
        },
        //>> 觸控 -----
        touchAdjustTimeTradition: function( evt ){
            var i = this;
            if( !i.state.ready ) return;

            var objTimeLineCtrl = i.timeLineCtrl,
                isLive = objTimeLineCtrl._hide_isLive,
                numPlacePercent = jz.prop.mouseOverPlacePercent( 'horizontal', evt, objTimeLineCtrl.HElemMain ),
                numCurrentTime = objTimeLineCtrl.duration() * numPlacePercent
                    + ( isLive ? objTimeLineCtrl.duration('start') : 0 );

            switch( evt.detail.state ){
                case 'start':
                    i.touchAdjustTimeTradition_preOpenState = jSETPly.hasClass('esBarCtrlTurnOn');
                    i.state.ctrlForceList.i_touchAdjustTimeTradition = false;
                    jz.qs.addClass( i.elemList.touch.el, 'esCloss' );
                    i.elemList.timeLine.el.querySelector('.TxPlyerTimeLine_floatShow').style.top = '-48px';
                    break;
                case 'end':
                    i.state.ctrlForceList.i_touchAdjustTimeTradition = null;
                    if( i.touchAdjustTimeTradition_preOpenState ) i.central_ctrlSwitch( true );
                    jz.qs.removeClass( i.elemList.touch.el, 'esCloss' );
                    i.touchAdjustTime_prePlace = null;
                    i.elemList.timeLine.el.querySelector('.TxPlyerTimeLine_floatShow').style.top = null;
                    break;
            }

            objTimeLineCtrl.timeCurrent( numCurrentTime, evt.detail.state );
            evt.preventDefault();
        },
        touchAdjustTimeTradition_preOpenState: null,
        touchAdjustTime: function( evt ){
            var i = this;
            if( !i.state.ready ) return;

            var jMoveRange;

            //brightcove 直播節目在無法手機回放
            if( bcvPly_userAgent.isMobile && i.timeLineCtrl._hide_isLive ) return;

            if( evt.detail.state === 'start' ){
                i.touchAdjustTime_preTime = +new Date();
                return;
            }else if( i.touchAdjustTime_preTime && evt.detail.state === 'end' ){
                i.touchAdjustTime_preTime = null;
                return;
            }else if( +new Date() - i.touchAdjustTime_preTime < 300 ) return;
            else i.touchAdjustTime_preTime = null;


            if( evt.detail.useType === 'touch' && evt.detail.touchIDList.length !== 1 ){
                if( i.touchAdjustTime_isActing ) evt.detail.state = 'end';
                else return;
            }else if( !i.touchAdjustTime_isActing ){
                evt.detail.state = 'start';
            }


            switch( evt.detail.state ){
                case 'start':
                    i.touchAdjustTime_isActing = true;
                    i.touchAdjustTimeTradition_preOpenState = jSETPly.hasClass('esBarCtrlTurnOn');
                    i.state.ctrlForceList.i_touchAdjustTimeTradition = false;
                    jz.qs.addClass( i.elemList.touch.el, 'esCloss' );
                    i.touchAdjustTime_prePlace = { x: evt.pageX, y: evt.pageY };
                    jMoveRange = 0;
                    break;
                case 'move':
                    jMoveRange = i.touchAdjustTime_countLength({ x: evt.pageX, y: evt.pageY });
                    break;
                case 'end':
                    i.state.ctrlForceList.i_touchAdjustTimeTradition = null;
                    if( i.touchAdjustTimeTradition_preOpenState ) i.central_ctrlSwitch( true );
                    jz.qs.removeClass( i.elemList.touch.el, 'esCloss' );
                    i.touchAdjustTime_isActing
                        = i.touchAdjustTime_prePlace
                        = null;
                    jMoveRange = 0;
                    break;
            }

            i.timeLineCtrl.timeCurrent( 'relative', jMoveRange, evt.detail.state );
            evt.preventDefault();
        },
        touchAdjustTime_preTime: null,
        touchAdjustTime_isActing: null,
        touchAdjustTime_preOpenState: null,
        touchAdjustTime_prePlace: null,
        touchAdjustTime_countLength: function( jPlace_now ){
            var i = this,
                jMoveRange =  2 * ( jPlace_now.x - i.touchAdjustTime_prePlace.x );

            i.touchAdjustTime_prePlace = jPlace_now;

            return jMoveRange;
        },
        touchAdjustVolume: function( jWhich, evt ){
            var i = this,
                isLeft = jWhich === 'L',
                jVolume;

            if( evt.detail.useType === 'touch' && evt.detail.touchIDList.length !== 1 ){
                if( i.touchAdjustVolume_preWhich ){
                    evt.detail.state = 'end';
                    jWhich = i.touchAdjustVolume_preWhich;
                }else return;
            }else if( !i.touchAdjustVolume_preWhich ){
                if( evt.detail.state === 'move' ){
                    evt.detail.state = 'start';
                }else return;
            }

            switch( evt.detail.state ){
                case 'start':
                    i.touchAdjustVolume_preWhich = jWhich;
                    i.touchAdjustVolume_prePlace = { x: evt.pageX, y: evt.pageY };
                    i.touchAdjustVolume_transition( 'start', jWhich );
                    jVolume = i.touchAdjustVolume_nowVolume;
                    break;
                case 'move':
                    jVolume = i.touchAdjustVolume_countLength({ x: evt.pageX, y: evt.pageY });
                    break;
                case 'end':
                    i.touchAdjustVolume_transition( 'end', jWhich );
                    i.touchAdjustVolume_preWhich
                        = i.touchAdjustVolume_nowVolume
                        = i.touchAdjustVolume_prePlace
                        = null;
                    return;
            }

            if( isLeft ) i.elemList.tileOverlay.brightnessForTouch.style.opacity = 1 - jVolume;
            else i.volume( jVolume );

            i.elemList.touch.adjustVolumeR.style.height = ( jVolume * 100 ) + '%';
            evt.preventDefault();
        },
        touchAdjustVolume_nowVolume: null,
        touchAdjustVolume_preWhich: null,
        touchAdjustVolume_prePlace: null,
        touchAdjustVolume_preVolume_brightness: 1,
        touchAdjustVolume_transition: function( jState, jWhich ){
            var i = this,
                isLeft = jWhich === 'L',
                jAddIcon_method,
                jAddIcon_className;

            switch( jState ){
                case 'start':
                    jz.qs.addClass( i.elemList.touch.el, 'esAdjustVolume' );
                    jAddIcon_method = 'add';
                    i.touchAdjustVolume_nowVolume = isLeft ? i.touchAdjustVolume_preVolume_brightness : i.volume();
                    break;
                case 'end':
                    jz.qs.removeClass( i.elemList.touch.el, 'esAdjustVolume' );
                    jAddIcon_method = 'remove';
                    if( isLeft ) i.touchAdjustVolume_preVolume_brightness = i.touchAdjustVolume_nowVolume;
                    break;
            }

            jAddIcon_className = isLeft ? 'TxIcon_touchBrightness' : 'TxIcon_touchVoice';
            jz.qs[ jAddIcon_method + 'Class' ]( i.elemList.touch.adjustVolume, jAddIcon_className )
        },
        touchAdjustVolume_countLength: function( jPlace_now ){
            var i = this,
                jPlaceY =  0.005 * ( jPlace_now.y - i.touchAdjustVolume_prePlace.y ),
                jVolume = i.touchAdjustVolume_nowVolume - jPlaceY;

            jVolume = ( jVolume < 0 )? 0 : ( jVolume > 1 )? 1 : jVolume;

            i.touchAdjustVolume_prePlace = jPlace_now;
            i.touchAdjustVolume_nowVolume = jVolume;

            return jVolume;
        },
        //換片
        setVideo: function( jVideoID, isPlay, jCallback_ready, jCallback_receive ){
            var i = this;
            i.v.catalog.getVideo( jVideoID, function( err, jVideo ){
                if( err ){
                    i.play( false );
                    if( err.data ){
                        var errData = err.data[0];
                        switch( errData.error_code ){
                            case 'ACCESS_DENIED': i.error('accessDenied'); break;
                            case 'VIDEO_NOT_FOUND': i.error('notFoundSrc'); break;
                            default:
                                i.error('unknown');
                                console.log( err );
                        }
                    }else if( typeof err === 'string' ){
                        i.rebuild( true, function(){
                            i.setblock( 'blockError', {
                                contentText: '<span>' + err + '</span>',
                            } );
                        } );
                    }else{
                        i.error('abnormalUsing');
                        console.error( err );
                    }
                    return;
                    // throw '影片讀取錯誤。';
                }

                i.clearCuePoint();

                var jCheckToken = i.state.mediaInfoPileAttic + 1;
                i.onCanPlay( jCheckToken, function(){
                    if( typeof jCallback_ready === 'function' ) jCallback_ready();
                    //無法有效控制
                    i.play( ( isPlay === true )? true : false );
                }, function(){
                    if( typeof jCallback_receive === 'function' ) jCallback_receive();
                } );

                i.v.catalog.load( jVideo );
            } );
        },
        reload: function(){
            var i = this;

            i.removeClass('vjs-seeking');
            i.recover();
            i.setCuePart();

            var isLive = i.isLive();
            console.log( isLive )
            i.timeLineCtrl.setIsLive( isLive );
            i.timeLineCtrl.initState();

            if( bcvPly_userAgent.isMobile ){
            }else{
                if( isLive ){
                }else{
                    var jDuration = i.v.duration();
                    i.elemList.bar.timeCurrent.innerHTML = ( jDuration < 3600 )? '00:00' : '00:00:00';
                    i.elemList.bar.timeDuration.innerHTML = i.timeLineCtrl.getTimeString( jDuration ).join(':');
                }
            }

            if( typeof i.onreload === 'function' ) i.onreload.call( i );
        },
        //提示點
        clearCuePoint: function(){
            var i = this,
                jTextTracks = i.v.textTracks(),
                jCueTrackList = i.state.cueTrackList;

            if( jCueTrackList )
                for(var p = 0, len = jCueTrackList.length; p < len ; p++){
                    jTextTracks[ jCueTrackList[ p ] ].oncuechange = null;
                }

            i.state.cueTrackList = null;
        },
        //>> jInfList: id, start, end
        setCuePoint: function( jInfList ){
            var i = this,
                jTextTrack = i.v.textTracks()[ jInfList.id ],
                jCueTrackList = i.state.cueTrackList;

            if( !jCueTrackList ) jCueTrackList = i.state.cueTrackList = [];

            jCueTrackList.push( jInfList.id );

            var isFunc_start = typeof jInfList.start === 'function',
                isFunc_end = typeof jInfList.end === 'function';
            jTextTrack.oncuechange = function(){
                if( jTextTrack.activeCues[0] !== undefined && isFunc_start )
                    jInfList.start( jTextTrack.activeCues[0] );
                else if( isFunc_end )
                    jInfList.end();
            };
        },
        //影片斷點
        setCuePart: function(){
            var i = this,
                jTimeDuration = i.v.duration(),
                jCuePointList = i.v.mediainfo.cue_points,
                HElem_origin = document.createElement('b'),
                HElem,
                jMetadata;

            i.elemList.timeLine.part.innerHTML = '';
            for(var p = 0, jItem; jItem = jCuePointList[ p++ ] ; ){
                if( jItem.type !== 'CODE' ) continue;

                HElem = HElem_origin.cloneNode();
                HElem.style.left = ( jItem.startTime / jTimeDuration * 100 ) + '%';
                i.elemList.timeLine.part.appendChild( HElem );
            }

            i.setCuePoint({
                id: i.state.mediaInfoPileAttic - 1,
                start: function( jVTTCue ){
                    for(var p = 0, jItem; jItem = jCuePointList[ p++ ] ; )
                        if( jItem.startTime === jVTTCue.startTime ){
                            if( jItem.metadata ){
                                jMetadata = JSON.parse( jItem.metadata );
                                // DFP 標記
                                // if( !bcvPly_userAgent.isMobile && 'ad' in jMetadata ) i.central_dfpBannerRequest();
                            }
                        }
                },
                end: function(){
                    /* 此段結束 */
                },
            });
        },
        //廣告
        setAd: function( jAdURL ){
            if( typeof this.v.ima3 === 'function' )
                this.v.ima3({ serverUrl: jAdURL });
            else
                this.v.ima3.adrequest( jAdURL );
        },
        error: function( errCode ){
            var i = this,
                bcvErrInf = ion_initPly_inf.bcvErr,
                errInf = bcvErrInf[ errCode ] || bcvErrInf.unknown;

            function showError(){
                i.setblock( 'blockError', {
                    contentText: '<span>' + errInf.msg + '</span>',
                    // setFunc: function(){},
                    // removeFunc: function(){},
                } );
            }

            if( errInf.action && errInf.action[0] ) i.rebuild( errInf.action[1], showError );
            else showError();
        },
        inform: function( jCode ){
            var i = this,
                informList = ion_initPly_inf.informList,
                errMsg = informList[ jCode ],
                HElem_inform = i.elemList.inform;

            if( !errMsg
                || i.blockList.indexOf( errMsg[0] ) === -1
                || !( errMsg[1] in HElem_inform )
            ) return;

            i.setblock( errMsg[0], {
                contentHTML: HElem_inform[ errMsg[1] ],
            } );
        },
        //鍵盤操控
        keyboardShortcut: function( evt ){
            var i = this;
            if( !i.state.ready ) return;

            switch( evt.keyCode ){
                //方向鍵
                case 37: //向左鍵
                    i.timeCurrent( i.v.currentTime() - i.v.duration() / 30 );
                    return;
                case 38: //向上鍵
                    i.adjustVoice( i.v.volume() + 0.1 );
                    return;
                case 39: //向右鍵
                    i.timeCurrent( i.v.currentTime() + i.v.duration() / 30 );
                    return;
                case 40: //向下鍵
                    i.adjustVoice( i.v.volume() - 0.1 );
                    return;
                case 70: //f
                    i.fullScreen();
                    return;
                case 80: //p
                    i.snapshot();
                    return;
                case 32: //空白鍵
                    i.play();
                    i.actFilter( 'centralCtrlSwitch', function(){
                        i.state.ctrlForceList.pause = null;
                        i.central_ctrlSwitch( false );
                    }, 600 );
                    return;
            }
        },
        //外框
        /* jInf = {
            css: {...},
            contentHTML: Element(),
            contentText: String(),
            setFunc: function(){...},
            removeFunc: function(){...},
        }; */
        floatblock: function( jInf ){
            var i = this,
                HElem_blockFloat = i.elemList.block.floatBlock,
                jBlockInfList = i.blockInfList,
                jPrevInf = jBlockInfList.floatblockInf;

            if( jPrevInf )
                i.setFloatblock( 'remove', HElem_blockFloat, jPrevInf );

            if( !jInf ){
                jBlockInfList.floatblockInf = null;
                HElem_blockFloat.remove();
            }else{
                jBlockInfList.floatblockInf = jInf;
                jz.qs.before( i.elemList.refPoint.error, HElem_blockFloat );
                i.setFloatblock( 'add', HElem_blockFloat, jInf );
            }
        },
        setFloatblock: function( jActType, HElem_blockFloat, jInf ){
            var ObjTem = {};
            for(var jName in jInf.css ){
                ObjTem[ jName ] = ( jActType === 'add' )? jInf.css[ jName ] : null;
            }
            jz.qs.css( HElem_blockFloat, ObjTem );

            if( jActType === 'add' ){
                HElem_blockFloat.empty();
                if( jInf.contentHTML ) HElem_blockFloat.appendChild( jInf.contentHTML );
                else if( jInf.contentText ) HElem_blockFloat.innerHTML = jInf.contentText;

                if( typeof jInf.setFunc === 'function' ){
                    requestAnimationFrame(function(){
                        jInf.setFunc.call( HElem_blockFloat );
                    });
                }
            }else{
                HElem_blockFloat.empty();

                if( typeof jInf.removeFunc === 'function' )
                    jInf.removeFunc.call( HElem_blockFloat );
            }
        },
        prevSetblock: function(){
            var i = this,
                jBlockInfList = i.blockInfList;
            var jItem = jBlockInfList.forceBlockList.pop();

            jBlockInfList.forceBlockInf = null;

            i.elemList.block.forceBlock.remove();
            i.elemList.block.forceBlock.empty();
            if( jItem ) i[ jItem[0] ]( jItem[1] );
            else{
                i.state.ctrlForceList.i_setblock = null;
                i.central_ctrlSwitch( true );
            }
        },
        setblock: function( jActFuncName, jInf ){
            var i = this,
                jBlockInfList = i.blockInfList;

            if( jBlockInfList.forceBlockInf )
                jBlockInfList.forceBlockList.push( jBlockInfList.forceBlockInf );

            jBlockInfList.forceBlockInf = [ jActFuncName, jInf ];

            i.elemList.block.forceBlock.remove();
            i.elemList.block.forceBlock.empty();
            i[ jActFuncName ]( jInf );

            i.state.ctrlForceList.i_setblock = false;
            i.central_ctrlSwitch( false );
        },
        blockList: [ 'blockError', 'blockWarn', 'blockShowInf', 'blockInteract' ],
        /* jInf = {
            contentHTML: Element(),
            contentText: String(),
            setFunc: function(){...},
            removeFunc: function(){...},
        }; */
        blockError: function( jInf ){
            var i = this,
                HElem_forceBlock = i.elemList.block.forceBlock,
                HElem_main = i.elemList.block.error,
                HElem_content = i.elemList.block.error_content;

            HElem_content.empty();
            if( jInf.contentHTML ) HElem_content.appendChild( jInf.contentHTML );
            else if( jInf.contentText ) HElem_content.innerHTML = jInf.contentText;

            HElem_forceBlock.appendChild( HElem_main );
            jz.qs.before( i.elemList.refPoint.error, HElem_forceBlock );
        },
        /* jInf = {
            title: String,
            contentHTML: Element(),
            contentText: String(),
            setFunc: function(){...},
            removeFunc: function(){...},
        }; */
        blockWarn: function( jInf ){
            var i = this,
                HElem_forceBlock = i.elemList.block.forceBlock,
                HElem_main = i.elemList.block.warn,
                HElem_title = i.elemList.block.warn_title,
                HElem_content = i.elemList.block.warn_content,
                isHElemContent = !!jInf.contentHTML;

            HElem_title.empty();
            HElem_title.innerHTML = isHElemContent ? jInf.contentHTML.dataset.title : jInf.title;

            HElem_content.empty();
            if( isHElemContent ) HElem_content.appendChild( jInf.contentHTML );
            else if( jInf.contentText ) HElem_content.innerHTML = jInf.contentText;

            HElem_forceBlock.appendChild( HElem_main );
            jz.qs.before( i.elemList.refPoint.error, HElem_forceBlock );
        },
        /* jInf = {
            title: String,
            contentHTML: Element(),
            contentText: String(),
            setFunc: function(){...},
            removeFunc: function(){...},
        }; */
        blockShowInf: function( jInf ){
            var i = this,
                HElem_forceBlock = i.elemList.block.forceBlock,
                HElem_main = i.elemList.block.showInf,
                HElem_title = i.elemList.block.showInf_title,
                HElem_content = i.elemList.block.showInf_content,
                isHElemContent = !!jInf.contentHTML;

            HElem_title.empty();
            HElem_title.innerHTML = isHElemContent ? jInf.contentHTML.dataset.title : jInf.title;

            HElem_content.empty();
            if( isHElemContent ) HElem_content.appendChild( jInf.contentHTML );
            else if( jInf.contentText ) HElem_content.innerHTML = jInf.contentText;

            HElem_forceBlock.appendChild( HElem_main );
            jz.qs.before( i.elemList.refPoint.error, HElem_forceBlock );
        },
        blockInteract: function(){
            // i.elemList.block.interact
        },
    });

    bcvPlyInit.extend({
        snapshot: function(){
            var i = this,
                v = i.video,
                numWP = v.clientWidth,
                numHP = v.clientHeight,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image(),
                downloadLink = document.createElement('a');
            img.src = getComputedStyle( i.HElem.querySelector('.TxTileOverlay_vidol') ).backgroundImage.match(/(http.+\.png)/)[1];
            canvas.width = numWP;
            canvas.height = numHP;
            ctx.drawImage( v, 0, 0, numWP, numHP );
            ctx.drawImage( img, 0, 0, numWP, numHP );
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.download = 'VidoliSnapshot.png';
            document.body.appendChild( downloadLink );
            downloadLink.click();
            document.body.removeChild( downloadLink );

            var numCloseTimeoutID = null;
            i.floatblock({
                css: {
                    width: '70px',
                    height: '16px',
                    margin: '-12px -40px',
                    padding: '6px 10px',
                    display: 'block',
                    top: '50%',
                    left: '50%',
                    // background: 'rgba(51, 51, 51, 0.8)',
                    background: 'linear-gradient(to bottom right, #1d00f5, #23f5e0, #ffab09, #d27f7f, #ff0000)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '14px',
                    color: '#fffe92',
                    textAlign: 'center',
                    textShadow: '2px 2px 2px #000000',
                },
                contentText: 'Vidol \u5feb\u62cd',
                setFunc: function(){
                    numCloseTimeoutID = setTimeout( function(){
                        if( numCloseTimeoutID ) i.floatblock();
                    }, 1000 );
                },
                removeFunc: function(){
                    if( numCloseTimeoutID ){
                        numCloseTimeoutID = null;
                        clearTimeout( numCloseTimeoutID );
                    }
                },
            });
        },
    });

    function ion_bindEvt( jSelf, jMethod, jEventList ){
        for(var p in jEventList )
            jSelf.v[ jMethod ]( p, jEventList[ p ] );
    }
}();
