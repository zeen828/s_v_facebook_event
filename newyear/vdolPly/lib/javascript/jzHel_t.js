/*! jzHem - BwayCer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0 */
/* 超文本標記語言元素管理器 HTML Element Manager */
//!! 以更新 請覆蓋回原始檔案

"use strict";

/*
   假設
    <div id="LxPostForm">
        <form action="demo_post_enctype.asp" method="post" enctype="multipart/form-data">
            First name: <input type="text" name="fname"><br>
            Last name: <input type="text" name="lname"><br>
            <input type="submit" value="Submit">
        </form>
        <div data-jz="jz"></div>
    </div>

    var markHel = {};
    hem.tag( markHel, function ( t ) {
        t( 'div', { id: 'LxPostForm' },
            t( 'form*postForm', { action: '/postPage', method: 'post', enctype: 'multipart/form-data', _oneCreate: function () {
                    this.id = 'tagID';
                } },
                t.NodeList(
                    'First name',
                    t( 'input', { type: 'text', name: 'fname' } ),
                    t.easyTag( 'br' )
                ),
                t.NodeList(
                    'Last name',
                    t( 'input', { type: 'text', name: 'lname' } ),
                    t.easyTag( 'br' )
                )
            ),
            t( 'div*tty', function () {
                this.className = 'classNamee';
            } ),
            t( 'div*tty', { 'data-jz': 'jz' } )
        );
    } );
 */

function define( fnExport ) {
    window.hem = fnExport();
}

define( function () {
    var _emptyEnum = Object.emptyEnum;
    var _transClone = Array.transClone;
    var _qSplice = Array.prototype.qSplice;


    function hem( strViewName, fnOperate ) {}


    hem.tag = function tag( objMarkHel, fnOperate ) {
        fnOperate( _tag.bind( objMarkHel ) );
        return objMarkHel.main;
    };

    function _tag( objMarkHel ) {
        objMarkHel.main = objMarkHel.main || null;
        this.markHel = objMarkHel;
    }

    _tag.bind = function bind( objMarkHel ) {
        var key;
        var objHangFunc = this.hangFunc;
        var insTag = new this( objMarkHel );
        var fnT = insTag.t.bind( insTag );
        for ( key in objHangFunc ) fnT[ key ] = objHangFunc[ key ];
        return fnT;
    };

    _tag.hangFunc = {
        easyTag: function easyTag( strTagName ) {
            return document.createElement( strTagName );
        },
        NodeList: function NodeList() {
            var objNodeList = _tag.prototype.nodeList( _transClone( arguments ) );
            this( 'setMarkHelMain', objNodeList );
            return objNodeList;
        },
    };

    _tag.prototype.t = function t( strDescription ) {
        var anyAns;
        var idxMark, isHasMark, tagName, markName;
        var postArgs, arg1, idxArgs, typeOfArg1;

        if( strDescription === 'setMarkHelMain' ) {
            anyAns = arguments[ 1 ];
            this.markHel.main = anyAns;
            return anyAns;
        }

        idxMark = strDescription.indexOf( '*' );
        isHasMark = idxMark !== -1;
        tagName = isHasMark ? strDescription.substring( 0, idxMark ) : strDescription;
        markName = ( isHasMark && idxMark + 1 < strDescription.length )
            ? strDescription.substring( idxMark + 1 ) : null;

        arg1 = arguments[ 1 ];
        idxArgs = 2;
        typeOfArg1 = ( arg1 == null ) ? null : typeof arg1;

        anyAns = document.createElement( tagName );
        if ( markName ) this.markHel[ markName ] = anyAns;

        if ( typeOfArg1 === 'function' ) arg1.call( anyAns );
        else if ( typeOfArg1 === 'object' ) this.setAttr( anyAns, arg1 );
        else if ( typeOfArg1 != null ) idxArgs--;

        postArgs = _qSplice.call( arguments, idxArgs );
        this.appendChild( anyAns, postArgs );

        this.markHel.main = anyAns;
        return anyAns;
    };

     _tag.prototype.setAttr = function setAttr( helMain, objAttr ) {
        var key, val;
        var key_ofData;
        for ( key in objAttr ) {
            val = objAttr[ key ];

            if ( val == null ) continue;
            switch ( key ) {
                case 'id': helMain.id = val; break;
                case 'className': helMain.className = val; break;
                case 'dataset':
                    for ( key_ofData in val ) helMain.dataset[ key_ofData ] = val[ key_ofData ];
                    break;
                case 'onCreate':
                    objAttr._oneCreate.call( helMain );
                    break;
                default:
                    helMain.setAttribute( key, val );
            }
        }
    };

    _tag.prototype.appendChild = function appendChild( helMain, arrChildNodes ) {
        var p, len, item, childNode;
        var idx = 0;
        var lenOfChildNodes = arrChildNodes.length;

        while ( idx < lenOfChildNodes ) {
            childNode = arrChildNodes[ idx++ ];
            if ( childNode == null ) continue;
            else if ( typeof childNode === 'string' )
                helMain.appendChild( document.createTextNode( childNode ) );
            else if ( childNode instanceof Element ) helMain.appendChild( childNode );
            else if ( childNode.constructor === NodeList )
                while ( item = childNode[ 0 ] ) helMain.appendChild( item );
            else throw Error();
        }
    };

    _tag.prototype.nodeList = function nodeList( arrArgs ) {
        var helContainer = document.createElement( 'div' );
        this.appendChild( helContainer, arrArgs );
        return helContainer.childNodes;
    };

    return hem;
} );

