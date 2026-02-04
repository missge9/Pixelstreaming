// ==========================================
// KONFIGURATION: LOKAL ODER AWS
// true  = Verbinde mit lokalem PC (127.0.0.1)
// false = Verbinde mit AWS / Server
var USE_LOCAL_CONNECTION = false; 
// ==========================================

var bStart = false;
var instanceId ;

var StopTimeoutId = null;
var NotReconect = true; 

var complatedTitile ='RealityStream ist bereit! <br />Klicken Sie hier um zu starten.';
console.log("✅ MEIN JS WURDE GELADEN!");

// ===============================================
// SIDEBAR KLICK LOGIK (WOHNUNGSLISTE)
// ===============================================
$("#listItemList").on("click", ".ui-sidebar__list-item", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // verkaufte/disabled Elemente ignorieren
  if ($(this).hasClass("disabled")) return;

  // Bevorzugt link360, sonst attrUrl
  const targetUrl = $(this).attr("link360") || $(this).attr("attrUrl");

  if (__EventType === EventTypeEnum.E360) {
    // Im 360-Modus: im bestehenden Iframe laden
    if (targetUrl) {
      $("#iframe360").removeClass("hide").attr("src", targetUrl);
      $("#furioos_container").addClass("hide"); 
      
      // --- HOME BUTTON LOGIK (Schwebender Button) ---
      if (typeof __360MainPage !== 'undefined' && targetUrl !== __360MainPage) {
          $("#homePage").css("display", "flex"); 
      } else {
          $("#homePage").hide();
      }
    }
  } else {
    // Im 3D-Modus: Signal an Unreal
    const unique = $(this).attr("unique");
    if (window.pixelStreaming && unique) {
      window.pixelStreaming.emitUIInteraction(unique);
    }
  }

  // Active-State Handling
  $(".ui-sidebar__list-item").removeClass("active");
  $(this).addClass("active");
});

$(".ui-sidebar__list-item").on("click",function(){
  if(__EventType === EventTypeEnum.E360) return;
  window.pixelStreaming.emitUIInteraction($(this).attr("unique"));
})

$(".ui-sidebar__list-item").mouseenter(function(){
  if(__EventType !== EventTypeEnum.E360){
    window.pixelStreaming.emitUIInteraction($(this).attr("enterunique"));
  }
  var enterUniqueValue = $(this).attr("enterunique");
  var htmValue = getHTMValByEnterUnique(enterUniqueValue);
  updatePolygonAlpha(htmValue, 0.4);
})

$(".ui-sidebar__list-item").mouseleave(function(){
  if(__EventType !== EventTypeEnum.E360){
    window.pixelStreaming.emitUIInteraction($(this).attr("leaveunique"));
  }
  var enterUniqueValue = $(this).attr("enterunique");
  var htmValue = getHTMValByEnterUnique(enterUniqueValue);
  updatePolygonAlpha(htmValue, 0.0);
})

// Klick auf den Start-Button (Wrapper)
$('#btn3DHover').click(function(){
  updateGradient(0);
  if(__ButtonState === ButtonStateEnum.ELoadding) return;
  btn3DClickEvent();
  $("#btn3DHover").width($('#btn3D').width())
})

// ===============================================
// HOME BUTTON LOGIK (GILT FÜR BEIDE BUTTONS)
// ===============================================
$("#homePage, #sidebarHomePage").click(function() {
    
    console.log("🏠 Home-Button geklickt...");

    // 1. BEFEHL AN UNREAL SENDEN
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        console.log("📤 Sende 'home' an Unreal...");
        window.pixelStreaming.emitUIInteraction("home");

        // 2. RESET SENDEN (kurz verzögert)
        setTimeout(function() {
            console.log("🔄 Sende Reset 'NaN' an Unreal...");
            window.pixelStreaming.emitUIInteraction("NaN");
        }, 100);
    } else {
        console.warn("⚠️ Konnte nicht an Unreal senden: PixelStreaming Objekt nicht gefunden.");
    }

    // 3. Iframe zurück zur Startseite setzen
    if (typeof __360MainPage !== 'undefined') {
        $("#iframe360").attr("src", __360MainPage);
    }
    
    // 4. Den schwebenden Home-Button verstecken
    $("#homePage").hide();
    
    // HINWEIS: #sidebarHomePage wird NICHT versteckt, damit er in der Sidebar bleibt!
    
    // 5. Active Status entfernen
    $(".ui-sidebar__list-item").removeClass("active");
});

