var sunScrollArry = {
  $block            : '',
  $wrap             : '',
  $wrapMove         : '',
  $scrollBar        : '',
  $scrollBarMove    : '',
  _delayTime        : '',
  _toBottom         : false,
  _toBottomSwitch   : false,
  _touchStartY      : 0,
  _touchMoveY       : 0,
  _moveDistance     : 0,
  _endDistance      : 0,
  _endBarDistance   : 0,
  _wrapHeight       : 0,
  _wrapMoveHeight   : 0,
  _wrapMoveTop      : 0,
  _wheelSwitch      : false,
  _scrollBarStatus  : {
    permanent   : false,
    speed       : 300,
    fadein      : 300,
    fadeout     : 300,
  },
}

function sunScroll( sunScrollAPI ){
  sunScrollArry.$block = $(sunScrollAPI.$block);
  for( z=0 ; z<Object.keys(sunScrollAPI).length ; z++ ){
    if( Object.keys(sunScrollAPI)[z] == 'scrollBar' ){
      var barKeyLength = Object.keys(sunScrollAPI.scrollBar).length;
      for( i=0 ; i<barKeyLength ; i++ ){
        sunScrollArry._scrollBarStatus[Object.keys(sunScrollAPI.scrollBar)[i]] = sunScrollAPI.scrollBar[Object.keys(sunScrollAPI.scrollBar)[i]];
      }
    }
    if( Object.keys(sunScrollAPI)[z] == 'toBottom' ){
      sunScrollArry._toBottom = sunScrollAPI.toBottom;
    }
  }

  initial();

  $(window).resize(function(e){
    reSet(e);
  });
}

function initial(){
	console.log(sunScrollArry.$block);
  sunScrollArry.$block.find('>').wrapAll('<div class="sunScroll-wrap"><div class="sunScroll-move"></div></div>');
  sunScrollArry.$wrap           = sunScrollArry.$block.find('>.sunScroll-wrap');
  sunScrollArry.$wrapMove       = sunScrollArry.$wrap.find('>.sunScroll-move');
  sunScrollArry.$wrap.append('<div class="scrollBar"><div class="scrollBar-move"><div class="style"></div></div></div>');
  sunScrollArry.$scrollBar      = sunScrollArry.$wrap.find('>.scrollBar');
  sunScrollArry.$scrollBarMove  = sunScrollArry.$scrollBar.find('>.scrollBar-move');

  if( sunScrollArry._scrollBarStatus.permanent ){
    sunScrollArry.$scrollBar.show();
  }

  toBottom();
  reSet();
}

function retest(e){
  toBottom(e);
  reSet(e);
}

function reSet(e){
  sunScrollArry._wrapHeight     = sunScrollArry.$wrap.height();
  sunScrollArry._wrapMoveHeight = sunScrollArry.$wrapMove.height();
  sunScrollArry._wrapMoveTop    = sunScrollArry.$wrapMove.offset().top;
  if(sunScrollArry._wrapHeight<sunScrollArry._wrapMoveHeight){
    sunScrollArry.$scrollBarMove.css('height',((sunScrollArry._wrapHeight / sunScrollArry._wrapMoveHeight)*100)+'%');
    action();
    compute(e);
  }else{
    sunScrollArry.$wrap.off();
    sunScrollArry.$scrollBar.hide();
    sunScrollArry.$wrapMove.css('top', 0);
  }
}

function toBottom(e){
  if( sunScrollArry._toBottom ){
    sunScrollArry._wrapHeight     = sunScrollArry.$wrap.height();
    sunScrollArry._wrapMoveHeight = sunScrollArry.$wrapMove.height();
    sunScrollArry._wrapMoveTop    = sunScrollArry.$wrapMove.offset().top;
    sunScrollArry._endDistance    = -(sunScrollArry._wrapMoveHeight - sunScrollArry._wrapHeight);
  }
}

