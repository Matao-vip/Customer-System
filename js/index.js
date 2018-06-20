jQuery(function($){
    var $chatWindow = $('#chatWindow');
    var $top = $chatWindow.find('.top');
    var $minWindow = $('#minwidow');
    var $msglist = $('.body .msglist ul');

    // 拖拽效果
    $top.mousedown(function(e){
        // var e = e || window.event;  // 已经用了jq，不考虑兼容性
        var ox = e.clientX - $chatWindow.offset().left;
        var oy = e.clientY - $chatWindow.offset().top;
        document.onmousemove=function(evt){
            var x = evt.clientX-ox;
            var y = evt.clientY-oy;
            if(x<=0) x=0;
            if(y<=0) y=0;
            if(x>=window.innerWidth - $chatWindow.outerWidth()) x=window.innerWidth - $chatWindow.outerWidth();
            if(y>=window.innerHeight - $chatWindow.outerHeight()) y=window.innerHeight - $chatWindow.outerHeight();
            $chatWindow.css({left:x,top:y})
            return false;
        }
        document.onmouseup=function(){
            document.onmousemove=null;
        }
    })
    // 关闭按钮
    $('.marco-guanbi').click(function(e){
        $chatWindow.hide();
    })
    // 改变窗口大小
    $('.changewindow').click(function(){
        $(this).toggleClass('marco-zuidahua1');
        $chatWindow.toggleClass('big');
    })
    // 最小化
    $('.marco-zuixiaohua').click(function(){
        $chatWindow.slideUp(function(){
          $minWindow.fadeIn();
        });
    })
    // 复原
    $minWindow.click(function(){
        $minWindow.hide();
        $chatWindow.slideDown();
    })

    // 问答系统
    function QAsystem(){
        var val = $('.question').val();
        if(val.trim() == '') return false;
        // 生成问题列表
        var Qtime = new Date();
        Qtime=Qtime.format('YYYY-MM-DD hh:mm')
        $('<li/>').addClass('clfix Time').html('<span class="fr time">'+Qtime+'</span>').appendTo($msglist);
        var $Qli = $('<li/>').addClass('clfix').html('<span class="fr customer triangle-right">'+val+'</span>').appendTo($msglist);
        $('.body')[0].scrollTop = $('.body')[0].scrollHeight;
        $('.question').val('').focus();

        // 生成回答列表
        setTimeout(function(){
            $.ajax({
               type: "POST",
               url: "http://localhost:1100/getanwser",
               data: "mes="+val,
               success: function(res){
                    var res = res.results;
                    $('<li/>').addClass('clfix Time').html('<span class="fl time">'+Qtime+'</span>').appendTo($msglist);
                    res.forEach((item,idx)=>{
                        var $Ali = $('<li/>').addClass('clfix');
                        if(item.resultType == 'url'){
                            $Ali.html(`<a href="${item.values.url}" class="fl robot triangle-left" target="_blank">${item.values.url}</a>`);
                        }else if(item.resultType == 'image'){
                            $Ali.html(`<img src="${item.values.image}" class="fl"/>`);
                        }else if(item.resultType == 'text'){
                            $Ali.html(`<span class="fl robot triangle-left">${item.values.text}</span>`);
                        }else{
                            $Ali.html('<span class="fl robot triangle-left">你说什么？风太大我看不见哈哈哈~~~！</span>');
                        }
                        $msglist.append($Ali);
                        $('.body')[0].scrollTop = $('.body')[0].scrollHeight;
                    })
               }
            });
        },1000)
    }
    
    // 点击发送
    $('.foot .bottom input').click(function(){
        QAsystem();
    })
    // 移入发送按钮提示快捷键
    $('.foot .bottom input').mousemove(function(e){
        $('.send_hint').show();
        var x = e.clientX-$('.foot .bottom').offset().left+10;
        var y = e.clientY-$('.foot .bottom').offset().top+10;
        if(e.clientX+10>=window.innerWidth-$('.send_hint').outerWidth()){
            x = e.clientX-$('.foot .bottom').offset().left - $('.send_hint').outerWidth() -5;
        }
        if(e.clientY+10>=window.innerHeight-$('.send_hint').outerHeight()){
            y = e.clientY-$('.foot .bottom').offset().top - $('.send_hint').outerHeight() -5;
        }
        $('.send_hint').css({
            left:x,
            top:y
        })
    })
    $('.foot .bottom input').mouseout(function(){
        $('.send_hint').hide();
    })
    // Ctrl+Enter发送
    window.onkeydown=function(e){
        if(e.ctrlKey && e.keyCode===13) QAsystem();
    }
})