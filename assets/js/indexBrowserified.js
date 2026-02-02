//indexBrowserified.js
// ==========================================
// KONFIGURATION: LOKAL ODER AWS
// true  = Verbinde mit lokalem PC (127.0.0.1)
// false = Verbinde mit AWS / Server
var USE_LOCAL_CONNECTION = true; 
// ==========================================

var bStart = false;
var instanceId ;

var StopTimeoutId = null;
var NotReconect = true; 

var complatedTitile ='RealityStream ist bereit! <br />Klicken Sie hier um zu starten.';
console.log("✅ MEIN JS WURDE GELADEN!");

// ===============================================
// SIDEBAR KLICK LOGIK
// ===============================================
$("#listItemList").on("click", ".ui-sidebar__list-item", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // verkaufte/disabled Elemente ignorieren
  if ($(this).hasClass("disabled")) return;

  // Bevorzugt link360, sonst attrUrl (beides wird beim Erstellen gesetzt)
  const targetUrl = $(this).attr("link360") || $(this).attr("attrUrl");

  if (__EventType === EventTypeEnum.E360) {
    // Im 360-Modus: im bestehenden Iframe laden, UI unverändert lassen
    if (targetUrl) {
      $("#iframe360").removeClass("hide").attr("src", targetUrl);
      $("#furioos_container").addClass("hide"); // sicherstellen, dass 3D ausgeblendet bleibt
      
      // --- NEU: HOME BUTTON LOGIK ---
      // Wir prüfen, ob die geladene URL ungleich der Startseite ist
      if (typeof __360MainPage !== 'undefined' && targetUrl !== __360MainPage) {
          // Wir sind auf einer Unterseite -> Button anzeigen
          $("#homePage").css("display", "flex"); 
      } else {
          // Wir sind auf der Startseite -> Button weg
          $("#homePage").hide();
      }
      // -----------------------------
    }
  } else {
    // Im 3D-Modus bleibt das Verhalten wie bisher
    const unique = $(this).attr("unique");
    if (window.pixelStreaming && unique) {
      window.pixelStreaming.emitUIInteraction(unique);
    }
  }

  // Optisches Active-State Handling
  $(".ui-sidebar__list-item").removeClass("active");
  $(this).addClass("active");
});

$(".ui-sidebar__list-item").on("click",function(){
  if(__EventType === EventTypeEnum.E360) return;
  window.pixelStreaming.emitUIInteraction($(this).attr("unique"));
})

$(".ui-sidebar__list-item").mouseenter(function(){
  if(__EventType === EventTypeEnum.E360){

  }else{
    window.pixelStreaming.emitUIInteraction($(this).attr("enterunique"));
  }
  var enterUniqueValue = $(this).attr("enterunique");
  var htmValue = getHTMValByEnterUnique(enterUniqueValue);
  updatePolygonAlpha(htmValue, 0.4);
})

$(".ui-sidebar__list-item").mouseleave(function(){

  if(__EventType === EventTypeEnum.E360){

  } else{
    window.pixelStreaming.emitUIInteraction($(this).attr("leaveunique"));
  }
  var enterUniqueValue = $(this).attr("enterunique");
  var htmValue = getHTMValByEnterUnique(enterUniqueValue);
  updatePolygonAlpha(htmValue, 0.0);
})

$('#btn3DHover').click(function(){
  // $('#btn3D').click()
  updateGradient(0);
  if(__ButtonState ===ButtonStateEnum.ELoadding) return;
  btn3DClickEvent();
  $("#btn3DHover").width($('#btn3D').width())
})

// ===============================================
// HOME BUTTON LOGIK
// ===============================================
$("#homePage").click(function() {
    
    // 1. BEFEHL AN UNREAL SENDEN
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        console.log("🏠 Sende 'home' an Unreal...");
        window.pixelStreaming.emitUIInteraction("home");

        // 2. KURZ DARAUF 'NaN' SENDEN (RESET)
        // Wir warten 100ms, damit Unreal den ersten Befehl sicher "frisst"
        setTimeout(function() {
            console.log("🔄 Sende Reset 'NaN' an Unreal...");
            window.pixelStreaming.emitUIInteraction("NaN");
        }, 100);
    }

    // 3. Iframe zurück zur Startseite setzen
    if (typeof __360MainPage !== 'undefined') {
        $("#iframe360").attr("src", __360MainPage);
    }
    
    // 4. Button verstecken (wir sind ja jetzt Home)
    $(this).hide();
    
    // 5. Active Status in der Liste entfernen
    $(".ui-sidebar__list-item").removeClass("active");
});