function action(){
  sunScrollArry.$wrap.off();
  sunScrollArry.$wrap.on({
    mouseover : function(e) {
      sunScrollArry._wrapMoveTop     = sunScrollArry.$wrapMove.offset().top;
      sunScrollArry._endDistance     = sunScrollArry._wrapMoveTop;
      if( !sunScrollArry._scrollBarStatus.permanent ){
        clearTimeout(sunScrollArry._delayTime);
        sunScrollArry.$scrollBar.fadeIn(sunScrollArry._scrollBarStatus.fadein);
      }
    },

    mousewheel : function(e){
      sunScrollArry._wrapMoveTop   = sunScrollArry.$wrapMove.offset().top;
      sunScrollArry._moveDistance  = -(e.originalEvent.wheelDelta);

      compute(e);
      e.preventDefault();
    },

    mouseout : function(e) {
      if( !sunScrollArry._scrollBarStatus.permanent ){
        sunScrollArry._delayTime = setTimeout(function(){
          sunScrollArry.$scrollBar.stop(false,true).fadeOut(sunScrollArry._scrollBarStatus.fadeout);
        },sunScrollArry._scrollBarStatus.speed);
      }

    },

    touchstart : function(e){
      sunScrollArry._touchStartY     = e.originalEvent.touches[0].pageY;
      if( !sunScrollArry._scrollBarStatus.permanent ){
        clearTimeout(sunScrollArry._delayTime);
        sunScrollArry.$scrollBar.fadeIn(sunScrollArry._scrollBarStatus.fadein);
      }
    },

    touchmove : function(e){
        sunScrollArry._wrapMoveTop   = sunScrollArry.$wrapMove.offset().top;
        sunScrollArry._touchMoveY    = e.originalEvent.touches[0].pageY;
        sunScrollArry._moveDistance  = (sunScrollArry._touchStartY - sunScrollArry._touchMoveY)/10;
        compute(e);
        e.preventDefault();
    },

    touchend : function(e){
      sunScrollArry._moveDistance = 0;
      if( !sunScrollArry._scrollBarStatus.permanent ){
        sunScrollArry._delayTime = setTimeout(function(){
          sunScrollArry.$scrollBar.stop(false,true).fadeOut(sunScrollArry._scrollBarStatus.fadeout);
        },sunScrollArry._scrollBarStatus.speed);
      }
    }
  });
}

function compute(e){
  sunScrollArry._endDistance   = sunScrollArry._endDistance-(sunScrollArry._moveDistance);

  if( sunScrollArry._endDistance>0 ){
    sunScrollArry._endDistance    = 0;
    sunScrollArry._endBarDistance = 0;
  }else if( sunScrollArry._endDistance<=-(sunScrollArry._wrapMoveHeight-sunScrollArry._wrapHeight) ){
    sunScrollArry._endDistance = -(sunScrollArry._wrapMoveHeight-sunScrollArry._wrapHeight);
  }

  sunScrollArry.$wrapMove.stop(false,true).css({
    top : sunScrollArry._endDistance,
  });
  sunScrollArry.$scrollBarMove.stop(false,true).css({
    top : -sunScrollArry._endDistance*( sunScrollArry._wrapHeight/sunScrollArry._wrapMoveHeight )
  });
}

