$(function(){
  $(window).load(function() {
    $message.addClass();
    $(window).resize(function(event) {
      listUlReset();
    });
  });
});

function listUlReset(){
  $message.model1();
}

$message = {
  addClass:function(){
    var className = $('.messageUl');
    var Length = $(className).length;
    for(i=0;i<Length;i++){
      $(className).eq(i).addClass( $(className).eq(i).attr('model') );
    }
    listUlReset();
  },

  model1 : function(){
    var className       = $('.messageUl.model1');
    var Length          = className.length;
    var rangeW          = [1000,768,680,580,420];
    var maxW            = [];
    var minW            = [];
    var select          = 0;
    var sum             = 0;
    var addClass        = ['style1','style2','style3','style4','style5'];
    if( Length!=0 ){
      for(i=0 ; i<Length ; i++){
        var parentW       = className.eq(i).width();
        for(q=0 ; q<rangeW.length ; q++){
          sum++;
          if( sum>=rangeW.length-1 ){
            sum = rangeW.length-1;
          }
          maxW[q] = rangeW[q];
          minW[q] = rangeW[sum];

          if( parentW>=maxW[0] ){
            select = 0;
          }else if( parentW<minW[rangeW.length-1] ){
            select = rangeW.length-1;
          }else if( parentW<maxW[q] && parentW>=minW[q] ){
            select = q;
          }
          className.eq(i).removeClass(addClass[q]);
        }
        className.eq(i).addClass(addClass[select]);
        var mainImgW = className.eq(i).find('>li>.left').innerWidth();
        var viceImgW = className.eq(i).find('>li>.right>ul>li>.left').innerWidth();
        className.eq(i).find('>li>.left').css({
          height : mainImgW,
        });
        className.eq(i).find('>li>.right>ul>li>.left').css({
          height : viceImgW,
        })
      }
      //retest();
    }
  }
}