// ===============================================
// HAUPT BUTTON LOGIK (3D STARTEN / RUNDGANG)
// ===============================================
function btn3DClickEvent(){
  var _thisButton   =  $('#btn3D');
  var _iconImg      =  $("#btn3D img"); // Referenz auf das Icon für Animation

  switch(__ButtonState){
    
    // --- 1. STATUS: VORBEREITUNG (Start gedrückt) ---
    case ButtonStateEnum.EPrepare:{
      __ButtonState = ButtonStateEnum.ELoadding;
      
      // Animationen starten
      _thisButton.addClass("cursorWait");
      _iconImg.addClass("rotate-icon"); // Icon drehen lassen
      _thisButton.addClass("loading");
      
      // Text aktualisieren
      $("#btn3D .ui-button__text").html("RealityStream lädt im Hintergrund. <br /> Dies dauert ca. 1. Minute.");
      
      // Button deaktivieren
      $("#btn3D").attr("disabled","disabled");
      
      // Verbindung starten
      if(NotReconect){
        startPixelStreaming();
      }else{
        reconectPixelStreaming();
      }
      
    } ;break;
    
    // --- 2. STATUS: LÄDT NOCH ---
    case ButtonStateEnum.ELoadding:{
      if(_thisButton.hasClass("clicked"))
        _thisButton.removeClass("clicked");
      else 
        _thisButton.addClass("clicked");
      
      toastr.info (complatedTitile);
      console.log("Gedrückt1");
      resizePlayerStyle();
    };break;
    
    // --- 3. STATUS: FERTIG GELADEN (Start der Anwendung) ---
    case ButtonStateEnum.ELoaddingComplated:{
      __ButtonState = ButtonStateEnum.E360;
      console.log("Gedrückt2 - Start der Anwendung");

      // Animation stoppen
      _iconImg.removeClass("rotate-icon");

      // Hotfix: Fokus auf Player setzen (Fake-Rechtsklick)
      setTimeout(function() {
        var element = document.getElementById("videoParentElement") || document.querySelector("video");
        if (element) {
            var event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window });
            element.dispatchEvent(event);
            console.log("✅ Fake-Klick (Start) ausgeführt.");
        }
      }, 100);
      
      $("#furioos_container").focus();
      
      // Button Styles
      if(_thisButton.hasClass("clicked"))
        _thisButton.removeClass("clicked");
      else 
        _thisButton.addClass("clicked");
      
      $("#btn3D").removeClass("completeButton");
      
      // Layer umschalten
      $("#furioos_container").removeClass("hide");
      $("#iframe360").addClass("hide");
      
      // Schwebenden Home-Button verstecken
      $("#homePage").hide(); 

      // -----------------------------------------------------------
      // SIDEBAR & BUTTONS EINBLENDEN
      // -----------------------------------------------------------
      console.log("🟢 Start-Knopf gedrückt: Blende Sidebar & Buttons ein.");
      
      $("#ui-sidebar-right").attr("style", "display: flex !important");
      $("#toggle-right-btn").attr("style", "display: flex !important");
      $("#ui-sidebar-right").removeClass("collapsed");
      
      // Hier wird der Sidebar-Button sichtbar gemacht:
      $("#sidebarHomePage").show(); 
      
      $("#toggle-right-btn").html('&#9654;'); // Pfeil korrigieren
      
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 100);
      // -----------------------------------------------------------

      __EventType = EventTypeEnum.E3D;
      
      // Footer Button anpassen
      $("#btn3D .ui-button__text").html("Rundgang");
      $("#btn3D img").attr("src", "assets/image/360.png");
      $("#btn3D img").css("width","52px");
      
      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop9").addClass("buttonMenuMarginTop14");
      $(".show3dtool").removeClass("buttonMenuMarginTop9").addClass("buttonMenuMarginTop14").addClass("RundgangButton");
        
      $("#jBox2 .jBox-content").html('Um zurück zum 360° zu gelangen, klicken Sie hier');

      // Video-Elemente bereinigen (gegen Klebenbleiben)
      setTimeout(function() {
        var videoElements = Array.from(document.querySelectorAll("#streamingVideo"));
        var audioElements = Array.from(document.querySelectorAll("#freezeFrame"));
        
        for (let i = 0; i < videoElements.length - 1; i++) videoElements[i].remove();
        for (let i = 0; i < audioElements.length - 1; i++) audioElements[i].remove();

        window.resizePlayer();
      }, 400); 

      // Weiterer Touch-Fix Versuch
      setTimeout(function() {
        var videoElement = document.querySelector("video");
        if (videoElement) {
          videoElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          videoElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        }
      }, 600); 
      
    };break;
    
    // --- 4. STATUS: ZURÜCK ZU 360 ---
    case ButtonStateEnum.E360:{
      
      NotReconect = false;
      __ButtonState = ButtonStateEnum.EPrepare;
      __EventType = EventTypeEnum.E360;
      
      if(_thisButton.hasClass("clicked"))
        _thisButton.removeClass("clicked");
      else 
        _thisButton.addClass("clicked");

      $("#iframe360").removeClass("hide");
      $("#furioos_container").addClass("hide");
      $("#iframe360").attr("src", __360MainPage);
      
      $("#homePage").hide();

      // Tools ausblenden
      console.log("🔙 Zurück zum Rundgang: Blende Tools aus.");
      $("#ui-sidebar-right").attr("style", "display: none !important");
      $("#toggle-right-btn").attr("style", "display: none !important");

      // Button zurücksetzen
      $("#btn3D img").attr("src", "assets/image/3D.png");
      $("#btn3D img").css("width","64px");
      $("#btn3D .ui-button__text").html("Um sich frei bewegen zu können klicken <br />Sie hier um RealityStream zu laden");

      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop14").addClass("buttonMenuMarginTop9");
      $(".show3dtool").removeClass("buttonMenuMarginTop14").addClass("buttonMenuMarginTop9").removeClass("RundgangButton");
      
      $("#jBox2 .jBox-content").html('RealityStream ist eine Online App in der Sie sich frei im Projekt bewegen können...');
    }
  }
}

