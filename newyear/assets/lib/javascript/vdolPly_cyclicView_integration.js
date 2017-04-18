void function () {
    var helHead = document.head;
    var sendReqNum = 0;
    var sendReq = {};

    function getScriptSrc( strUrl ) {
        var xhr;

        sendReqNum++;
        sendReq[ strUrl ] = null;

        xhr = new XMLHttpRequest();
        xhr.open( "GET", strUrl, true );
        xhr.onload = function( evt ) {
            sendReq[ strUrl ] = xhr.response;
            if( !--sendReqNum ) finishAction();
        }
        xhr.send();
    }

    function getScript( strCode ) {
        var helScript = document.createElement( 'script' );
        helScript.innerHTML = strCode;
        helHead.appendChild( helScript );
    }

    function finishAction() {
        var key;
        for ( key in sendReq ) getScript( sendReq[ key ] );
        onReady_forVdolPly_cyclicView();
    }

    getScriptSrc( '../lib/javascript/vdolPly_plugin.js' );
    getScriptSrc( '../lib/javascript/jzHel_t.js' );
    getScriptSrc( '../lib/javascript/vdolPly_cyclicView.js' );
}();
