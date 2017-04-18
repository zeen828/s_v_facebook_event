//facebook
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1044817312247946',
    xfbml      : true,
    version    : 'v2.7'
  });
};
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-72369369-1', 'auto');
    ga('send', 'pageview');

$(function(){
  $(window).load(function() {

    $allSet.initial();

    $(window).resize(function(e) {
      $allSet.header();
      $allSet.content();
      $allSet.footer();
      $allSet.bannerAll();
    });

    $('.loading').fadeOut('500');
    var sunScrollAPI = new horizontalScroll.initial({
      $block    : '#vice1',  //綁定區塊名稱
      toBottom  : false,   //起始至底
      btnSwitch : true,    //上下頁開關
      activeSet : true,
      scrollBar : {
        permanent : true, //scrollBar 常駐不消失
        speed     : 1500,   //停留時間
        fadein    : 100,   //淡入時間
        fadeout   : 200,   //淡出時間
      }
    });

    var sunScrollAPI = new sunScroll({
      $block    : '#nav',  //綁定區塊名稱
      toBottom  : true,   //起始至底
      scrollBar : {
        permanent : false, //scrollBar 常駐不消失
        speed     : 400,   //停留時間
        fadein    : 100,   //淡入時間
        fadeout   : 200,   //淡出時間
      }
    });
  });
});

