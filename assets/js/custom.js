// const { device } = require("./current-device.min");
// custom.js
(function ($) {
    __EventType =EventTypeEnum.E360;
    __ButtonState = ButtonStateEnum.EPrepare;

    var json  = houseDetailJson;
    $("#iframe360").attr("src", __360MainPage);
    var listItemList = $("#listItemList");
    listItemList.html("");
    $.each(json,function(index,item){
        // style="border-top-color: rgba(255, 0, 0, 0.5);"
        var  $item = $('<div class="ui-sidebar__list-item"></div>');
        $item.attr("attrUrl",item.url);
        $item.attr("unique",item.unique);
        $item.attr("enterunique",item.enterunique);
        $item.attr("leaveunique",item.leaveunique);
        $item.attr("link360",item.link360);
        
        if (item.Status == 1) {
            $item.attr("id", "verkauft");
            console.log(item.money)
            if (item.money == "reserviert") {
                var verkauftLabel = $('<div class="verkauft-label">reserviert</div>');
                $item.append(verkauftLabel);
            } else if (item.money == "verkauft") {
                var verkauftLabel = $('<div class="verkauft-label">verkauft</div>');
                $item.append(verkauftLabel);
            }

            $item.append(verkauftLabel);
            $item.addClass('disabled'); // Hinzufügen der Klasse für nicht anklickbar
        } else {
            $item.attr("id", "NichtVerkauft");
        }

        listItemList.append($item);
        var header = $('<div class="ui-sidebar__list-item__header"><span >'+item.name+'</span></div>');
        $item.append(header);
        var detail = $('<div class="ui-sidebar__list-item__price"><a class="downloaddetail"><span>'+item.detail+'</span></a></div>');
        $item.append(detail);
        var ulLiData = $('<div class="ui-sidebar__list-item__meta"></div>');
        $item.append(ulLiData);
        var ul = $('<ul></ul>');
        ulLiData.append(ul);
        ul.append($('<li><span>'+item.area+'</span></li>'));
        ul.append($('<li><span>'+item.zi+'</span></li>'));
        ul.append($('<li><span>'+item.money+'</span></li>'));

        // var selectDiv = $('<div class="ui-sidebar__list-item__select"></div>');
        // selectDiv.append($('<img src="assets/image/right.png" alt="3D">'));
        // $item.append(selectDiv);
    })
    
    $(".downloaddetail").click(function(e){
        e.preventDefault();
        var url = $(this).parent().parent().attr("attrUrl");
        window.open(url);
    })

    $("#button1").click(function(){
        window.open("https://www.dvdarch.ch/Hosting/Sigriswil/Sigriswil%20ReatliyStreamdata/VR.zip");
    })
    $("#button2").click(function(){
        window.open("https://www.dvdarch.ch/Hosting/Sigriswil/Sigriswil%20ReatliyStreamdata/Platzhalter.pdf");
    })
    /*
    $('#button1').jBox('Tooltip', {
        content: 'Laden Sie das 3D für die Offline- und VR-Nutzung herunter.',
        closeOnMouseleave: true,
        width: 200,
        theme: 'TooltipBorderThick',
        color:"black",
        animation: 'move',
        offset: {
          x: 0,
          y: -5
        },
    });

    $('#btn3DHover').jBox('Tooltip', {
        content: 'RealityStream ist ein ein Onlineapp in der Sie sich frei in der Wohnung bewegen können. Ausserdem gibt es die Möglichkeit den Sonnenstand sowie verschiedene Materialien einzustellen.',
        closeOnMouseleave: true,
        width: 350,
        theme: 'TooltipBorderThick',
        color:"black",
        animation: 'move',
        offset: {
          x: 0,
          y: -5
        },
    });

    */
    // $("#button1").attr("title","Laden Sie das 3D für die Offline- und VR-Nutzung herunter.");

    // // $("#button1").popover('dispose');
    // $("#button1").tooltip({
    //     "content":"Laden Sie das 3D für die Offline- und VR-Nutzung herunter."
    // });




    // window.onload = function(){

    // }
    
    const fullScreen = ele => {
        const func =
          ele.requestFullscreen ||
          ele.mozRequestFullScreen ||
          ele.webkitRequestFullscreen ||
          ele.msRequestFullscreen;
        func.call(ele);
    };

    function exitFullScreen(){
            var elem=document;  
            if(elem.webkitCancelFullScreen){  
                elem.webkitCancelFullScreen();      
            }else if(elem.mozCancelFullScreen){  
                elem.mozCancelFullScreen();  
            }else if(elem.cancelFullScreen){  
                elem.cancelFullScreen();  
            }else if(elem.exitFullscreen){  
                elem.exitFullscreen();  
            }else{  
                //浏览器不支持全屏API或已被禁用  
            }  
    }
    function fullScreenEvent($this){
        if($this.hasClass("fullScreen"))
        {
            exitFullScreen();
            $this.removeClass("fullScreen")
        }
        else{
            fullScreen(document.documentElement);
            $this.addClass("fullScreen")
        }
    }
    // $("body").click(function(element){
    //     fullScreen(document.documentElement);
    // })
    /*
    if(device.mobile() || device.ipad() || device.tablet()){
        $("body").addClass("mobile");
        $("#phoneblock").css("display","block");
        $("#sidebarblock").css("display","block");
        $("body").click(function(){
            $("#phoneblock").css("display","none");
            $("#sidebarblock").css("display","none");
        })
        // $("#button3").click(function(){
        //     if($(this).hasClass("fullScreen"))
        //     {
        //         exitFullScreen();
        //         $(this).removeClass("fullScreen")
        //     }
        //     else{
        //         fullScreen(document.documentElement);
        //         $(this).addClass("fullScreen")
        //     }
        // })
    }
    else if(device.ipad()){
        $("body").addClass("pad");
        $("#phoneblock").css("display","block");
        $("#sidebarblock").css("display","block");
        $("body").click(function(){
            $("#phoneblock").css("display","none");
            $("#sidebarblock").css("display","none");
        })
    }
    else
    {
        // var iframe = document.getElementById("iframe360");
        // var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // iframeDocument.attachEvent("onload", function () {
        //     this.contentWindow.document.ondblclick = function() { alert('it work\'s'); }
        // });
        // document.getElementById("iframe360").contentWindow.document.getElementById("container").dblclick(function(){
        //     parent.$("body",parent.document).trigger("dblclick");
        // })
        // $("#iframe360").on("load", function(event){//判断 iframe是否加载完成  这一步很重要
        //     var iBody = $("#myFrame").contents().find("body");
        //     iBody.dblclick(function(){
        //         console.log("iframe 360 Loading");
        //     })
        // });
        // fullScreen(document.documentElement);
        // $("body").addClass("mobile");
        // $("#phoneblock").css("display","block");
        // $("#sidebarblock").css("display","block");
        // $("body").click(function(){
        //     $("#phoneblock").css("display","none");
        //     $("#sidebarblock").css("display","none");
        // })
    }*/
    $("#buttonFullExit").click(function(){
        // $("iframe").removeClass("fullScreenSt")
        exitScreen();
    })
    $("#hideMenu").click(function(){
        if($("#ui-sidebar").hasClass("hide")){
            $("#ui-sidebar").removeClass("hide");
            $(this).find(".ui-button__content").text("《 ");
        }
        else{
            $("#ui-sidebar").addClass("hide");
            $(this).find(".ui-button__content").text(" 》");
        }
    })
    $("#buttonFull").click(function(){
        fullScreenFunction();
        // $("iframe").addClass("fullScreenSt")
    })
    $("#logoCh").click(function(){
        window.open("https://www.dvdarch.ch","_blank");
        onsole.log("HAAALLLLOOO");
    })

    document.addEventListener("fullscreenchange",function(event){
      if(isElementFullScreen()){
        $("#buttonFull").addClass("hide");
        $("#buttonFullExit").removeClass("hide");

      }
      else{
        $("#buttonFullExit").addClass("hide");
        $("#buttonFull").removeClass("hide");
      }
    });


    function toggleSidebar(side) {
        var sidebarId, btnId, arrowOpen, arrowClosed;
        
        if (side === 'left') {
            sidebarId = 'ui-sidebar-left';
            btnId = 'toggle-left-btn';
            arrowOpen = '&#9664;'; arrowClosed = '&#9654;'; 
        } else {
            sidebarId = 'ui-sidebar-right';
            btnId = 'toggle-right-btn';
            arrowOpen = '&#9654;'; arrowClosed = '&#9664;'; 
        }

        var sidebarElement = document.getElementById(sidebarId);
        var btnElement = document.getElementById(btnId);
        
        if (sidebarElement) {
            sidebarElement.classList.toggle('collapsed');
            
            if (sidebarElement.classList.contains('collapsed')) {
                btnElement.innerHTML = arrowClosed;
            } else {
                btnElement.innerHTML = arrowOpen;
            }

            // WICHTIG: Zeit auf 450ms oder 500ms erhöhen, da CSS transition 0.4s dauert
            setTimeout(function() {
                // Feuert das generelle Resize Event für Layouts
                window.dispatchEvent(new Event('resize'));
                
                // Explizit die Unreal Player Resize Funktion aufrufen, falls vorhanden
                if (typeof window.resizePlayer === "function") {
                    window.resizePlayer();
                }
            }, 450); 
        }
    }

    function loadScripts(scripts, callback) {
      var index = 0; 
      function loadNextScript() {
        if (index < scripts.length) {
          var script = document.createElement('script');
          script.src = scripts[index] + '?version=' + new Date().getTime();
          script.onload = function() {
            index++;
            if (index >= scripts.length) {
              callback(); 
            } else {
              loadNextScript(); 
            }
          };
          document.head.appendChild(script);
        }
      }
      loadNextScript(); 
    }
})(jQuery)

