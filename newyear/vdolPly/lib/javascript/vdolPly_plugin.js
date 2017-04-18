"use strict";

Object.emptyEnum = function emptyEnum( objArgu ) {
    var key;
    for ( key in objArgu ) this[ key ] = objArgu[ key ];
};
Object.emptyEnum.prototype = Object.create( null );

Array.transClone = function transClone( anyArguOfArray ) {
    var p;
    var len = anyArguOfArray.length;
    var newList = new Array( len );
    for ( p = 0; p < len ; p++ ) newList[ p ] = anyArguOfArray[ p ];
    return newList;
};

Array.prototype.qSplice = function qSplice( numStart, numNum ) {
    var p, newStart, newEnd, newLen, newList;
    var len = this.length;
    var isAllowTypeArgu1 = ( typeof numStart === 'number' && 0 <= numStart && numStart < len );
    var isAllowTypeArgu2 = ( typeof numNum === 'number' && 0 <= numNum );

    if ( isAllowTypeArgu1 && isAllowTypeArgu2 && numStart + numNum <= len ) {
        newStart = numStart;
        newEnd = numStart + numNum;
        newLen = numNum;
    } else if ( isAllowTypeArgu1 ) {
        newStart = numStart;
        newEnd = len;
        newLen = newEnd - newStart;
    } else return new Array( 0 );

    newList = new Array( newLen );
    for ( p = 0; newStart < newEnd ; p++, newStart++ ) newList[ p ] = this[ newStart ];
    return newList;
};

Function.prototype.extend = function extend( jPropList ){
    for( let jMethod in jPropList )
        this.prototype[ jMethod ] = jPropList[ jMethod ];
};

window.jz = {
};

