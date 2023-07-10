$(function(){
    $(".hamburger").click(function(){
        $(this).toggleClass('active');
        $("#sp-navi").toggleClass('active');
        if($("#sp-navi").hasClass('active')){

            $("body").css('overflow-y', 'hidden');
        } else {

            $("body").css('overflow-y', 'auto');
        }
    });
    // naviがクリックされたら
    $("#sp-navi a").click(function(){
        $("body").css('overflow-y', 'auto');
        $(".hamburger").removeClass('active');
        $("#sp-navi").removeClass('active');
    });

    // スクロール
    $('#sp-navi a[href*="#"], #pc-navi a[href*="#"]').click(function(){
        // 対象のidを取得
        var elmHash =$(this).attr('href');
        // 位置を取得
        var pos = $(elmHash).offset().top-70;
        $('body,html').animate({scrollTop: pos}, 500);
        return false;
    });

    // 上にいく Pagetop
    function PageTopAnime(){
        var scroll = $(window).scrollTop();
        if(scroll >= 200){
            $('#page-top').removeClass('DownMove');
            $('#page-top').addClass('UpMove');
        } else {
            if($('#page-top').hasClass('UpMove')){
                $('#page-top').removeClass('UpMove');
                $('#page-top').addClass('DownMove');
            }
        }

        var wH = window.innerHeight;
        var footerPos = $('#footer').offset().top;
        if(scroll + wH >= (footerPos + 10)){
            var pos = (scroll + wH) - footerPos + 10;
            $('#page-top').css('bottom', pos);
        } else {
            if($('#page-top').hasClass('UpMove')){
                $('#page-top').css('bottom', '10px');
            }
        }
    };
    // スクロールしたら発動
    $(window).scroll(function(){
        PageTopAnime();
    });
    // page-topをクリックした際
    $('#page-top').click(function(){
        $('body, html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });


    // ふわっと動かせる
    function fadeAnime() {
        $('.fadeUpTrigger').each(function(){
            var elemPos = $(this).offset().top - 50;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if(scroll >= elemPos - windowHeight){
                $(this).addClass('fadeUp');
            } 
        });

        // 別の処理を追加する際の例
        // $('.fadeDownTrigger').each(function(){
        //     var elemPos = $(this).offset().top -50;
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     if(scroll >= elemPos - windowHeight){
        //         $(this).addClass('fadeDown');
        //     } else {
        //         $(this).removeClass('fadeDown');
        //     }
        // });
    };
    // トリガーはなかにいれない
    $(window).scroll(function(){
        fadeAnime();
    });

    // QAアコーディオン
    $('.qa-title').on('click', function(){
        var findElm = $(this).next(".qa-box");
        $(findElm).slideToggle();

        if($(this).hasClass('close')){
            $(this).removeClass('close');
        } else {
            $(this).addClass('close');
        }
    });

});

// QAアコーディオンの追加、初期時に開いている
$(window).on('load', function(){
    $('.accordion-area li:first-of-type .qa-area').addClass("open");
    $(".open").each(function(index, element){
        var Title = $(element).children('.qa-title');
        $(Title).addClass('close');
        var Box = $(element).children('.qa-box');
        $(Box).slideDown(500);
    })
})



// 同じ日付ならローディング非表示
var splash_text = $.cookie('accessdate');
var myD = new Date();
var myYear = String(myD.getFullYear());
var myMonth = String(myD.getMonth() + 1);
var myDate = String(myD.getDate());

if(splash_text != myYear + myMonth + myDate){
// ローディングアニメーション
$(window).on('load', function(){
    $("#splash-logo").delay(1200).fadeOut('slow');
    $("#splash").delay(1500).fadeOut('slow', function(){
        $('body').addClass('appear');
    });
    $.cookie('accessdate', myYear + myMonth + myDate); //accessdateキーで年月日を記録
});
} else {
    // 2回目以降
    $("#splash, #splash-logo").css("display", "none");
    $('body').addClass('second');
}

