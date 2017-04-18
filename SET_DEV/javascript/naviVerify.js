"use strict";

!function( Func ){
    if( typeof global === 'object' ) module.exports = Func;
    else if( typeof window === 'object' ) window.naviVerify = Func;
}(
    function naviVerify( jUserAgent ){
        if( typeof jUserAgent !== 'string' ) return;

        var jNavigator = {
                mozilla: 0,
                os: null,
                device: null,
                isMobile: null,
                browser: null
            },
            jUserAgent_forIE,
            jUserAgent_browser;

        function jIndexOf( txt, jKey ){
            return txt.indexOf( jKey ) !== -1;
        }

        function jComparison( jObject, txt, ObjComparison ){
            for(var jTitle in ObjComparison )
                if( jIndexOf( txt, jTitle ) ){
                    jNavigator[ jObject ] = ObjComparison[ jTitle ];
                    break;
                }
        }

        jUserAgent.replace( /Mozilla\/(\d+)(?:\.\d+)* \((.+?)\)(?: (.+))?/, function(){
            jNavigator.mozilla = parseInt( arguments[1] );

            // 系統判斷
            jComparison( 'os', arguments[2], {
                'Windows': 'Windows',
                'Android': 'Android',
                'Linux': 'Linux',
                'Mac': 'Apple'
            } );

            // 裝置判斷
            if( jNavigator.os === 'Android' ){
                var jMatch = arguments[2].match(/Android (\d+)(?:\.\d+)*; (\S+)/);
                jNavigator.device = jMatch ? 'Android ' + jMatch[1] + ' - ' + jMatch[2] : null;
            }else
                jComparison( 'device', arguments[2], {
                    'Windows NT 10': 'Windows 10',
                    'Windows NT 6.2': 'Windows 8',
                    'Windows NT 6.1': 'Windows 7',
                    'Macintosh': 'Macintosh',
                    'iPad': 'iPad',
                    'iPhone': 'iPhone'
                } );

            jUserAgent_forIE = arguments[2] || '';
            jUserAgent_browser = arguments[ 3 ] || '';
        } );

        if( !jNavigator.mozilla ) return jNavigator;

        // 行動裝置判斷
        jNavigator.isMobile = /Mobile/i.test( jUserAgent );

        // 瀏覽器判斷
        jComparison( 'browser', jUserAgent_forIE, {
            'rv:11': 'IE 11',
            'MSIE 10': 'IE 10',
            'MSIE 9': 'IE 9',
            'MSIE 8': 'IE 8'
        } );
        if( jNavigator.browser ) return jNavigator;

        var ArrMatch_name = [],
            ArrMatch_version = [];
        jUserAgent_browser.replace( /(\w+)\/(\d+)(?:\.\d+)*/g, function(){
            if( /(AppleWebKit|Gecko|Mobile)/.test( arguments[1] ) ) return;

            ArrMatch_name.push( arguments[1] );
            ArrMatch_version.push( parseInt( arguments[2] ) );
        } );

        //>> 嚴格
        if( ArrMatch_name.length === 2 && jIndexOf( ArrMatch_name, 'Safari' ) ){
            if( jIndexOf( ArrMatch_name, 'Chrome' ) )
                jNavigator.browser = 'Chrome';
            else if( jIndexOf( ArrMatch_name, 'Version' ) )
                jNavigator.browser = 'Safari';
        }else if( /(iPad|iPhone)/.test( jNavigator.device ) && jIndexOf( ArrMatch_name, 'CriOS' ) ){
            jNavigator.browser = 'Chrome';
        }
        //>> 寬鬆
        if( !jNavigator.browser )
            jComparison( 'browser', jUserAgent_browser, {
                'OPR': 'Oepra',
                'Edge': 'Edge',
                'Firefox': 'Firefox',
                'FBAV': 'Facebook'
            } );
        //>> 相似
        if( !jNavigator.browser ){
            if( ArrMatch_version[ ArrMatch_name.indexOf('Safari') ] > 599 )
                jNavigator.browser = 'Safari';
            else if( ArrMatch_version[ ArrMatch_name.indexOf('Safari') ] > 39 )
                jNavigator.browser = 'Chrome';
        }

        return jNavigator;
    }
);