$allSet = {
  $body         : '',
  $banner       : '',
  $wrap         : '',
  $header       : '',
  $headerLogo   : '',
  $headerNav    : '',
  $content      : '',
  $contenttop   : '',
  $contentleft  : '',
  $contentcenter: '',
  $contentright : '',
  $contentbottom: '',
  $footer       : '',

  initial : function(){
    $allSet.$body       = $('body');
    $allSet.$body.find('>').wrapAll('<div id="wrapper"></div>');
    $allSet.$wrap       = $allSet.$body.find('>#wrapper');
    $allSet.$header     = $allSet.$wrap.find('>header');
    $allSet.$content    = $allSet.$wrap.find('>.content');
    $allSet.$footer     = $allSet.$wrap.find('>footer');

    $allSet.$header.find('>').wrapAll('<div class="in"></div>');
    $allSet.$content.find('>').wrapAll('<div class="in"></div>');
    $allSet.$footer.find('>').wrapAll('<div class="in"></div>');

    $allSet.set();
  },

  set : function(){
    $allSet.$headerLogo       = $allSet.$header.find('>.in>#logo');
    $allSet.$headerNav        = $allSet.$header.find('>.in>nav');
    $allSet.$banner           = $allSet.$body.find('.bannerAll');

    $allSet.$contenttop       = $allSet.$content.find('>.in>.top');
    $allSet.$contentleft      = $allSet.$content.find('>.in>.left');
    $allSet.$contentcenter    = $allSet.$content.find('>.in>.center');
    $allSet.$contentright     = $allSet.$content.find('>.in>.right');
    $allSet.$contentbottom    = $allSet.$content.find('>.in>.bottom');


    if( $allSet.$contenttop.attr('switch')    =='false') $allSet.$contenttop.hide();
    if( $allSet.$contentleft.attr('switch')   =='false') $allSet.$contentleft.hide();
    if( $allSet.$contentcenter.attr('switch') =='false') $allSet.$contentcenter.hide();
    if( $allSet.$contentright.attr('switch')  =='false') $allSet.$contentright.hide();
    if( $allSet.$contentbottom.attr('switch') =='false') $allSet.$contentbottom.hide();

    $allSet.$contentright.find('>').wrapAll('<div class="in"></div>')

    $allSet.header();
    $allSet.content();
    $allSet.footer();
    $allSet.bannerAll();
  },

  header : function(){
    var _blockLength  = $allSet.$header.length;
    var _range        = [1000,720];
    var _addClass     = ['pc','pad','mobile'];
    var _rangeLength  = _range.length;
    var _sum          = 0;
    var _maxW         = [];
    var _minW         = [];
    var _select       = 0;
    if( _blockLength!=0 ){
      var _width        = $allSet.$header.find('>.in').width();
      for( i=0 ; i<_rangeLength ; i++ ){
        _sum++;
        if( _sum>=_rangeLength-1 ){
          _sum = _rangeLength-1;
        }
        _maxW[i] = _range[i];
        _minW[i] = _range[_sum];

        if( _width>=_maxW[0] ){
          _select = 0;
        }else if( _width<_minW[_rangeLength-1] ){
          _select = _rangeLength;
        }else if( _width<_maxW[i] && _width>=_minW[i] ){
          _select = i+1;
        }
        $allSet.$header.removeClass( _addClass[0] ).removeClass( _addClass[i+1] );
      }
      $allSet.$header.addClass( _addClass[_select] );
      headerRight();
    }

    function headerRight(){
      if( $allSet.$headerNav.attr('switch')=='false' ){
        $allSet.$headerNav.hide();
        $allSet.$headerLogo.addClass('center');
      }else{
        $allSet.$content.addClass('haveNav');
        horizontalScroll.reSet();
      }
    }
  },

  content : function(){
    var _blockLength  = $allSet.$content.length;
    var _range        = [1000,720];
    var _addClass     = ['pc','pad','mobile'];
    var _rangeLength  = _range.length;
    var _sum          = 0;
    var _maxW         = [];
    var _minW         = [];
    var _select       = 0;
    if( _blockLength!=0 ){
      var _width        = $allSet.$content.find('>.in').width();
      for( i=0 ; i<_rangeLength ; i++ ){
        _sum++;
        if( _sum>=_rangeLength-1 ){
          _sum = _rangeLength-1;
        }
        _maxW[i] = _range[i];
        _minW[i] = _range[_sum];

        if( _width>=_maxW[0] ){
          _select = 0;
        }else if( _width<_minW[_rangeLength-1] ){
          _select = _rangeLength;
        }else if( _width<_maxW[i] && _width>=_minW[i] ){
          _select = i+1;
        }
        $allSet.$content.removeClass( _addClass[0] ).removeClass( _addClass[i+1] );
      }
      $allSet.$content.addClass( _addClass[_select] );
      contenttop();
      videoBlock();
    }

    function contenttop(){
      var spanImgLength = $allSet.$contenttop.find('>span.img').length;
      if( spanImgLength!=0 ){
        $allSet.$contenttop.find('>a,img').remove();
        for(si=0 ; si<spanImgLength ; si++){
          var imgSrc    = $allSet.$contenttop.find('>span.img').eq(si).attr(_addClass[_select]);
          var imgUrl    = $allSet.$contenttop.find('>span.img').eq(si).attr('url');
          var imgAlt    = $allSet.$contenttop.find('>span.img').eq(si).attr('alt');
          var imgTitle  = $allSet.$contenttop.find('>span.img').eq(si).attr('title');
          if( imgUrl!='' ){
            $allSet.$contenttop.append('<a href="'+imgUrl+'"><img class="mainImg" src="'+imgSrc+'" alt="'+imgAlt+'" title="'+imgTitle+'"></a>');

          }else{
            $allSet.$contenttop.append('<img class="mainImg" src="'+imgSrc+'" alt="'+imgAlt+'" title="'+imgTitle+'">');
            $allSet.$contenttop.find('img').load(function(){
              contentRight();
            });
          }
        }
      }
    }

    function videoBlock(){
      var $centerTop      = $allSet.$contentcenter.find('>.top');
      var centerTopLength = $centerTop.lenght;
      var _height         = 0;
      if( centerTopLength!=0 ){
        if( $centerTop.attr('videoStatus')=='fblive' ){
          _height = 1;
        }else{
          _height = 1.777;
        }
        var centerTopW = $centerTop.width();
        $centerTop.css({
          height : centerTopW/_height,
        });
      }
    }

    function contentRight(){
      var win_w = $(window).width();
      var win_h = $(window).height();

      if( win_w>_range[1] ){
        var _contentCenterH  = $allSet.$contentcenter.innerHeight();
        $allSet.$contentright.css({height:_contentCenterH});
      }else{
        var _allContent_h     = $allSet.$content.height();
        var _contentTop_h     = $allSet.$contenttop.innerHeight();
        var _contentCenter_h  = $allSet.$contentcenter.innerHeight();

        $allSet.$contentright.css({
          height: _allContent_h - (_contentTop_h+_contentCenter_h),
        });
      }
      //retest();
    }
  },

  footer : function(){
    var _blockLength  = $allSet.$footer.length;
    var _range        = [1000,720];
    var _addClass     = ['pc','pad','mobile'];
    var _rangeLength  = _range.length;
    var _sum          = 0;
    var _maxW         = [];
    var _minW         = [];
    var _select       = 0;
    if( _blockLength!=0 ){
      var _width        = $allSet.$footer.find('>.in').width();
      for( i=0 ; i<_rangeLength ; i++ ){
        _sum++;
        if( _sum>=_rangeLength-1 ){
          _sum = _rangeLength-1;
        }
        _maxW[i] = _range[i];
        _minW[i] = _range[_sum];

        if( _width>=_maxW[0] ){
          _select = 0;
        }else if( _width<_minW[_rangeLength-1] ){
          _select = _rangeLength;
        }else if( _width<_maxW[i] && _width>=_minW[i] ){
          _select = i+1;
        }
        $allSet.$footer.removeClass( _addClass[0] ).removeClass( _addClass[i+1] );
      }
      $allSet.$footer.addClass( _addClass[_select] );
      footerImg();
    }

    function footerImg(){
      var spanImgLength = $allSet.$footer.find('>.in>span.img').length;
      if( spanImgLength!=0 ){
        $allSet.$footer.find('>.in>a,>.in>img').remove();
        for(si=0 ; si<spanImgLength ; si++){
          var imgSrc    = $allSet.$footer.find('>.in>span.img').eq(si).attr(_addClass[_select]);
          var imgUrl    = $allSet.$footer.find('>.in>span.img').eq(si).attr('url');
          var imgAlt    = $allSet.$footer.find('>.in>span.img').eq(si).attr('alt');
          var imgTitle  = $allSet.$footer.find('>.in>span.img').eq(si).attr('title');
          if( imgUrl!='' ){
            $allSet.$footer.find('>.in').append('<a href="'+imgUrl+'"><img class="mainImg" src="'+imgSrc+'" alt="'+imgAlt+'" title="'+imgTitle+'"></a>');

          }else{
            $allSet.$footer.find('>.in').append('<img class="mainImg" src="'+imgSrc+'" alt="'+imgAlt+'" title="'+imgTitle+'">');
          }
        }
      }
    }
  },

  bannerAll : function(){

    var $blockUl      = $allSet.$banner.find('>ul');
    var _bannerRange  = [730,500];
    var _blockLength  = $allSet.$banner.length;
    var _sum          = 0;
    var _maxW         = [];
    var _minW         = [];
    var _select       = 0;

    if( _blockLength!=0 ){
      for( i=0 ; i<_blockLength ; i++ ){
        if( $allSet.$banner.eq(i).attr('switch')!='false' ){
          var _blockW = $allSet.$banner.eq(i).width();
          for(r=0 ; r<_bannerRange.length ; r++){
            _sum++;
            if( _sum>=_bannerRange.length-1 ){
              _sum = _bannerRange.length-1;
            }
            _maxW[r] = _bannerRange[r];
            _minW[r] = _bannerRange[_sum];

            if( _blockW>=_maxW[0] ){
              _select = 0;
            }else if( _blockW<_minW[_bannerRange.length-1] ){
              _select = _bannerRange.length;
            }else if( _blockW<_maxW[r] && _blockW>=_minW[r] ){
              _select = i+1;
            }
          }
          $allSet.$banner.eq(i).find('>ul>li').hide();
          $allSet.$banner.eq(i).find('>ul>li').eq(_select).show();


          var googletag = googletag || {};
          googletag.cmd = googletag.cmd || [];

          googletag.cmd.push(function() {
          googletag.defineSlot('/123939770/Vidol_web_board_320', [320, 50], 'div-gpt-ad-1472642594193-0').addService(googletag.pubads());
          googletag.defineSlot('/123939770/Vidol_web_board_468', [468, 60], 'div-gpt-ad-1472642594193-1').addService(googletag.pubads());
          googletag.defineSlot('/123939770/Vidol_web_board_728', [728, 90], 'div-gpt-ad-1472642594193-2').addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
          });
        }else{
          $allSet.$banner.eq(i).hide();
        }
      }
    }
  }
}