// Timer & AFK Logic
var maxTime = 30;
var timer = maxTime;
$('body').on('keydown mousemove mousedown', function(e) {
  timer = maxTime; 
});

var intervalId = setInterval(function() {
  timer--;
  if (timer <= 0) {
    ShutdownInstance();
    clearInterval(intervalId);
  }
}, 1000*60)


function returnInitState(){
  __ButtonState = ButtonStateEnum.EPrepare;
  $("#btn3D").removeClass("cursorWait");
  $("#btn3D .ui-button__text").html("Um sich frei bewegen zu können klichen<br /> Sie hier um RealityStream zu laden");
  $("#btn3D").removeClass("loading");
  $("#btn3D").removeAttr("disabled");
}


function getHTMValByEnterUnique(value) {
  for (var i = 0; i < houseDetailJson.length; i++) {
      if (houseDetailJson[i].enterunique === value) {
          return houseDetailJson[i].HTMVal;
      }
  }
  return null;
}

// ... (oberer Teil bleibt gleich) ...

// --- VERBESSERTE PROGRESS BAR ---
function updateGradient(percentage) {
  var buttons = document.querySelectorAll('#btn3D'); 
  buttons.forEach(function(button) {
      // Orange zu Grün Verlauf
      button.style.background = 'linear-gradient(90deg, #ff9800 ' + percentage + '%, #435f1a ' + percentage + '%)';
  });
}

// Lade-Intervalle
let checkpoints = [8, 10, 95, 99, 100];
let checkpointIntervals = [10, 300, 800, 1200, 100]; 
let currentCheckpoint = 0;
let currentWidth = 0; 
let LoadIntervall; 

// ============================================================
// FIX: DIESE VARIABLEN WIEDER EINFÜGEN (DAMIT DER FEHLER VERSCHWINDET)
// ============================================================
let canchangeCheckpoint = true;
let chanChechpoint2 = true;
// ============================================================

function startFakeLoading() {
  console.log("start new checkpoint");
  if (currentCheckpoint < checkpoints.length) {
      LoadIntervall = setInterval(() => {
          if (currentWidth < checkpoints[currentCheckpoint]) {
              currentWidth++;
              updateGradient(currentWidth); 
          } 
      }, checkpointIntervals[currentCheckpoint]);
  }
}

// ... (Rest der Datei bleibt gleich) ...

// Slider Logic
function sendTimeUpdate() {
    var sliderHour = document.getElementById("slider-hour");
    var sliderDay = document.getElementById("slider-day");
    var sliderMonth = document.getElementById("slider-month");

    if (!sliderHour || !sliderDay || !sliderMonth) return;

    var h = sliderHour.value;
    var d = sliderDay.value;
    var m = sliderMonth.value;

    var displayHour = document.getElementById("val-hour");
    var displayDay = document.getElementById("val-day");
    var displayMonth = document.getElementById("val-month");

    if (displayHour) displayHour.innerText = parseFloat(h).toFixed(1) + " h";
    if (displayDay) displayDay.innerText = d;
    if (displayMonth) displayMonth.innerText = m;

    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        window.pixelStreaming.emitUIInteraction("SetTime;" + h + ";" + d + ";" + m);
    }
}

function sendToolCommand(commandName) {
    console.log("Sende Tool-Befehl: " + commandName);
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        window.pixelStreaming.emitUIInteraction(commandName);
    } else {
        console.warn("Pixel Streaming nicht verbunden.");
    }
}


