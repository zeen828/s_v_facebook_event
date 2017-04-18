/*! createPlyerTimeLine - RAiww. MIT @license: ra.iww.twbbs.org/ffish/MIT_License. */
/* 撥放器時間軸 v2.3.1 */

"use strict";

    function createPlyerTimeLine( jArguList ){
        var i = this;

        [   [ 'isVideoReady', true ],
            [ 'isLive', false ],
            [ 'isLivePlayback', false ],
            [ 'isCumulativeBuffer', false ],
            [ 'lazyPlayTime', 300 ],
        ].map(function( jItem ){
            var jName = jItem[0],
                jVal = jItem[1],
                jType = typeof jVal;

            i[ '_hide_' + jName ] = jVal;
            i.checkArgu_correctType( i, '_hide_' + jName, jType, jArguList[ jName ] );
        });

        i._hide_bufferPercentList = {
            already: 0,
            timeCurrent: 0,
        };


        [ 'buffer', 'timeLine', 'play' ].map(function( jItem ){
            i[ '_hide_' + jItem + 'ID' ] = [ null ];
        });


        var jArguNameList = [
                'HElemMain',
                'play', 'isPaused', 'setCurrentPlayShow',
                'vodBuffer',
                'vodDuration', 'vodCurrent',
            ];

        if( i._hide_isLivePlayback )
            jArguNameList.push( 'liveDuration', 'liveCurrent' );

        i.checkInitArgu( jArguList, jArguNameList, '錯誤使用。' );
        i.checkInitArgu( {
            HElem_floatShow: i.HElemMain.querySelector('.TxPlyerTimeLine_floatShow'),
            HElem_buffer: i.HElemMain.querySelector('.TxPlyerTimeLine_buffer'),
            HElem_play: i.HElemMain.querySelector('.TxPlyerTimeLine_play'),
        }, [ 'HElem_floatShow', 'HElem_buffer', 'HElem_play', ], '錯誤使用。' );


        i.duration = i.vodDuration;
        i.current = i.vodCurrent;

        //附帶清單
        i._hide_supmntList = {
            currentTime: null,
            isPaused: false,
            isHover: false,
            isDrag: false,
            setInfState: i.setInfState,
        };
        i._hide_supmntOperateList = {
            currentTime: null,
            recordTime: null,
            isPaused: false,
        };

        i._hide_evtBineFunc = i.getEvtBineFunc();
        i.evtBind('add');

        i.initState();
    }

    createPlyerTimeLine.extend({

//>> 設定參數 -----

        setIsVideoReady: function( ChoA ){
            var i = this,
                jTemValue = i._hide_isVideoReady,
                isVideoReady = i.checkArgu_correctType( this, '_hide_isVideoReady', 'boolean', ChoA );

            if( isVideoReady !== jTemValue ){
                if( isVideoReady ) i.removeClass('esNoReady');
                else i.addClass('esNoReady');
            }

            return isVideoReady;
        },
        set isVideoReady( ChoA ){ this.setIsVideoReady( ChoA ); },
        get isVideoReady(){ return this._hide_isVideoReady; },
        setIsLive: function( ChoA ){
            var i = this,
                jTemValue = i._hide_isLive,
                isLive = i.checkArgu_correctType( i, '_hide_isLive', 'boolean', ChoA );

            if( isLive !== jTemValue )
                i.setVideoType( isLive );

            return isLive;
        },
        set isLive( ChoA ){ this.setIsLive( ChoA ); },
        get isLive(){ return this._hide_isLive; },


//>> 執行函數 -----

        //改變撥放條顯示
        initState: function(){
            var i = this,
                isLive = i._hide_isLive;

            if( i._hide_isVideoReady ) i.removeClass('esNoReady');
            else i.addClass('esNoReady');

            i.setVideoType( isLive );
        },
        streamBufferChange: function(){
            var i = this;
            if( !i._hide_isVideoReady || i._hide_isLive ) return;

            i.setBufferShow_vod();
        },
        timeChange: function(){
            this.actFuncSOP(function( i ){
                var jInf = i.getStandardInf();
                i.setInfState( jInf, null, 'timeUpdate', null );
                return jInf;
            });
        },
        //改變播放時間
        timeCurrent: function(){
            var i = this,
                objArgu = i.getOperateArguAnalysis( arguments );

            if( !objArgu ) return;

            if( objArgu.state ){
                i.operateTimeCurrent( objArgu );
            }else{
                i.current( objArgu.time );
                i.timeChange();
            }
        },
        operateTimeCurrent: function( objArgu ){
            this.actFuncSOP(function( i ){
                var objSupmntList = i._hide_supmntOperateList,
                    objInfo = i.getStandardInf( objArgu.time ),
                    strState = objArgu.state;

                i.setInfState( objInfo, strState, 'operate', strState );

                switch( strState ){
                    case 'start':
                        objSupmntList.isPaused = i.isPaused();
                        objSupmntList.currentTime
                            = objSupmntList.recordTime
                            = i.current();

                        if( !objSupmntList.isPaused ) i.play( false );
                        i.addClass('esOperate');
                        break;
                    case 'move':
                        objSupmntList.recordTime = objArgu.time;
                        i.playActFilter( objInfo );
                        break;
                    case 'end':
                        i.removeClass('esOperate');
                        objSupmntList.recordTime = null;
                        if( !objSupmntList.isPaused ) i.play( true );

                        i.playActFilter( objInfo, 0 );
                        break;
                }

                return objInfo;
            });
        },
        //拖拉事件
        evtBind: function( jMethod ){
            if( jMethod !== 'add' && jMethod !== 'remove' ) return;

            var i = this;
            jz.wCode.evtBind( i.HElemMain, jMethod, {
                mouseenter: i._hide_evtBineFunc,
                mousedown: i._hide_evtBineFunc,
                mouseleave: i._hide_evtBineFunc,
            } );
        },
        evtActFunc: function( evt, jSupmntList ){
            this.actFuncSOP(function( i ){
                var jInf = i.getEvtStandardInf( evt ),
                    jState;

                switch( evt.type ){
                    case 'mouseenter':
                        jState = jSupmntList.isDrag ? 'move' : 'start';
                        jSupmntList.setInfState( jInf, jState, 'hover', 'start' );
                        jSupmntList.isHover = true;

                        if( !jSupmntList.isDrag ) i.addClass('esFloat');
                        break;
                    case 'mousedown':
                        jSupmntList.setInfState( jInf, 'move', 'drag', 'start' );
                        jSupmntList.isPaused = i.isPaused();
                        jSupmntList.currentTime = i.current();
                        jSupmntList.isDrag = true;

                        if( !jSupmntList.isPaused ) i.play( false );
                        i.removeClass('esFloat');
                        i.addClass('esDrag');
                        break;
                    case 'mousemove':
                        if( jSupmntList.trace === 'hover' ){
                            if( jSupmntList.isDrag ) return;
                            jSupmntList.setInfState( jInf, 'move', 'hover', 'move' );
                        }else{
                            jSupmntList.setInfState( jInf, 'move', 'drag', 'move' );
                            i.playActFilter( jInf );
                        }
                        break;
                    case 'mouseup':
                        jState = jSupmntList.isHover ? 'move' : 'end';
                        jSupmntList.setInfState( jInf, jState, 'drag', 'end' );
                        jSupmntList.isDrag = false;

                        i.removeClass('esDrag');
                        if( jSupmntList.isHover ) i.addClass('esFloat');
                        if( !jSupmntList.isPaused ) i.play( true );

                        i.playActFilter( jInf, 0 );
                        break;
                    case 'mouseleave':
                        jState = jSupmntList.isDrag ? 'move' : 'end';
                        jSupmntList.setInfState( jInf, jState, 'hover', 'end' );
                        jSupmntList.isHover = false;

                        if( !jSupmntList.isDrag ) i.removeClass('esFloat');
                        break;
                }

                return jInf;
            });
        },


//>> 功能性函數 -----

        checkInitArgu: function( jArguList, jArguNameList, errMes ){
            var p = 0, jName, jItem;
            while( jName = jArguNameList[ p++ ] ){
                if( jItem = jArguList[ jName ] ) this[ jName ] = jItem;
                else if( errMes ) throw Error( errMes );
            }
        },
        checkArgu_correctType: function( jMain, jProp, jType, ChoA ){
            jType = typeof ChoA === jType;

            if( jType ) jMain[ jProp ] = ChoA;
            else ChoA = jMain[ jProp ];

            return ChoA;
        },
        addClass: function(){
            var jMain = this.HElemMain.classList;
            jMain.add.apply( jMain, arguments );
        },
        removeClass: function(){
            var jMain = this.HElemMain.classList;
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


//>> -----

        //取得綁定物件函數清單
        getEvtBineFunc: function(){
            var i = this,
                jSupmntList = i._hide_supmntList,
                jEvtTrigger = i.evtTrigger,
                jEvtActList = {
                    main: function( evt ){
                        jEvtTrigger.call( this, evt, jEvtActList );
                        jSupmntList.trace = 'main';
                        i.evtActFunc( evt, jSupmntList );
                    },
                    hover: function( evt ){
                        jSupmntList.trace = 'hover';
                        i.evtActFunc( evt, jSupmntList );
                    },
                    move: function( evt ){
                        jSupmntList.trace = 'move';
                        i.evtActFunc( evt, jSupmntList );
                    },
                };

            return jEvtActList.main;
        },
        evtTrigger: function( evt, jEvtActList ){
            switch( evt.type ){
                case 'mouseenter':
                    jz.wCode.evtBind( this, 'add', {
                        mousemove: jEvtActList.hover,
                    } );
                    break;
                case 'mousedown':
                    jz.wCode.evtBind( document, 'add', {
                        selectstart: jz.wCode.evtStopDefault,
                        mousemove: jEvtActList.move,
                        mouseup: jEvtActList.main,
                    } );
                    break;
                case 'mouseup':
                    jz.wCode.evtBind( document, 'remove', {
                        selectstart: jz.wCode.evtStopDefault,
                        mousemove: jEvtActList.move,
                        mouseup: jEvtActList.main,
                    } );
                    break;
                case 'mouseleave':
                    jz.wCode.evtBind( this, 'remove', {
                        mousemove: jEvtActList.hover,
                    } );
                    break;
            }
        },
        //執行函數操作流程
        actFuncSOP: function( FuncSetInf ){
            var i = this;

            if( !i._hide_isVideoReady ) return;
            if( i._hide_isLive && !i._hide_isLivePlayback ) return;

            var objInfo = FuncSetInf( i );
            if( objInfo ) i.setTimeLineShow( objInfo );
        },
        regexStateName: /^(start|move|end)$/,
        regexModeName: /^(current|relative|percent)$/,
        getOperateArguAnalysis: function( objArgu ){
            var i = this,
                objSupmntList = i._hide_supmntOperateList,
                objInfo = {
                    time: undefined,
                    state: undefined,
                },
                strMode, numTime, strState;

            function funcSetVal( numStart ){
                numTime = objArgu[ numStart ];
                strState = objArgu[ numStart + 1 ];
            }

            switch( typeof objArgu[0] ){
                case 'number':
                    strMode = 'current';
                    funcSetVal(0);
                    break;
                case 'string':
                    strMode = objArgu[0];
                    funcSetVal(1);
                    break;
                default:
                    return null;
            }

            if( i.regexModeName.test( strMode ) && typeof numTime === 'number' )
                objInfo.time = i.conversionTime( strMode, numTime, objSupmntList.recordTime );

            if( typeof strState === 'string' && i.regexStateName.test( strState ) ){
                objInfo.state = strState;
            }

            return objInfo;
        },
        //取得參數
        getStandardInf: function( jCurrent ){
            var i = this,
                isLive = i._hide_isLive,
                jInf = {
                    isLive: isLive,
                    HElemMain: i.HElemMain,
                    HElem_floatShow: i.HElem_floatShow,
                    HElem_buffer: i.HElem_buffer,
                    HElem_play: i.HElem_play,
                };

            jCurrent = ( typeof jCurrent === 'number' )? i.checkTimeRange( jCurrent ) : i.current();
            jInf.time = parseFloat( jCurrent.toFixed(2) );

            if( isLive ){
                jInf.timeFromEnd = parseFloat( ( i.duration('end') - jInf.time ).toFixed(2) );
                if( jInf.timeFromEnd < 0 ) jInf.timeFromEnd = 0;
                jInf.timeArr = i.getTimeString( jInf.timeFromEnd );
                jInf.placePercent = i.getPlacePercent_live( jInf.time );
            }else{
                jInf.timeArr = i.getTimeString( jInf.time );
                jInf.placePercent = i.getPlacePercent_vod( jInf.time );
            }

            jInf.timeStr = jInf.timeArr.join(':');

            return jInf;
        },
        checkTimeRange: function( jCurrent ){
            var i = this,
                isLive = i._hide_isLive,
                jTimeStart = ( isLive ? i.duration('start') : 0 ),
                jTimeEnd = i.duration( isLive ? 'end' : undefined );

            if( jCurrent < jTimeStart ) jCurrent = jTimeStart;
            else if( jCurrent > jTimeEnd ) jCurrent = jTimeEnd;

            return jCurrent;
        },
        getEvtStandardInf: function( evt ){
            var i = this,
                isLive = i._hide_isLive,
                jPlacePercent = jz.prop.mouseOverPlacePercent( 'horizontal', evt, i.HElemMain ),
                jCurrentTime = i.duration() * jPlacePercent + ( isLive ? i.duration('start') : 0 ),
                jInf = i.getStandardInf( jCurrentTime );

            return jInf;
        },
        setInfState: function( jInf, jState, jType, jTypeState ){
            jInf.state = jState || undefined;
            jInf.type = jType || undefined;
            jInf.typeState = jTypeState || undefined;
        },
        //設定影片類型
        setVideoType: function( isLive ){
            var i = this;

            i._hide_bufferPercentList.timeCurrent
                = i._hide_supmntList.currentTime
                = 0;

            i.HElem_buffer.style.width
                = i.HElem_play.style.width
                = null;

            if( isLive ){
                i.addClass('esLive');

                if( i._hide_isLivePlayback ){
                    i.duration = i.liveDuration;
                    i.current = i.liveCurrent;
                }else{
                    i.duration = i.current = null;
                }
            }else{
                i.removeClass('esLive');
                i.duration = i.vodDuration;
                i.current = i.vodCurrent;
            }
        },
        //設定顯示畫面
        setBufferShow_vod: function(){
            var i = this;
            i.animFPS( 'buffer', function(){
                if( !i._hide_isVideoReady ) return;

                var isCumulativeBuffer = i._hide_isCumulativeBuffer,
                    jBufferPercentList = i._hide_bufferPercentList,
                    jBufferTime = i.vodBuffer() * 100 || 0,
                    isShowChange = false,
                    NumPercent = jBufferPercentList.timeCurrent + jBufferTime;

                if( NumPercent > 100 ) NumPercent = 100;

                if( isCumulativeBuffer ){
                    if( NumPercent > jBufferPercentList.already ){
                        isShowChange = true;
                        jBufferPercentList.already = NumPercent;
                    }
                }else{
                    isShowChange = true;
                }

                if( isShowChange )
                    i.HElem_buffer.style.width = NumPercent + '%';
            } );
        },
        setTimeLineShow: function( jInf ){
            var i = this,
                jTypeState = jInf.typeState;
            if( jTypeState === 'start' || jTypeState === 'end' ){
                i.setTimeLineShow_conductor( jInf );
                i.animFPS( 'timeLine', 'stop' );
            }else
                i.animFPS( 'timeLine', function(){
                    i.setTimeLineShow_conductor( jInf );
                } );
        },
        setTimeLineShow_conductor: function( jInf ){
            var i = this;
            if( !i._hide_isVideoReady ) return;

            switch( jInf.type ){
                case 'hover':
                    i.setTimeLineShow_hover( jInf );
                    break;
                case 'drag':
                    i.setTimeLineShow_hover( jInf );
                    i.setTimeLineShow_timeUpdate( jInf );
                    break;
                case 'operate':
                    i.setTimeLineShow_hover( jInf );
                    i.setTimeLineShow_timeUpdate( jInf );
                    break;
                case 'timeUpdate':
                    i._hide_bufferPercentList.timeCurrent = jInf.placePercent;
                    i.setTimeLineShow_timeUpdate( jInf );
                    break;
            }

            i.setCurrentPlayShow( jInf );
        },
        setTimeLineShow_hover: function( jInf ){
            var HElem_floatShow = jInf.HElem_floatShow;
            HElem_floatShow.innerText = jInf.timeStr;
            HElem_floatShow.style.left = jInf.placePercent + '%';
        },
        setTimeLineShow_timeUpdate: function( jInf ){
            var HElem_play = jInf.HElem_play;
            HElem_play.setAttribute( 'data-playtime', jInf.timeStr );
            HElem_play.style.width = jInf.placePercent + '%';
        },
        //撥放過濾器
        playActFilter: function( jInf, jTimeMS ){
            var i = this,
                isOperateType = jInf.type === 'operate',
                objSupmntList = isOperateType ? i._hide_supmntOperateList : i._hide_supmntList,
                numCurrentTime = objSupmntList.currentTime;

            i.actFilter( 'play', function(){
                objSupmntList.currentTime = null;
                if( jInf.time === numCurrentTime ) return;

                i._hide_bufferPercentList.timeCurrent = jInf.placePercent;
                i.current( jInf.time );

            }, ( jTimeMS || i._hide_lazyPlayTime ) );
        },
        //取得當前撥放時間百分比
        getPlacePercent: function( jDividend, jDivisor ){
            var Ans;

            if( jDividend === 0 || jDivisor === 0 ) Ans = 0;
            else{
                Ans = jDividend / jDivisor * 100;
                Ans = ( Ans < 100 )? parseFloat( Ans.toFixed(2) ) : 100;
            }

            return Ans;
        },
        getPlacePercent_vod: function( jCurrent ){
            var i = this;
            jCurrent = ( typeof jCurrent === 'number' )? jCurrent : i.current();
            return i.getPlacePercent( jCurrent, i.duration() );
        },
        getPlacePercent_live: function( jCurrent ){
            var i = this;
            jCurrent = ( typeof jCurrent === 'number' )? jCurrent : i.current();
            jCurrent = jCurrent - i.duration('start');
            return i.getPlacePercent( jCurrent, i.duration() );
        },
        //換算時間
        conversionTime: function( strMode, numVal, numVal_current ){
            var i = this,
                numTimeStart,
                numCurrent;

            if( i.regexModeName.test( strMode ) && typeof numTime === 'number' ) return i.current();

            switch( strMode ){
                case 'current':
                    numCurrent = numVal;
                    break;
                case 'relative':
                    numVal_current = numVal_current || i.current();
                    numCurrent = i.checkTimeRange( numVal_current + numVal );
                    break;
                case 'percent':
                    numTimeStart = ( i._hide_isLive ? i.duration('start') : 0 );
                    numCurrent = i.checkTimeRange( i.duration() * numVal / 100 + numTimeStart );
                    break;
            }

            return numCurrent;
        },
        //取得時間以秒數換算的時分秒進位
        getTimeString: function( jCurrent ){
            var i = this,
                Ans = [],
                jDuration = i.duration();
            jCurrent = ( typeof jCurrent === 'number' )? jCurrent : jDuration;

            Ans = i.getTimeString_carry( Math.round( jCurrent ) );
            if( jDuration >= 3600 )
                Array.prototype.unshift.apply( Ans, i.getTimeString_carry( Ans.shift() ) );

            return Ans;
        },
        getTimeString_carry: function( NumA ){
            var nRemainder = NumA % 60,
                nCarry = ( NumA - nRemainder ) / 60;

            return [
                this.getTimeString_twoNum( nCarry ),
                this.getTimeString_twoNum( nRemainder )
            ];
        },
        getTimeString_twoNum: function( NumA ){
            return (( NumA < 10 )? '0' : '' ) + NumA;
        },

    });