// ===============================================
// HAUPT BUTTON LOGIK (3D STARTEN / RUNDGANG)
// ===============================================
function btn3DClickEvent(){
  var _thisButton   =  $('#btn3D');
  switch(__ButtonState){
    case ButtonStateEnum.EPrepare:{
      __ButtonState = ButtonStateEnum.ELoadding;
      _thisButton.addClass("cursorWait");
      $("#btn3D .ui-button__text").html("RealityStream lädt im Hintergrund. <br /> Dies dauert ca. 1. Minute.");
      $("#btn3D").addClass("loading");
      $("#btn3D").attr("disabled","disabled");
      if(NotReconect){
        startPixelStreaming();
      }else{
        reconectPixelStreaming();
      }
      
    } ;break;
    case ButtonStateEnum.ELoadding:{
      if(_thisButton.hasClass("clicked"))
      _thisButton.removeClass("clicked");
      else _thisButton.addClass("clicked");
      toastr.info (complatedTitile);
      console.log("Gedrückt1");
      resizePlayerStyle();
    };break;
    
    // ==========================================================
    // WICHTIG: HIER WIRD DAS MENÜ GEÖFFNET
    // ==========================================================
    case ButtonStateEnum.ELoaddingComplated:{
      __ButtonState = ButtonStateEnum.E360;
      console.log("Gedrückt2");

      //Hotfix für erste mal klicken --> immitiert einen fake klick ins player div
      setTimeout(function() {
          var elements = document.getElementsByTagName("VIDEO");
          var videoElement = elements[0];
          
          if (videoElement) {
            var event = new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true,
              view: window
            });
          
            videoElement.dispatchEvent(event);
          }
          console.log("------------//GEDRÜCKT//-------------------");
        }, 100);
      
      $("#furioos_container").focus();
      if(_thisButton.hasClass("clicked"))
        _thisButton.removeClass("clicked");
      else _thisButton.addClass("clicked");
      $("#btn3D").removeClass("completeButton");
      
      $("#furioos_container").removeClass("hide");
      $("#iframe360").addClass("hide");
      
      // Home Button verstecken (Unreal ist jetzt aktiv)
      $("#homePage").hide(); 

      // -----------------------------------------------------------
      // NEU: SIDEBAR ERST JETZT EINBLENDEN (beim Start-Klick)
      // -----------------------------------------------------------
      console.log("🟢 Start-Knopf gedrückt: Blende Sidebar jetzt ein.");
      
      // 1. Sidebar sichtbar machen (display: flex)
      $("#ui-sidebar-right").attr("style", "display: flex !important");
      $("#toggle-right-btn").attr("style", "display: flex !important");
      
      // 2. Sicherstellen, dass sie ausgeklappt ist
      $("#ui-sidebar-right").removeClass("collapsed");
      
      // 3. Pfeil-Icon korrigieren (Pfeil nach rechts = Menü ist offen)
      $("#toggle-right-btn").html('&#9654;'); 
      
      // 4. Resize feuern für Layout-Update
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 100);
      // -----------------------------------------------------------

      __EventType = EventTypeEnum.E3D;
      $("#btn3D .ui-button__text").html("Rundgang");

      $("#btn3D img").attr("src", "assets/image/360.png");
      $("#btn3D img").css("width","52px");
      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop9");
      $(".show3dtool").removeClass("buttonMenuMarginTop9");
      $(".ui-sidebar__actions").addClass("buttonMenuMarginTop14");
      $(".show3dtool").addClass("buttonMenuMarginTop14");
      $(".show3dtool").addClass("RundgangButton");
        
      $("#jBox2 .jBox-content").html('Um zurück zum 360° zu gelangen, klicken Sie hier');

      //Hotfix Kleben verhindern
      var videoParentElement = Array.from(document.querySelectorAll("#videoParentElement"));
      setTimeout(function() {
        var videoElements = Array.from(document.querySelectorAll("#streamingVideo"));
        var audioElements = Array.from(document.querySelectorAll("#freezeFrame"));
        
        for (let i = 0; i < videoElements.length - 1; i++) {
            videoElements[i].remove();
        }

        for (let i = 0; i < audioElements.length - 1; i++) {
          audioElements[i].remove();
        }

        window.resizePlayer();

      }, 400); 

      setTimeout(function() {
        if (videoParentElement.length > 0) {
          var videoElement = videoParentElement[0]; 
          var mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          videoElement.dispatchEvent(mousedownEvent);
          var mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          videoElement.dispatchEvent(mouseupEvent);
        }
      }, 600); 
      
    };break;
    
    // --- HIER WIRD ZURÜCK ZU 360 GEWECHSELT ---
    case ButtonStateEnum.E360:{
      
      NotReconect = false;
      __ButtonState = ButtonStateEnum.EPrepare;
      __EventType = EventTypeEnum.E360;
      if(_thisButton.hasClass("clicked"))
      _thisButton.removeClass("clicked");
      else _thisButton.addClass("clicked");

      $("#iframe360").removeClass("hide");
      $("#furioos_container").addClass("hide");
      $("#iframe360").attr("src", __360MainPage);
      
      // Home Button bleibt hier auch weg, da wir zur Main Page gehen
      $("#homePage").hide();

      // =======================================================
      // NEU: TOOLS AUSBLENDEN (Rechte Sidebar weg)
      // =======================================================
      console.log("🔙 Zurück zum Rundgang: Blende Tools aus.");
      $("#ui-sidebar-right").attr("style", "display: none !important");
      $("#toggle-right-btn").attr("style", "display: none !important");
      // =======================================================

      $("#btn3D img").attr("src", "assets/image/3D.png");
      $("#btn3D img").css("width","64px");
      $("#btn3D .ui-button__text").html("Um sich frei bewegen zu können klicken <br />Sie hier um RealityStream zu laden");

      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop14");
      $(".show3dtool").removeClass("buttonMenuMarginTop14");
      $(".ui-sidebar__actions").addClass("buttonMenuMarginTop9");
      $(".show3dtool").addClass("buttonMenuMarginTop9");
      $(".show3dtool").removeClass("RundgangButton");
      
      $("#jBox2 .jBox-content").html('RealityStream ist eine Online App in der Sie sich frei im Projekt bewegen können. Ausserdem gibt es verschiedene Elemente wie z.B. Sonnenstand, Materialien, Möbel, usw. die Sie konfigurieren können.');
    }
  }
}

