"use strict";

    var browserWatching = {
            focusFuncList: [],
            leaveFuncList: [],
            visibility: function(){
                var FuncList = this.focusFuncList;
                for(var p = 0, Func; Func = FuncList[ p++ ] ; ) Func();
            },
            noVisibility: function(){
                var FuncList = this.leaveFuncList;
                for(var p = 0, Func; Func = FuncList[ p++ ] ; ) Func();
            },
            beforeunloadFuncList: [],
        };

    //>> 分頁狀態
    if( document.visibilityState ){
        document.addEventListener( 'visibilitychange', function(){
            var isVisibility = ( document.visibilityState == 'visible' )? true : false;
            if( isVisibility ) browserWatching.visibility();
            else browserWatching.noVisibility();
        }, false );
    }else{
        // window.addEventListener( 'focus', function(){
        //     browserWatching.visibility();
        // }, false );
        // window.addEventListener( 'blur', function(){
        //     browserWatching.noVisibility();
        // }, false );
    }

    //>> 離開
    window.addEventListener( 'beforeunload', function( evt ){
        var FuncList = browserWatching.beforeunloadFuncList;
        for(var p = 0, Func; Func = FuncList[ p++ ] ; ) Func();
    }, false );


void function( jOutSideFunc ){
    window.setPlyPlugin = function( jBcvPly ){
        jBcvPly.ready(function(){
            var i = this;

            i.customInit();

            //每 response.expires 秒固定執行 keep live
            i.plyTimeout = i.setPlyTimeout( function(){
                i.xhrVideoRecord('keep alive');
            }, 3 * 60 * 1000 );

            i.onrebuild = function(){
                i.customRebuild();

                i.firstPlayCheck = function(){
                    i.firstPlayCheck = null;
                    xhrCheckRights( false, 'setVideo' );
                };

                //收藏 CSS
                i.setCollect = function( isCollect ){
                    var HElem_collect = bcvPly_userAgent.isMobile ? i.elemList.touch.collect: i.elemList.bar.collect
                    if( isCollect === true ){
                        jz.qs.addClass( HElem_collect, 'esHave' );
                        // jz.qs.addClass( i.elemList.ctrlToolBar.collect, 'esHave' );
                    }else{
                        jz.qs.removeClass( HElem_collect, 'esHave' );
                        // jz.qs.removeClass( i.elemList.ctrlToolBar.collect, 'esHave' );
                    }
                };

                i._hide_browserBugClickID = [ null ];
                var jCollectLock = false,
                    FuncCollect = function(){
                        if( !i.state.ready || jCollectLock ) return;
                        jCollectLock = true;

                        if( this.classList.contains('esHave') ){
                            $.ajax({
                                url: '/watchlater?episode_id=' + i.videoInfo.id[1],
                                type: 'DELETE',
                                success: function(){
                                    i.setCollect( false );
                                    jOutSideFunc.pushMessage( 'error', gon.watchLater_delete, function(){ jCollectLock = false; } );
                                },
                                error: function(){
                                    jOutSideFunc.pushMessage( 'error', gon.watchLater_delete_error, function(){ jCollectLock = false; } );
                                }
                            });
                        }else{
                            $.post( '/watchlater?episode_id=' + i.videoInfo.id[1] )
                                .success(function(){
                                    i.setCollect( true );
                                    jOutSideFunc.pushMessage( 'success', gon.watchLater_add, function(){ jCollectLock = false; } );
                                })
                                .error(function(){
                                    jOutSideFunc.pushMessage( 'error', gon.watchLater_add_error, function(){ jCollectLock = false; } );
                                });
                        }
                    },
                    FuncCyclicView = function(){
                        if( !i.state.ready ) return;
                        i.play( false );
                        if( bcvPly_userAgent.isMobile || bcvPly_userAgent.browser === 'Safari' ){
                            // 瀏覽器 Bug ( Chrome )
                            i.actFilter( 'browserBugClick', function(){
                                i.inform('recommendUseApp');
                            }, 300 );
                        }else{
                            var objVideoInfo = i.videoInfo;
                            open( '/activity/' + objVideoInfo.custPly[1].url + '?item_type=' + objVideoInfo.type[1] + '&item_id=' + objVideoInfo.id[1] );
                        }
                    };

                /* //分享
                   i.elemList.ctrlToolBar.share.onclick = function(){
                       i.inform('share');
                   };
                   [ 'FB', 'Line', 'Twitter', 'Sina', 'Weibo' ].map(function( jItem ){
                       i.elemList.inform.share.querySelector( '.TxIcon_Share' + jItem ).onclick = function( evt ){
                           jOpenShareURL( jItem );
                           evt.stopPropagation();
                       };
                   });
                -*/

                i.flyMsg = new jFlyMsg_forDanmu( i.elemList.flyMsg.show, {
                    opacity: '0.8',
                    zindex: null,
                    SubtitleProtection: true,
                } );

                var FuncFlyMsg = function(){
                        var Cho = !jz.qs.hasClass( this, 'esOpen' );

                        if( Cho ){
                            jz.qs.addClass( this, 'esOpen' );
                            i.flyMsg.actFlyMsg( 'setOpacity', '1' );
                        }else{
                            jz.qs.removeClass( this, 'esOpen' );
                            i.flyMsg.actFlyMsg( 'setOpacity', '0' );
                        }
                    };


                if( bcvPly_userAgent.isMobile ){
                    jz.wCode.evtBind( i.elemList.touch.collect, 'add', {
                        click: jz.wCode.evtStopBubble,
                        multimouse: function( evt ){
                            evt.stopPropagation();
                            if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;
                            FuncCollect.call( this );
                        },
                    } );
                    // i.elemList.ctrlToolBar.collect.addEventListener( 'multimouse', FuncTouch );

                    jz.wCode.evtBind( i.elemList.touch.cyclicView, 'add', {
                        click: jz.wCode.evtStopBubble,
                        multimouse: function( evt ){
                            evt.stopPropagation();
                            if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;
                            FuncCyclicView();
                        },
                    } );
                    // i.elemList.ctrlToolBar.flyMsg.addEventListener( 'multimouse', FuncTouch );

                    jz.wCode.evtBind( i.elemList.touch.flyMsg, 'add', {
                        click: jz.wCode.evtStopBubble,
                        multimouse: function( evt ){
                            evt.stopPropagation();
                            if( evt.detail.useType !== 'touch' || evt.detail.state !== 'end' ) return;
                            FuncFlyMsg.call( this );
                        },
                    } );
                    // i.elemList.ctrlToolBar.flyMsg.addEventListener( 'multimouse', FuncTouch );
                }else{
                    i.elemList.bar.collect.onclick = FuncCollect;
                    // i.elemList.ctrlToolBar.collect.onclick = FuncCollect;

                    i.elemList.bar.cyclicView.onclick = FuncCyclicView;
                    // i.elemList.ctrlToolBar.cyclicView.onclick = FuncCyclicView;

                    i.elemList.bar.flyMsg.onclick = FuncFlyMsg;
                    // i.elemList.ctrlToolBar.flyMsg.onclick = FuncFlyMsg;
                }

                i.elemList.inform.unLogin.querySelector('button').onclick = function( evt ){
                    i.login();
                    evt.stopPropagation();
                };

                i.elemList.inform.recommendUseApp.querySelector('button').onclick = function( evt ){
                    i.deepLink();
                    evt.stopPropagation();
                };

                //搶撥放權限
                i.elemList.inform.catchPlayRight.querySelector('button').onclick = function( evt ){
                    i.prevSetblock();
                    xhrCheckRights( true, i.state.mediaInfoPileAttic? 'BlockMemberLogin' : 'setVideo' );
                    evt.stopPropagation();
                };


                i.on({
                    play: function(){
                        //開全銀幕無效果 雖有點擊 但似乎事件有特殊之處
                        //if( bcvPly_userAgent.isMobile ) i.fullScreen( true );
                        i.xhrVideoRecord('keep alive');
                    },
                    pause: function(){
                        i.xhrVideoRecord('release lock');
                    },
                    timeupdate: function(){
                        if( !i.state.ready || i.v.paused() ) return;

                        i.plyTimeout.trigger();
                    },
                    ended: function(){
                        i.xhrVideoRecord( 'release lock', 1 );
                    },
                });
            };
            i.onrebuild();

            i.onrecover = function(){
            };


            browserWatching.focusFuncList.push(function(){});
            browserWatching.leaveFuncList.push(function(){
                i.play( false );
            });

            browserWatching.beforeunloadFuncList.push(function(){
                if( !i.v.paused() ) i.xhrVideoRecord('release lock');
            });


            i.onreload = function(){
                i.flyMsg.actFlyMsg('pause');
                i.flyMsg.timeCurrent(0);
                i.flyMsg.clearMsgList();
                i.removeClass('esFlyMsg');
                if( bcvPly_userAgent.isMobile ){
                    jz.qs.removeClass( i.elemList.touch.flyMsg, 'esOpen' );
                }else{
                    jz.qs.removeClass( i.elemList.bar.flyMsg, 'esOpen' );
                }
                jz.qs.removeClass( i.elemList.ctrlToolBar.flyMsg, 'esOpen' );
                i.flyMsg.actFlyMsg( 'setOpacity', '0' );
            };

            function xhrCheckRights( bisForce, strStateType ){
                var strType, strID, objCustPly,
                    objVideoInfo = i.videoInfo;
                if( i.state.mediaInfoPileAttic ){
                    strType = objVideoInfo.type[1];
                    strID = objVideoInfo.id[1];
                    objCustPly = objVideoInfo.custPly[1]
                }else{
                    strType = gon.item_type;
                    strID = gon.item_id;
                    objCustPly = gon.custom_player;
                }

                i.xhrCheckRights(
                    {
                        item_type: strType,
                        item_id: strID,
                        force: bisForce,
                    },
                    objCustPly,
                    strStateType,
                    null,
                    function( err, objInfo ){
                        if( err ) throw err;
                        i.setVideo( objInfo );
                    }
                );
            }
        });
    };
}(
{
    pushMessage: function( HElemBlock, jMsg, jCallback ){
        switch( HElemBlock ){
            case 'success': HElemBlock = this.pushMessage_HElemSuccess; break;
            case 'error': HElemBlock = this.pushMessage_HElemError; break;
            default: return;
        }

        HElemBlock.html( '<li>' + jMsg + '</li>' ).fadeIn().delay( 1000 ).fadeOut();
        if( typeof jCallback === 'function' ) setTimeout( function(){ jCallback(); }, 1000 );
    },
    pushMessage_HElemSuccess: $('#success_message'),
    pushMessage_HElemError: $('#error_message'),
},
function(){
    function setCustomInit(){
        var i = this;

        var jLockPlay = {
                exceptionTimes: 0,
                rights: null,
            };

        i.videoInfo = {
            type: [ null, null, null ],
            id: [ null, null, null ],
            custPly: [ null, null ],
        };


        i.checkRightsAction = function( objInfo ){
            return checkRightsAction.call( i, jLockPlay, objInfo );
        };

        i.loginPath = '/members/login';

        i.setVideo = function( objInfo ){
            jLockPlay.exceptionTimes = 0;
            var watchAlias = objInfo.setWatchAlias;
            i.setVideoInfo_single( 'id', 2, watchAlias.itemID );
            i.setVideoInfo_single( 'type', 2, watchAlias.itemType );

            if( i.checkRightsAction( objInfo ) !== true ) return;
            switch( objInfo.causeType ){
                case 'BlockMemberLogin':
                    if( typeof objInfo.playBeforeFunc === 'function' ) objInfo.playBeforeFunc();
                    i.play( true );
                    break;
                case 'setVideo': watchVideo.call( i, objInfo ); break;
            }
        };

        i.customRebuild = function(){
            jLockPlay = {
                exceptionTimes: 0,
                rights: null,
            };

            i.setVideoInfo_single( 'id', 0, null );
            i.setVideoInfo_single( 'type', 0, null );
            i.setVideoInfo_single( 'custPly', 0, null );

            i.on({
                play: function(){
                    if( checkLockPlay( i, jLockPlay ) ) return;
                },
            });
        };
    }

    var jFlyMsg = {
            wsocketServerPath: 'ws://54.199.206.243:8080/barrage',
            wsocket: function( jObjMain, jCallback ){
                var jWSocket,
                    nLinkTimes = 0;
                void function jLink(){
                    jWSocket = jObjMain.flyMsgWSocket = new WebSocket( this.wsocketServerPath );
                    jWSocket.onopen = function( evt ){ jCallback( 'open', evt ); };
                    jWSocket.onmessage = function( evt ){ jCallback( 'message', evt ); };
                    jWSocket.onerror = function( evt ){
                        console.log( '連接錯誤', arguments );
                        if( nLinkTimes++ < 3 ) jLink();
                        else jCallback( 'error', evt );
                    };
                    jWSocket.onclose = function( evt ){ jCallback( 'close', evt ); };
                }();
            },
            arrangeMsgList: function( jFlyMsg, jInfList ){
                var jMsgList = jInfList['messages'],
                    jFlyMsgList = [];
                for(var p = 0, jMsg; jMsg = jMsgList[ p++ ] ; ){
                    if( !jMsg.msg ) continue;

                    jFlyMsgList.push( jFlyMsg.getMsg({
                        text: jMsg.msg,
                        position: 0,
                        time: jMsg.video_time,
                    }) );
                }

                return jFlyMsgList;
            },
        };

    bcvPlyInit.extend({
        customInit: setCustomInit,
        setPlyTimeout: function( Func, NumDwellTime ){
            return {
                func: Func,
                time: NumDwellTime,
                refTime: new Date().getTime(),
                trigger: function(){
                    var nNow = new Date().getTime();
                    if( nNow - this.refTime < this.time ) return;
                    this.refTime = nNow;
                    this.func();
                },
            };
        },
        linkFlyMsgWSocket: function( jSend ){
            /*
            jFlyMsg.wsocket( i, function( jActType, evt ){
                switch( jActType ){
                    case 'open':
                        i.flyMsgWSocket.send( JSON.stringify( jSend ) );
                        // jWSocket.send( JSON.stringify( {"video_type":"episode","video_id":"205"} ) );
                        // jWSocket.send( JSON.stringify( {"video_type":"live","video_id":"205"} ) );
                        // jWSocket.send( JSON.stringify( {"video_type":"channel","video_id":"205","msg":"影音34"} ) );
                        break;
                    case 'message':
                        console.log( '伺服器回傳', arguments );
                        var jData = JSON.parse( evt.data ),
                            jFlyMsgList = jFlyMsg.arrangeMsgList( i.flyMsg, jData );
                        if( jFlyMsgList.length ){
                            i.addClass('esFlyMsg');
                            jFlyMsg.actFlyMsg( 'addMsgList', jFlyMsgList );
                        }
                        break;
                    case 'error':
                        console.log( '連接錯誤', arguments );
                        break;
                    case 'close':
                        console.log( '連接關閉', arguments );
                        // jWSocket.close();
                        break;
                }
            } );
            */
        },
    });

    bcvPlyInit.extend({
        play: function( ChoA ){
            var i = this;

            ChoA = ( typeof ChoA ===  'boolean' )? ChoA : i.v.paused();
            if( ChoA ){
                if( i.state.mediaInfoPileAttic === 0 ){
                    if( i.firstPlayCheck ) i.firstPlayCheck();
                }else{
                    i.v.play();
                    i.flyMsg.actFlyMsg('play');
                    if( i.draw ) i.draw.action();
                }
            }else{
                i.v.pause();
                i.flyMsg.actFlyMsg('pause');
                if( i.draw ) i.draw.cut();
            }

            // if( bcvPly_userAgent.isMobile ) i.fullScreen( ChoA );

            return ChoA;
        },
        timeCurrent: function( jCurrent ){
            var i = this;
            if( !i.state.ready ) return;

            var jNowTime;

            if( typeof jCurrent === 'number' ){
                i.v.currentTime( jCurrent );
                jNowTime = i.v.currentTime();
                i.flyMsg.timeCurrent( jNowTime );
                i.timeLineCtrl.timeChange();
            }else
                jNowTime = i.v.currentTime();

            return jNowTime;
        },
    });

    function checkLockPlay( jBcvPly, jLockPlay ){
        var isLockPlay = false;

        if( jLockPlay.rights ){
            isLockPlay = true;
            jBcvPly.inform( jLockPlay.rights );
        }

        if( jLockPlay.exceptionTimes > 17 ) jBcvPly.error('abnormalUsing');
        else if( isLockPlay ){
            jLockPlay.exceptionTimes++;
            jBcvPly.timeLineCtrl.setIsVideoReady( false );
            jBcvPly.play( false );
        }else{
            jLockPlay.exceptionTimes = 0;
            jBcvPly.timeLineCtrl.setIsVideoReady( true );
        }

        return isLockPlay;
    }

    var xhrVideoRecord_isCall = null;
    bcvPlyInit.extend({
        xhrCheckRights: function( objSendData, objCustPly, strStateType, funcPlayBefore, funcCallback ){
            var i = this,
                objInfo = {
                    unLogin: null,
                    unLoginPath: null,
                    un_buy: null,
                    episode_package: null,
                    email_unvalidate: null,
                    current_watch: null,
                    play: true,
                    causeType: strStateType,
                    setWatchAlias: {
                        itemType: objSendData.item_type,
                        itemID: objSendData.item_id,
                        videoID: '5136212750001',
                        custPly: objCustPly,
                        timeNow: 0,
                        collect: false,
                        expire: NaN,
                        isADPlay: true,
                    },
                    playBeforeFunc: funcPlayBefore,
                    exceptionFunc: function(){
                        i.error('unknown');
                        // console.error( ObjResponseInf );
                    },
                };

            funcCallback( null, objInfo );
        },
        xhrVideoRecord: function( strActionType, numTimeCurrent ){
            return;
        },
        login: function(){
            open( this.loginPath, '_self' );
        },
    });

    //ObjInf:
    //>> un_buy, email_unvalidate, current_watch, play,
    //>> exceptionFunc
    //>> playBeforeFunc, causeType, setWatchAlias
    function checkRightsAction( jLockPlay, ObjInf ){
        var i = this,
            isPlay = false;

        i.play( false );
        i.elemList.custPly.el.empty();

        if( ObjInf.unLogin ){
            i.loginPath = ObjInf.unLoginPath;
            jLockPlay.rights = 'unLogin';
        }else if( ObjInf.un_buy ){
            checkRightsAction_unBuyValidate( i, ObjInf.episode_package );
            jLockPlay.rights = 'unBuyValidate';
        }else if( ObjInf.email_unvalidate ){
            jLockPlay.rights = 'emailUnValidate';
        }else if( ObjInf.current_watch ){
            jLockPlay.rights = 'catchPlayRight';
        }else if( ObjInf.play ){
            jLockPlay.rights = null;
            isPlay = true;
        }else{
            console.error('exception');
            if( typeof ObjInf.exceptionFunc === 'function' ) ObjInf.exceptionFunc();
            return;
        }

        if( !isPlay && typeof ObjInf.prePlayFunc === 'function' ) ObjInf.prePlayFunc();

        checkLockPlay( i, jLockPlay );
        return isPlay;
    }

    function checkRightsAction_unBuyValidate( i, jInfList ){
        var txt = '';

        for(var p = 0, jInf; jInf = jInfList[ p++ ] ; ){
            txt += '<li><a href="' + jInf.url + '"><span class="caseName">' + jInf.name + '</span><span class="caseMoney"><span class="text">NT$</span>' + jInf.cost + '<span></a></li>';
        }

        i.elemList.inform.unBuyValidate.querySelector('ul').innerHTML = txt;
    }

    // setVideo: function( jVideoID, isPlay, jCallback ){
    var funcSetVideo = bcvPlyInit.prototype.setVideo;

    //ObjInf: videoID, timeNow, collect
    function watchVideo( objInfo ){
        var i = this,
            objWatchAlias = objInfo.setWatchAlias,
            objCustPly = objWatchAlias.custPly || {},
            isOutPlyer = [ 'youtube' ].indexOf( objCustPly.player ) !== -1;

        i.elemList.custPly.el.empty();

        funcSetVideo.call( i, objWatchAlias.videoID, isOutPlyer ? false : true, function(){
            if( typeof objInfo.prePlayFunc === 'function' ) objInfo.prePlayFunc();
            if( typeof objInfo.playBeforeFunc === 'function' ) objInfo.playBeforeFunc();

            i.removeClass( 'esCyclicView', 'esYoutube' );
            switch( objCustPly.player ){
                case '360player':
                    i.addClass('esCyclicView');
                    break;
                case 'youtube':
                    console.log(1)
                    i.addClass('esYoutube');
                    i.elemList.custPly.el.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + objCustPly.url + '?autoplay=1&modestbranding=1&rel=0" frameborder="0" allowfullscreen></iframe>';
                    break;
            }

            if( isOutPlyer ) return;

            var isLive = i.isLive();

            if( objWatchAlias.isADPlay ){
                // i.setAd('https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=');
                // i.setAd('https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/123939770/vidol.tv_afv&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]');
                i.setAd('https://pubads.g.doubleclick.net/gampad/ads?sz=1024x768&iu=/123939770/test_sabine_0120&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]');
            }

            if( !isLive ){
                i.timeCurrent( objWatchAlias.timeNow );

                if( objWatchAlias.collect ) i.setCollect( objWatchAlias.collect );
            }

            if( !isNaN( objWatchAlias.expire ) ) i.plyTimeout.time = objWatchAlias.expire * 1000;

            if( i.flyMsgWSocket ) i.flyMsgWSocket.close();
            i.linkFlyMsgWSocket({ video_type: objInfo.itemType, video_id: objInfo.itemID });
        }, function(){
            i.setVideoInfo( 'type', objWatchAlias.itemType );
            i.setVideoInfo( 'id', objWatchAlias.itemID );
            i.setVideoInfo( 'custPly', objCustPly );
        } );
    }

    bcvPlyInit.extend({
        onCanPlayFunc: function( jCheckToken, jCallback_ready, jCallback_receive ){
            var i = this,
                isOneTimes = 0;

            function jActCheck(){
                if( isOneTimes ) return;
                else if( jCheckToken !== i.state.mediaInfoPileAttic ) isOneTimes = 1;
                else if( i.isLive() !== i.isLiveInfo() ) return;
                else if( typeof jCallback_ready === 'function' ){
                    isOneTimes = 1;
                    if( typeof jCallback_ready === 'function' ) jCallback_ready();
                }
            }

            var objItemType = i.videoInfo.type,
                objItemID = i.videoInfo.id;
            if( bcvPly_userAgent.isMobile || ( objItemType[0] === objItemType[1] && objItemID[0] === objItemID[1] ) ){
                jActCheck();
            }

            if( typeof jCallback_receive === 'function' ) jCallback_receive();

            i.v.on( 'durationchange', function jTem(){
                jActCheck();
                if( isOneTimes ) i.v.off( 'durationchange', jTem );
            } );
            i.v.one( 'play', function jTem(){
                if( isOneTimes ) return;
                jActCheck();
            } );
        },
        breakThroughLock: function( objInfo ){
            this.setVideo( objInfo );
        },
        setVideoInfo_single: function( strKey, numIndex, strVal ){
            this.videoInfo[ strKey ][ numIndex ] =  ( [ 'type', 'id' ].indexOf( strKey ) !== -1 )? String( strVal ) : strVal;
        },
        setVideoInfo: function( strKey, strVal ){
            var objVideoInfo = this.videoInfo;
            objVideoInfo[ strKey ][0] = objVideoInfo[ strKey ][1];
            this.setVideoInfo_single( strKey, 1, strVal );
        },
    });


    var deepLink_isEepisode = /episode_id=([^&]+)/,
        deepLink_isProgrammes = /(programmes\/[^?]+)/,
        deepLink_isEvent = /event\/([^?]+)/;

    bcvPlyInit.extend({
        deepLink: function(){
            var objMatch,
                strURL_forWeb,
                strURL_forApp;
            if( !!( objMatch = location.search.match( deepLink_isEepisode ) ) ){
                strURL_forWeb = location.pathname.split(/^\//)[1] + location.search;
                strURL_forApp = 'episodes/' + objMatch[1];
            }else if( !!( objMatch = location.pathname.match( deepLink_isProgrammes ) ) ){
                strURL_forWeb = objMatch[1];
                strURL_forApp = objMatch[1];
            }else if( !!( objMatch = location.pathname.match( deepLink_isEvent ) ) ){
                strURL_forWeb = 'event/' + objMatch[1];
                strURL_forApp = 'events/' + objMatch[1];
            }
            open( '//app.vidol.tv?appurl=' + strURL_forApp + '&weburl=' + strURL_forWeb );
        },
    });
}()
);

    //外部召喚
    /* 預設情況
        撥放器是全螢幕的大小 只有 瀏覽器視窗大小 和 卷軸事件 會改變
        並且主撥放器 ID 為 SETPly
    */
    function mixtureOutBcvPly( jBcvPlyMain ){
        var i = this;

        window.addEventListener( 'load', function jDOMReadyEvt(){
            jBcvPlyMain.firstPlayCheck();
            window.removeEventListener( 'load', jDOMReadyEvt, false );
        }, false );

        //撥放器(頁)關閉紐 //卷軸關閉控制器 video_in_js.js L: 69
        //關閉 會被 疊加執行 console.trace();
        i.play = function( Cho ){
            if( typeof Cho === 'boolean' ) jBcvPlyMain.play( Cho );
        };

        //響應式關閉控制器
        //調動撥放器視窗
        jz.actFilter.set( 'mixtureOutBcvPly_plyWindow', function( strModel ){
            jBcvPlyMain.removeClass( 'esFloatPlyWindow', 'esMobilePlyWindow', 'esScreenPlyWindow' );
            switch( strModel ){
                case 'float':
                    jBcvPlyMain.addClass('esFloatPlyWindow');
                    break;
                case 'mobile':
                    jBcvPlyMain.addClass('esMobilePlyWindow');
                    break;
                case 'screen':
                    jBcvPlyMain.addClass('esScreenplywindow');
                    break;
            }
        } );

        i.plyWindow = function( strModel ){
            jz.actFilter.wait( 'mixtureOutBcvPly_plyWindow', 300, [ strModel ] );
        };

        i.plyWindow('screen');

        i.plyCurrentInfo = function(){
            var videoInfo = jBcvPlyMain.videoInfo,
                strItemID = videoInfo.id[2] || String( gon.item_id ),
                numTimeCurrent;

            if( jBcvPlyMain.isLive() ){
                numTimeCurrent = 0;
            }else if( videoInfo.id[1] !== strItemID ){
                numTimeCurrent = 0;
            }else{
                numTimeCurrent = jBcvPlyMain.timeCurrent();
                numTimeCurrent = ( typeof numTimeCurrent === 'number' )? parseInt( numTimeCurrent * 1000 ) : 0;
            }

            return {
                id: strItemID,
                timeCurrent: numTimeCurrent,
            };
        };

        i.setNumWatching  = function( numWatching ){
            if( typeof numWatching !== 'number' ) numWatching = 0;
            jBcvPlyMain.elemList.tileOverlay.watching_num.querySelector('span').innerText = numWatching;
        };
    };