var horizontalScroll = {
  $block            : '',
  $wrap             : '',
  $wrapMove         : '',
  $wrapMoveUl       : '',
  $wrapMoveUlLi     : '',
  $scrollBar        : '',
  $scrollBarMove    : '',
  horizontalBtn     : '',
  $pver             : '',
  $next             : '',
  _btnSwitch        : true,
  _activeSet        : false,
  _wrap_w           : 0,
  _ulWidth          : 0,
  _startPageX       : 0,
  _startPageY       : 0,
  _movePageX        : 0,
  _movePageY        : 0,
  _wrapMovLeft      : 0,
  _wrapMovTop       : 0,
  _endPageX         : 0,
  _endPageY         : 0,
  _distance         : 0,
  _liLength         : 0,
  _mouseSwitch      : false,
  _setTime          : '',
  _scrollBarStatus  : {
    permanent   : false,
    speed       : 300,
    fadein      : 300,
    fadeout     : 300,
  },

  initial           : function(sunScrollAPI){

    horizontalScroll.$block = $(sunScrollAPI.$block);

    horizontalScroll.$block.find('>').wrapAll('<div class="sunScroll-move"></div>');
    horizontalScroll.$block.append('<div class="scrollBar"><div class="scrollBar-move"><div class="style"></div></div></div>');
    horizontalScroll.$block.find('>').wrapAll('<div class="sunScroll-wrap"></div>');
    horizontalScroll.$wrap          = horizontalScroll.$block.find('>.sunScroll-wrap');

    horizontalScroll.$wrapMove      = horizontalScroll.$wrap.find('>.sunScroll-move');
    horizontalScroll.$wrapMoveUl    = horizontalScroll.$wrapMove.find('>ul');
    horizontalScroll.$wrapMoveUlLi  = horizontalScroll.$wrapMoveUl.find('>li');
    horizontalScroll.$scrollBar     = horizontalScroll.$wrap.find('>.scrollBar');
    horizontalScroll.$scrollBarMove = horizontalScroll.$scrollBar.find('>.scrollBar-move');

    var APILength = Object.keys(sunScrollAPI).length;
    for( i=0 ; i<APILength ; i++ ){
      var key = Object.keys(sunScrollAPI)[i];
      switch(key){
        case 'btnSwitch':
          horizontalScroll._btnSwitch = sunScrollAPI.btnSwitch;
          break;
        case 'scrollBar':
          if( sunScrollAPI.scrollBar.permanent!=null )
            horizontalScroll._scrollBarStatus.permanent = sunScrollAPI.scrollBar.permanent;
          if( sunScrollAPI.scrollBar.speed!=null )
            horizontalScroll._scrollBarStatus.speed     = sunScrollAPI.scrollBar.speed;
          if( sunScrollAPI.scrollBar.fadein!=null )
            horizontalScroll._scrollBarStatus.fadein    = sunScrollAPI.scrollBar.fadein;
          if( sunScrollAPI.scrollBar.fadeout!=null )
            horizontalScroll._scrollBarStatus.fadeout   = sunScrollAPI.scrollBar.fadeout;
          break;

        case 'activeSet':
          horizontalScroll._activeSet = sunScrollAPI.activeSet;
          break;
      }
    }


    if( horizontalScroll._btnSwitch ){
      horizontalScroll.$block.append('<div class="horizontalBtn pver"></div><div class="horizontalBtn next"></div>');
      horizontalScroll.horizontalBtn  = horizontalScroll.$block.find('>.horizontalBtn');
      horizontalScroll.$pver          = horizontalScroll.$block.find('>.pver');
      horizontalScroll.$next          = horizontalScroll.$block.find('>.next');
    }

    if(horizontalScroll._activeSet){
      horizontalScroll._wrap_w        = horizontalScroll.$wrap.width();
      horizontalScroll._liLength      = horizontalScroll.$wrapMoveUlLi.length;
      for( e=0 ; e<horizontalScroll._liLength ; e++ ){
        var className       = horizontalScroll.$wrapMoveUlLi.eq(e).attr('class');
        if( className!=null || className=='' ){
          var className       = className.split(' ')
          var classNameLength = className.length;
          for( g=0 ; g<classNameLength ; g++ ){
            switch(className[g]){
              case 'active':
                var wrapLeft        = horizontalScroll.$block.offset().left;
                var wrappaddingLeft = horizontalScroll.$block.css('padding-left');
                var liLeft          = horizontalScroll.$wrapMoveUlLi.eq(e).offset().left;
                horizontalScroll._endPageX = -(liLeft-(wrapLeft+parseInt(wrappaddingLeft)));
                break;
            }
          }
        }
      }
    }


    horizontalScroll.reSet();
    $(window).resize(function(event) {
      horizontalScroll.reSet();
    });
  },

  reSet             : function(){
    horizontalScroll._distance      = 0;
    horizontalScroll._ulWidth       = 0;
    horizontalScroll._wrapMovLeft   = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
    horizontalScroll._wrap_w        = horizontalScroll.$wrap.width();
    horizontalScroll._liLength      = horizontalScroll.$wrapMove.find('>ul>li').length;

    for( i=0 ; i<horizontalScroll._liLength ; i++ ){
      horizontalScroll._ulWidth = horizontalScroll._ulWidth + (horizontalScroll.$wrapMoveUlLi.eq(i).innerWidth());
    }
    horizontalScroll.$wrapMove.css('width',(horizontalScroll._ulWidth+1));

    if( horizontalScroll._ulWidth>horizontalScroll._wrap_w ){
      horizontalScroll.$scrollBarMove.css('width', ((horizontalScroll._wrap_w/horizontalScroll._ulWidth)*100)+'%' );
      horizontalScroll.horizontalBtn.removeClass('notShow');
      horizontalScroll.$scrollBar.removeClass('notShow');
      horizontalScroll.action();
    }else{
      horizontalScroll.$wrap.off();
      horizontalScroll.horizontalBtn.off();
      horizontalScroll.$wrapMove.stop(false,true).css('left',0)
      horizontalScroll.$scrollBarMove.stop(false,true).css( 'left', 0 );

      horizontalScroll.horizontalBtn.addClass('notShow');
      horizontalScroll.$scrollBar.addClass('notShow');
    }
    horizontalScroll.result();
  },

  action            : function(){
    horizontalScroll.$wrap.off();
    horizontalScroll.$wrap.on({
      mousedown  : function(e) {
        horizontalScroll._wrapMovLeft    = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
        horizontalScroll._endPageX       = horizontalScroll._wrapMovLeft;
        horizontalScroll._mouseSwitch    = true;
        horizontalScroll._startPageX     = e.pageX;
        horizontalScroll._startPageY     = e.pageY;
        clearTimeout(horizontalScroll._setTime);
        if( horizontalScroll._scrollBarStatus.permanent ){
          horizontalScroll.$scrollBar.stop(true,false).fadeIn(horizontalScroll._scrollBarStatus.fadein);
        }
      },
      mousemove  : function(e){
        if( horizontalScroll._mouseSwitch==true ){
          horizontalScroll._movePageX    = e.pageX;
          horizontalScroll._movePageY    = e.pageY;
          horizontalScroll._wrapMovLeft  = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
          horizontalScroll._distance     = (horizontalScroll._startPageX-horizontalScroll._movePageX)/5;
          horizontalScroll.result();
          e.preventDefault();
        }
      },
      mouseup    : function(e){
        horizontalScroll._mouseSwitch = false;
        if( horizontalScroll._scrollBarStatus.permanent ){
          horizontalScroll._setTime = setTimeout(function(){
            horizontalScroll.$scrollBar.stop(false,true).fadeOut(horizontalScroll._scrollBarStatus.fadeout);
          },horizontalScroll._scrollBarStatus.speed);
        }
      },
      mouseleave : function(e){
        horizontalScroll._mouseSwitch = false;
        if( horizontalScroll._scrollBarStatus.permanent ){
          horizontalScroll._setTime = setTimeout(function(){
            horizontalScroll.$scrollBar.stop(false,true).fadeOut(horizontalScroll._scrollBarStatus.fadeout);
          },horizontalScroll._scrollBarStatus.speed);
        }
      },
      touchstart : function(e){
        horizontalScroll._wrapMovLeft    = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
        horizontalScroll._endPageX       = horizontalScroll._wrapMovLeft;
        horizontalScroll._mouseSwitch    = true;
        horizontalScroll._startPageX     = e.originalEvent.touches[0].pageX;
        horizontalScroll._startPageY     = e.originalEvent.touches[0].pageY;
        clearTimeout(horizontalScroll._setTime);
        if( horizontalScroll._scrollBarStatus.permanent ){
          horizontalScroll.$scrollBar.fadeIn(horizontalScroll._scrollBarStatus.fadein);
        }
      },
      touchmove  : function(e){
        horizontalScroll._movePageX      = e.originalEvent.touches[0].pageX;
        horizontalScroll._movePageY      = e.originalEvent.touches[0].pageY;
        horizontalScroll._wrapMovLeft    = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
        horizontalScroll._distance       = (horizontalScroll._startPageX-horizontalScroll._movePageX)/5;
        horizontalScroll.result();
        e.preventDefault();
        if( horizontalScroll._scrollBarStatus.permanent ){
          horizontalScroll._setTime = setTimeout(function(){
            horizontalScroll.$scrollBar.fadeOut(horizontalScroll._scrollBarStatus.fadeout);
          },horizontalScroll._scrollBarStatus.speed);
        }
      }
    });

    horizontalScroll.horizontalBtn.off();
    horizontalScroll.horizontalBtn.on({
      click : function(e){
        var className = $(this).attr('class').split(' ');
        horizontalScroll._wrapMovLeft  = horizontalScroll.$wrapMove.offset().left-horizontalScroll.$wrap.offset().left;
        for( z=0 ; z<className.length ; z++ ){
          switch ( className[z] ){
            case 'pver' :
              horizontalScroll._distance = -200;
              break;
            case 'next' :
              horizontalScroll._distance = 200;
              break;
          }
        }
        if( horizontalScroll._scrollBarStatus.permanent ){
          clearTimeout(horizontalScroll._setTime);
          horizontalScroll.$scrollBar.stop(true,false).fadeIn(horizontalScroll._scrollBarStatus.fadein);
          horizontalScroll._setTime = setTimeout(function(){
            horizontalScroll.$scrollBar.stop(false,true).fadeOut(horizontalScroll._scrollBarStatus.fadeout);
          },horizontalScroll._scrollBarStatus.speed);
        }
        horizontalScroll.result();
      }
    });
  },

  result            : function(){
    horizontalScroll._endPageX      = horizontalScroll._endPageX-horizontalScroll._distance;
    if( horizontalScroll._endPageX >=0 ){
      horizontalScroll._endPageX = 0;
      horizontalScroll.$pver.addClass('notShow');
    }else if( horizontalScroll._endPageX <= -(horizontalScroll._ulWidth-horizontalScroll._wrap_w) ){
      horizontalScroll._endPageX = -(horizontalScroll._ulWidth-horizontalScroll._wrap_w);
      horizontalScroll.$next.addClass('notShow');
    }else{
      horizontalScroll.$pver.removeClass('notShow');
      horizontalScroll.$next.removeClass('notShow');
    }
    horizontalScroll.$wrapMove.stop(false,true).css('left',horizontalScroll._endPageX)
    horizontalScroll.$scrollBarMove.stop(false,true).css( 'left', -horizontalScroll._endPageX*( (horizontalScroll._wrap_w/horizontalScroll._ulWidth) ) );
  }
}
