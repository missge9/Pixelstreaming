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


// ============================================================
// FIX: SICHERER TAB-WECHSEL (WAKE UP)
// ============================================================
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        console.log("👀 Tab aufgeweckt! Prüfe Sicherheit...");

        // Sicherheits-Check: Existiert das PixelStreaming Objekt überhaupt?
        if (!window.pixelStreaming) {
             console.log("⚠️ PixelStreaming Objekt nicht gefunden. Breche Wake-Up ab.");
             return;
        }

        // Sicherheits-Check: Ist die WebRTC Verbindung aktiv? 
        // Dies verhindert den 'peerConnection undefined' Fehler
        if (!window.webRtcPlayerObj || !window.webRtcPlayerObj.peerConnection) {
             console.log("⚠️ Keine aktive PeerConnection. Warte auf automatischen Reconnect...");
             // Hier nichts tun, da 'addIceCandidate' sonst fehlschlägt
             return;
        }

        // Sicherheits-Check: Ist die Verbindung stabil genug für ICE Candidates?
        // Verhindert 'remote description was null'
        if (window.webRtcPlayerObj.peerConnection.remoteDescription === null) {
             console.log("⚠️ Verbindung noch im Aufbau (RemoteDesc null). Sende keine Befehle.");
             return;
        }

        console.log("✅ Verbindung scheint stabil. Führe Layout-Updates durch...");

        // 1. Layout korrigieren
        window.dispatchEvent(new Event('resize'));
        
        // Resize Player nur aufrufen, wenn Funktion existiert
        if (typeof window.resizePlayer === "function") {
            try {
                window.resizePlayer();
            } catch(e) { console.warn("Resize Fehler abgefangen:", e); }
        }

        // 2. Video Playback sicherstellen
        var video = document.querySelector('video');
        if (video && video.paused && video.readyState >= 2) {
            video.play().catch(e => {});
        }

        // 3. Handshake nur senden, wenn wir im Lade-Modus hängen geblieben sind
        if (typeof __ButtonState !== 'undefined' && __ButtonState === ButtonStateEnum.ELoadding) {
             console.log("Sende ClientReady (Safe Mode)...");
             window.pixelStreaming.emitUIInteraction("ClientReady");
        }
    }
});

function attemptClientReadyHandshake() {
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        console.log("📡 Sende manuelles 'ClientReady' an Unreal...");
        window.pixelStreaming.emitUIInteraction("ClientReady");
        
        // Auch sicherstellen, dass das Video läuft (manchmal pausieren Browser Videos im Hintergrund)
        var video = document.querySelector('video');
        if (video && video.paused && video.readyState >= 2) {
            console.log("▶️ Video war pausiert. Starte Playback...");
            video.play().catch(e => console.log("Autoplay prevent"));
        }
    } else {
        console.log("⏳ PixelStreaming noch nicht bereit für Handshake.");
    }
}

// ============================================================
// FIX: XR FEHLER UNTERDRÜCKEN
// ============================================================
function registerXRHandler() {
    if (window.pixelStreaming) {
        // Wir registrieren einen leeren Handler, damit die Fehlermeldung verschwindet
        try {
            window.pixelStreaming.addResponseEventListener("XRButtonTouchReleased", function(){});
            console.log("✅ XR-Handler registriert (Fehler unterdrückt).");
        } catch(e) {
            console.warn("Konnte XR Handler noch nicht registrieren, versuche es später.");
        }
    } else {
        setTimeout(registerXRHandler, 1000);
    }
}
registerXRHandler();


// ===============================================
// FIX: MOUSE COORDINATE CORRECTION
// ===============================================

function fixMouseCoordinates() {
    const videoElement = document.querySelector('#streamingVideo, #player video, .ui-image video');
    
    if (!videoElement) {
        console.log("❌ Kein Video-Element gefunden für Mouse-Fix");
        return;
    }
    
    console.log("🔧 Mouse Coordinate Fix aktiviert für:", videoElement);
    
    // 1. Video-Skalierung berechnen
    function getVideoScale() {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        const displayWidth = videoElement.clientWidth;
        const displayHeight = videoElement.clientHeight;
        
        if (!videoWidth || !videoHeight) {
            return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
        }
        
        // Berechne Skalierung basierend auf object-fit: fill
        const scaleX = displayWidth / videoWidth;
        const scaleY = displayHeight / videoHeight;
        
        return {
            scaleX: scaleX,
            scaleY: scaleY,
            offsetX: 0,
            offsetY: 0
        };
    }
    
    // 2. Event-Listener für Maus-Events hinzufügen
    function addMouseListeners() {
        // Override für PixelStreaming's mouse event handler
        if (window.pixelStreaming && window.pixelStreaming.config) {
            const originalOnMouseMove = window.pixelStreaming.config.onMouseMove;
            
            if (originalOnMouseMove) {
                window.pixelStreaming.config.onMouseMove = function(x, y, deltaX, deltaY) {
                    const scale = getVideoScale();
                    
                    // Koordinaten transformieren
                    const correctedX = x / scale.scaleX;
                    const correctedY = y / scale.scaleY;
                    
                    // Ursprüngliche Funktion mit korrigierten Koordinaten aufrufen
                    originalOnMouseMove.call(this, correctedX, correctedY, deltaX, deltaY);
                };
                
                console.log("✅ Mouse-Move Handler korrigiert");
            }
            
            // Auch Mouse-Down und Mouse-Up korrigieren
            ['onMouseDown', 'onMouseUp'].forEach(eventName => {
                if (window.pixelStreaming.config[eventName]) {
                    const originalHandler = window.pixelStreaming.config[eventName];
                    
                    window.pixelStreaming.config[eventName] = function(button, x, y) {
                        const scale = getVideoScale();
                        
                        // Koordinaten transformieren
                        const correctedX = x / scale.scaleX;
                        const correctedY = y / scale.scaleY;
                        
                        // Ursprüngliche Funktion aufrufen
                        originalHandler.call(this, button, correctedX, correctedY);
                    };
                }
            });
        }
    }
    
    // 3. Wait for video to be ready
    if (videoElement.readyState >= 1) {
        addMouseListeners();
    } else {
        videoElement.addEventListener('loadedmetadata', addMouseListeners);
    }
    
    // 4. Auch auf Resize reagieren
    window.addEventListener('resize', function() {
        setTimeout(addMouseListeners, 100);
    });
}

// 5. Fix nach PixelStreaming Initialisierung anwenden
function applyMouseFixAfterLoad() {
    // Warte auf PixelStreaming
    const checkInterval = setInterval(() => {
        if (window.pixelStreaming && document.querySelector('video')) {
            clearInterval(checkInterval);
            setTimeout(fixMouseCoordinates, 500);
        }
    }, 500);
    
    // Timeout nach 10 Sekunden
    setTimeout(() => {
        clearInterval(checkInterval);
        if (document.querySelector('video')) {
            fixMouseCoordinates();
        }
    }, 10000);
}

// 6. Bei Start aufrufen
document.addEventListener('DOMContentLoaded', applyMouseFixAfterLoad);

// 7. Auch nach dem Starten von RealityStream
function attachFixToRealityStream() {
    const originalStartFunc = window.startPixelStreaming;
    
    if (originalStartFunc) {
        window.startPixelStreaming = function() {
            originalStartFunc.call(this);
            
            // Fix nach 3 Sekunden anwenden (wenn das Video lädt)
            setTimeout(() => {
                if (document.querySelector('#furioos_container:not(.hide)')) {
                    fixMouseCoordinates();
                }
            }, 3000);
        };
    }
}

attachFixToRealityStream();