var maxTime = 30;
var timer = maxTime;
$('body').on('keydown mousemove mousedown', function(e) {
  timer = maxTime; // reset
});

var intervalId = setInterval(function() {
  timer--;
  //三十分钟没有使用，自动关掉服务器
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
  return null; // nicht gefunden
}

function updateGradient(percentage) {
  var buttons = document.querySelectorAll('.button, .button .front, .button .back');

  buttons.forEach(function(button) {
      button.style.background = 'linear-gradient(to right, var(--bg) ' + percentage + '%, #435f1a ' + percentage + '%)';
  });
}


let checkpoints = [8, 10, 60, 95, 100];
let checkpointIntervals = [10, 300, 800, 1200, 100]; 
let currentCheckpoint = 0;
let prevCheckpoint = 0;
let currentWidth = 0; 
let LoadIntervall; 
let canchangeCheckpoint = true;
let chanChechpoint2 = true

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
inter = setInterval(() => {
  console.log("Current Checkpoint is: " + currentCheckpoint+ " checkpointIntervals: " + checkpointIntervals[currentCheckpoint]);
},2000);

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
        console.warn("Pixel Streaming nicht verbunden. Befehl konnte nicht gesendet werden:", commandName);
    }
}


// ============================================================
// FIX: Listener sofort registrieren, nicht warten! (POLLING)
// ============================================================
function attachUnrealListener() {
    if (window.pixelStreaming) {
        console.log("🎧 PixelStreaming gefunden! Registriere Listener sofort...");

        if (window.pixelStreaming.hasAttachedResponseListener) {
             console.log("⚠️ Listener war schon registriert.");
             return;
        }

        window.pixelStreaming.addResponseEventListener("handle_responses", function(data) {
            console.log("📨 NACHRICHT VON UNREAL:", data);

            unlockUnrealTools(); 

            // Wir versuchen herauszufinden, was 'data' ist
            var command = "";
            var jsonContent = null;

            try {
                // Versuch 1: Ist es JSON? (z.B. Menüs)
                jsonContent = JSON.parse(data);
                
                if (jsonContent && jsonContent.cmd) {
                    command = jsonContent.cmd;
                }
            } catch (e) {
                // Fehler beim Parsen -> Es ist kein JSON, sondern ein einfacher String!
                // Das ist okay, dann ist der String selbst der Befehl.
                command = data;
            }

            console.log("🔍 Interpretierter Befehl:", command);

            // --- LOGIK VERTEILER ---

            // 1. Menüs (Brauchen das ganze JSON Objekt)
            if (command === "Varianten" || command === "Materialien") {
                console.log("Menü erkannt: " + jsonContent.titel);
                handleUnrealMenuData(jsonContent);
            }
            
            // 2. Einfache Befehle (Home Button)
            else if (command === "ShowHome") {
                console.log("🏠 Unreal sagt: Zeige Home Button");
                $("#homePage").css("display", "block"); // oder 'flex'
            }
            else if (command === "HideHome") {
                console.log("🏠 Unreal sagt: Verstecke Home Button");
                $("#homePage").hide();
            }
        });
        
        window.pixelStreaming.hasAttachedResponseListener = true;

    } else {
        setTimeout(attachUnrealListener, 100);
    }
}