// ============================================================
// UNREAL LISTENER (POLLING)
// ============================================================
function attachUnrealListener() {
    if (window.pixelStreaming) {
        console.log("🎧 PixelStreaming gefunden! Registriere Listener...");

        if (window.pixelStreaming.hasAttachedResponseListener) return;

        window.pixelStreaming.addResponseEventListener("handle_responses", function(data) {
            console.log("📨 NACHRICHT VON UNREAL:", data);

            unlockUnrealTools(); 

            var command = "";
            var jsonContent = null;

            try {
                jsonContent = JSON.parse(data);
                if (jsonContent && jsonContent.cmd) {
                    command = jsonContent.cmd;
                }
            } catch (e) {
                command = data;
            }

            console.log("🔍 Interpretierter Befehl:", command);

            if (command === "Varianten" || command === "Materialien") {
                handleUnrealMenuData(jsonContent);
            }
            else if (command === "ShowHome") {
                // Nur den schwebenden Button steuern
                $("#homePage").css("display", "block"); 
            }
            else if (command === "HideHome") {
                // Nur den schwebenden Button verstecken
                $("#homePage").hide();
            }
        });
        
        window.pixelStreaming.hasAttachedResponseListener = true;

    } else {
        setTimeout(attachUnrealListener, 100);
    }
}

attachUnrealListener();

function unlockUnrealTools() {
    var sidebar = document.getElementById("ui-sidebar-right");
    if (sidebar) {
        // console.log("🔓 Nachricht erhalten: Tools bereit.");
        window.dispatchEvent(new Event('resize'));
    }
}

// ==========================================
// DYNAMISCHE MENÜ LOGIK
// ==========================================
var receivedMenus = []; 
var currentMenuIndex = 0; 

function handleUnrealMenuData(json) {
    var existingIndex = receivedMenus.findIndex(function(m) { return m.cmd === json.cmd; });
    if (existingIndex >= 0) {
        receivedMenus[existingIndex] = json;
        currentMenuIndex = existingIndex;
    } else {
        receivedMenus.push(json);
        currentMenuIndex = receivedMenus.length - 1;
    }
    renderDynamicMenu();
}

function renderDynamicMenu() {
    var container = $("#dynamic-menu-wrapper");
    if (receivedMenus.length === 0) {
        container.hide();
        return;
    }
    container.show();

    var menuData = receivedMenus[currentMenuIndex];
    $("#menu-title").text(menuData.titel);

    var list = $("#menu-button-list");
    list.empty(); 

    if (menuData.buttons && Array.isArray(menuData.buttons)) {
        menuData.buttons.forEach(function(btn) {
            var label = (btn.text === "ButtonName") ? btn.cmd : btn.text;
            var btnHtml = `
            <button onclick="sendCategoryCommand('${menuData.cmd}', '${btn.cmd}')" 
                    style="width: 100%; padding: 8px; cursor: pointer; border: 1px solid #ccc; background: white; border-radius: 5px; font-size: 12px; font-weight: 600; color: #444; margin-bottom:5px; display: flex; align-items: center; justify-content: center;">
                ${label}
            </button>`;
            list.append(btnHtml);
        });
    }

    if (receivedMenus.length > 1) {
        $("#menu-prev-btn, #menu-next-btn").css("visibility", "visible");
    } else {
        $("#menu-prev-btn, #menu-next-btn").css("visibility", "hidden");
    }
}

$("#menu-prev-btn").click(function() {
    currentMenuIndex = (currentMenuIndex > 0) ? currentMenuIndex - 1 : receivedMenus.length - 1;
    renderDynamicMenu();
});

$("#menu-next-btn").click(function() {
    currentMenuIndex = (currentMenuIndex < receivedMenus.length - 1) ? currentMenuIndex + 1 : 0;
    renderDynamicMenu();
});

// MENÜ INIT
var toolsMenuData = {
    cmd: "Tools",
    titel: "Tools",
    buttons: [
        { text: "Distanz Messen", cmd: "DistanzMessen" }, 
        { text: "Rendering Modus", cmd: "Rendering" },
        { text: "Küche Ändern", cmd: "KuechenFarbe" },
        { text: "Flug Modus", cmd: "FlugModus" },
        { text: "Screenshot", cmd: "Screenshot" }
    ]
};

var receivedMenus = [ toolsMenuData ]; 
var currentMenuIndex = 0; 

$(document).ready(function() {
    renderDynamicMenu();
});

function sendCategoryCommand(category, command) {
    var fullCommand = category + ";" + command;
    console.log("Sende an Unreal: " + fullCommand);
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        window.pixelStreaming.emitUIInteraction(fullCommand);
    }
}