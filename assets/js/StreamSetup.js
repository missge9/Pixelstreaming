//StreamSetup.js
const _projectName = __ProjectName;
let   instance_ID;
let   ipAdresse;
let   time;
let   canClick = true;

// Primär: WSS, mit Fallback auf polling
const socket = io("https://rs.dvdarch.ch", {
  path: "/socket.io",          // Standard-Pfad (ggf. anpassen)
  transports: ["websocket", "polling"],
  rememberUpgrade: false,      // erzwingt Probe statt „merken“
  timeout: 20000,              // 20s Connect-Timeout
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  withCredentials: false       // falls Cookies/Session nicht nötig
});

socket.on("connect_error", (err) => {
  console.warn("Socket connect_error:", err && err.message);
  if (!socket.io.opts || socket.io.opts.transports.indexOf("polling") === -1) {
    console.warn("Retry with polling-only…");
    try { socket.close(); } catch(e){}
    const s2 = io("https://rs.dvdarch.ch", {
      path: "/socket.io",
      transports: ["polling"],      // <-- erzwingt Long-Polling (HTTPS)
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
  }
});

function startPixelStreaming() {
  
  // -------------------------------------------------------------
  // LOKALER MODUS
  // -------------------------------------------------------------
  if (typeof USE_LOCAL_CONNECTION !== 'undefined' && USE_LOCAL_CONNECTION === true) { 
      console.log("🔌 LOKALER MODUS AKTIV: Verbinde mit 127.0.0.1...");
      updateGradient(0);
      if(currentCheckpoint !=1){
        currentCheckpoint = 1;
        clearInterval(LoadIntervall); 
        startFakeLoading();
      }
      ipAdresse = "ws://127.0.0.1:80"; 
      console.log("Lokale IP gesetzt:", ipAdresse);
      $("#publicip").val(ipAdresse);
      window.setIPAdresse(ipAdresse); 
      
      // FIX: Nur EIN Intervall
      if (window.StartIntervallID) clearInterval(window.StartIntervallID);
      window.StartIntervallID = setInterval(window.initApplication, 1000); 
      
      return; 
  }

  // -------------------------------------------------------------
  // AWS MODUS
  // -------------------------------------------------------------
 
    const apiUrl = "https://rs.dvdarch.ch/start-ec2-instance";
    updateGradient(0);
    console.log("---------Start Realitystream (AWS)-------------");
    
    fetch(apiUrl, { 
      method: 'POST',
      body: JSON.stringify({ProjectName: _projectName}), 
      headers:{ 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      
      if(currentCheckpoint !=1){
        currentCheckpoint = 1;
        clearInterval(LoadIntervall); 
        startFakeLoading();
      }
      
      instance_ID = data.instance_ID;
      time = data.time
      console.log(data.instance_ID);
      console.log(time);

      // --- URL SYNTAX ---
      ipAdresse = "wss://rs.dvdarch.ch/" + data.instance_ID + "/?hoveringMouse=true&ForceTURN=true&StreamerId=DefaultStreamer&AllowPixelStreamingCommands=true";
      
      $("#publicip").val(ipAdresse);
      window.setIPAdresse(ipAdresse); 

      // --- WICHTIGER FIX: INTERVALL BEREINIGUNG ---
      
      // Falls noch ein altes Intervall läuft -> stoppen
      if (window.StartIntervallID) clearInterval(window.StartIntervallID);

      // Zähler für die Handshake-Versuche
      let retryCount = 0;

      // Wir starten NUR das intelligente Intervall (alle 1s)
      window.StartIntervallID = setInterval(function() {
          
          // Nur am Anfang loggen, um Konsole sauber zu halten
          if (retryCount === 0) {
              console.log("Versuche Verbindung aufzubauen...");
              window.initApplication();
          }
          
          // Prüfung: Läuft Pixel Streaming?
          const video = document.querySelector('video');
          
          // readyState >= 2 bedeutet: Wir haben Daten und können etwas sehen
          if (video && video.readyState >= 2 && !video.paused) { 
              
              // Sicherheitscheck: Funktion existiert?
              if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
                  
                  // Wir erhöhen den Zähler
                  retryCount++;
                  
                  console.log("📡 Stream läuft! Sende 'ClientReady' (Versuch " + retryCount + ")...");
                  window.pixelStreaming.emitUIInteraction("ClientReady");

                  // --- LOGIK: WANN STOPPEN WIR? ---
                  // 1. Wenn wir sehen, dass Menüs da sind (Unreal hat geantwortet!)
                  //    Wir prüfen 'receivedMenus' aus der indexBrowserified.js
                  // 2. ODER: Wenn wir es mehr als 8 Mal versucht haben (Timeout/Sicherheit)
                  
                  var unrealHasAnswered = (typeof receivedMenus !== 'undefined' && receivedMenus.length > 1); 

                  if (unrealHasAnswered || retryCount > 8) {
                      console.log("✅ Verbindung bestätigt oder Timeout erreicht. Stoppe Handshake.");
                      
                      // Zur Sicherheit Tools entsperren (aber noch nicht anzeigen!)
                      unlockTools(); 
                      
                      // Intervall stoppen -> WICHTIG!
                      clearInterval(window.StartIntervallID); 
                  }
              } else {
                  console.log("⏳ Warte auf PixelStreaming Objekt...");
              }
          }
      }, 1000);
      
    })
    .catch(error => {
      console.error(error);
      canClick = true;
      $("#btn3D").removeClass("loading");
        $("#btn3D").removeAttr("disabled");
      if( $("#btn3D").hasClass("clicked"))
        $("#btn3D").removeClass("clicked");
      else $("#btn3D").addClass("clicked");

      $("#btn3D .ui-button__text").html("Um sich frei bewegen zu können klicken <br />Sie hier um RealityStream zu laden");
      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop14");
      $(".show3dtool").removeClass("buttonMenuMarginTop14");
      $(".ui-sidebar__actions").addClass("buttonMenuMarginTop9");
      $(".show3dtool").addClass("buttonMenuMarginTop9");
      $(".show3dtool").removeClass("RundgangButton");    
      $("#jBox2 .jBox-content").html('RealityStream ist eine Online App in der Sie sich frei im Projekt bewegen können. Ausserdem gibt es verschiedene Elemente wie z.B. Sonnenstand, Materialien, Möbel, usw. die Sie konfigurieren können.');
      toastr.info ("Leider sind alle Server im Moment besetzt. Bitte versuchen Sie es in ein paar Minuten erneut.");
      clearInterval(LoadIntervall);
      updateGradient(100);
    });
    canClick = false;
  }


function reconectPixelStreaming(){
  console.log("---------------Reconect------------------------");
  startStream();
}

function callAFK() {
  const apiUrl = "https://rs.dvdarch.ch/AFK";
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) { throw new Error("API-Anfrage fehlgeschlagen!"); }
      return response.json();
    })
    .then(data => { console.log(data); })
    .catch(error => { console.error("Fehler beim API-Aufruf:", error); });
}

// -----------------------------------------------------------
// ÄNDERUNG: Diese Funktion darf das Menü NICHT anzeigen
// -----------------------------------------------------------
function unlockTools() {
    console.log("🔓 Tools werden freigeschaltet (JS Force) - WARTEN AUF START-KLICK.");
    
    // WIR KOMMENTIEREN DAS AUS, damit es nicht sofort aufploppt:
    // const rightSidebar = document.getElementById('ui-sidebar-right');
    // const rightToggle = document.getElementById('toggle-right-btn');
    // if (rightSidebar) rightSidebar.style.setProperty("display", "flex", "important");
    // if (rightToggle) rightToggle.style.setProperty("display", "flex", "important");
}

function showRightSidebar() {
    // AUCH HIER: Auskommentiert, damit nichts automatisch aufgeht
    /*
    const sidebar = document.getElementById('ui-sidebar-right');
    const toggleBtn = document.getElementById('toggle-right-btn');
    if (sidebar && sidebar.style.display !== 'flex') {
        sidebar.style.setProperty('display', 'flex', 'important');
        toggleBtn.style.setProperty('display', 'flex', 'important');
        console.log("✅ Erste Nachricht von Unreal erhalten: Tools wurden eingeblendet.");
    }
    */
}