attachUnrealListener();

// ============================================================


function unlockUnrealTools() {
    var sidebar = document.getElementById("ui-sidebar-right");
    var btn = document.getElementById("toggle-right-btn");
    
    // ÄNDERUNG: Wir prüfen nur, öffnen aber NICHTS mehr hier.
    if (sidebar) {
        console.log("🔓 Erste Nachricht erhalten: Tools sind im Hintergrund bereit (warten auf Start-Klick).");
        
        // Diese Zeilen sind auskommentiert, damit es NICHT sofort aufploppt:
        // sidebar.style.setProperty("display", "flex", "important");
        // if(btn) btn.style.setProperty("display", "flex", "important");
        
        window.dispatchEvent(new Event('resize'));
    }
}


// ==========================================
// DYNAMISCHE MENÜ LOGIK
// ==========================================

var receivedMenus = []; 
var currentMenuIndex = 0; 

function handleUnrealMenuData(json) {
    var existingIndex = receivedMenus.findIndex(function(m) { 
        return m.cmd === json.cmd; 
    });

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
            
            var label = btn.text;
            if (label === "ButtonName") {
                label = btn.cmd; 
            }

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
    if (currentMenuIndex > 0) {
        currentMenuIndex--;
    } else {
        currentMenuIndex = receivedMenus.length - 1; 
    }
    renderDynamicMenu();
});

$("#menu-next-btn").click(function() {
    if (currentMenuIndex < receivedMenus.length - 1) {
        currentMenuIndex++;
    } else {
        currentMenuIndex = 0; 
    }
    renderDynamicMenu();
});

// ==========================================
// MENÜ INIT
// ==========================================

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

function handleUnrealMenuData(json) {
    var existingIndex = receivedMenus.findIndex(function(m) { 
        return m.cmd === json.cmd; 
    });

    if (existingIndex >= 0) {
        receivedMenus[existingIndex] = json;
    } else {
        receivedMenus.push(json);
    }
    renderDynamicMenu();
}

function sendCategoryCommand(category, command) {
    var fullCommand = category + ";" + command;
    console.log("Sende an Unreal: " + fullCommand);
    if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
        window.pixelStreaming.emitUIInteraction(fullCommand);
    }
}