"use strict";

var srcBcvAID_ofLab = '4652941472001';
var srcBcvPID_ofLab = 'HJEJWkezl'
var srcBcvPlyUrl_ofCyclicView = '//players.brightcove.net/' + srcBcvAID_ofLab + '/' + srcBcvPID_ofLab + '_default/index.min.js'


function getVdolPly_cyclicView( helParent, postArgu ) {
    var markHel = {};
    var helScript_toReqBcv;
    hem.tag( markHel, function ( t ) {
        helScript_toReqBcv = t( 'script', { src: srcBcvPlyUrl_ofCyclicView } ),
        t( 'video', {
                id: postArgu.id,
                className: 'video-js ' + ( !!postArgu.className ? postArgu.className : '' ),
                width: '100%',
                height: '100%',
                controls: 'true',
                dataset: {
                    player: srcBcvPID_ofLab,
                    embed: 'default',
                    applicationId: ''
                },
            },
            t( 'source', { src: postArgu.srcUrl, type: 'application/x-mpegURL' } )
        );
    } );

    helParent.parentNode.insertBefore( markHel.main, helParent );
    document.head.appendChild( helScript_toReqBcv );
}

