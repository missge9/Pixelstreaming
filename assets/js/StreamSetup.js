const _projectName = __ProjectName;
let   instance_ID;
let   ipAdresse;
let   time;
let   canClick = true;

// Primär: WSS, mit Fallback auf polling
const socket = io("https://rs.dvdarch.ch", {
  path: "/socket.io",          
  transports: ["websocket", "polling"],
  rememberUpgrade: false,      
  timeout: 20000,              
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  withCredentials: false       
});

socket.on("connect_error", (err) => {
  console.warn("Socket connect_error:", err && err.message);
  if (!socket.io.opts || socket.io.opts.transports.indexOf("polling") === -1) {
    console.warn("Retry with polling-only…");
    try { socket.close(); } catch(e){}
    const s2 = io("https://rs.dvdarch.ch", {
      path: "/socket.io",
      transports: ["polling"],      
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
      
      // Reset für Ladebalken
      currentCheckpoint = 0;
      currentWidth = 0;
      updateGradient(0);
      
      if(currentCheckpoint != 1){
        currentCheckpoint = 1;
        clearInterval(LoadIntervall); 
        startFakeLoading();
      }
      
      ipAdresse = "ws://127.0.0.1:80"; 
      console.log("Lokale IP gesetzt:", ipAdresse);
      $("#publicip").val(ipAdresse);
      window.setIPAdresse(ipAdresse); 
      
      if (window.StartIntervallID) clearInterval(window.StartIntervallID);
      window.StartIntervallID = setInterval(window.initApplication, 1000); 
      
      return; 
  }

  // -------------------------------------------------------------
  // AWS MODUS
  // -------------------------------------------------------------
 
    const apiUrl = "https://rs.dvdarch.ch/start-ec2-instance";
    
    // Reset Start
    currentCheckpoint = 0;
    currentWidth = 0;
    updateGradient(0);
    console.log("---------Start Realitystream (AWS)-------------");
    
    fetch(apiUrl, { 
      method: 'POST',
      body: JSON.stringify({ProjectName: _projectName}), 
      headers:{ 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      
      // Wenn Server antwortet, Balken weiterschieben
      if(currentCheckpoint != 1){
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
      if (window.StartIntervallID) clearInterval(window.StartIntervallID);

      // Zähler für die Handshake-Versuche
      let retryCount = 0;
      let warmupStarted = false; // Verhindert mehrfaches Auslösen des Warmups

      window.StartIntervallID = setInterval(function() {
          
          if (retryCount === 0) {
              console.log("Versuche Verbindung aufzubauen...");
              window.initApplication();
          }
          
          // Prüfung: Läuft Pixel Streaming?
          const video = document.querySelector('video');
          
          if (video && video.readyState >= 2 && !video.paused) { 
              
              if (window.pixelStreaming && typeof window.pixelStreaming.emitUIInteraction === "function") {
                  
                  retryCount++;
                  
                  console.log("📡 Stream läuft! Sende 'ClientReady' (Versuch " + retryCount + ")...");
                  window.pixelStreaming.emitUIInteraction("ClientReady");

                  var unrealHasAnswered = (typeof receivedMenus !== 'undefined' && receivedMenus.length > 1); 

                  // Wenn Verbindung steht ODER Timeout erreicht ist:
                  if (unrealHasAnswered || retryCount > 8) {
                      
                      // --- WARMUP LOGIK (15 SEKUNDEN) ---
                      if (!warmupStarted) {
                          warmupStarted = true;
                          console.log("✅ Verbindung bestätigt. Starte 15s Warmup...");
                          
                          // Text aktualisieren, damit User weiss, dass es gleich losgeht
                          $("#btn3D .ui-button__text").html("Verbindung hergestellt.<br />App wird initialisiert...");
                          
                          // 15 Sekunden warten
                          setTimeout(function() {
                              console.log("⏱️ Warmup beendet. App ist bereit.");
                              unlockTools(); 
                              clearInterval(window.StartIntervallID); 
                              setClientReadyState(); // Neue Funktion: Button freigeben
                          }, 15000); 
                      }
                  }
              } else {
                  console.log("⏳ Warte auf PixelStreaming Objekt...");
              }
          }
      }, 1000);
      
    })
    .catch(error => {
      // ======================================================
      // FEHLERBEHANDLUNG
      // ======================================================
      console.error("Fehler beim Starten:", error);
      canClick = true;
      
      // 1. WICHTIG: Status zurücksetzen
      if(typeof ButtonStateEnum !== 'undefined') {
          __ButtonState = ButtonStateEnum.EPrepare;
      }

      // 2. Button Reset
      $("#btn3D").removeClass("loading");
      $("#btn3D").removeClass("cursorWait"); 
      $("#btn3D").removeAttr("disabled");
      
      // 3. Icon Rotation stoppen
      $("#btn3D img").removeClass("rotate-icon");

      // 4. Klick-Status Logik
      if( $("#btn3D").hasClass("clicked"))
        $("#btn3D").removeClass("clicked");
      else $("#btn3D").addClass("clicked");

      // 5. Text Reset
      $("#btn3D .ui-button__text").html("Um sich frei bewegen zu können klicken <br />Sie hier um RealityStream zu laden");
      
      $(".ui-sidebar__actions").removeClass("buttonMenuMarginTop14");
      $(".show3dtool").removeClass("buttonMenuMarginTop14");
      $(".ui-sidebar__actions").addClass("buttonMenuMarginTop9");
      $(".show3dtool").addClass("buttonMenuMarginTop9");
      $(".show3dtool").removeClass("RundgangButton");    
      
      $("#jBox2 .jBox-content").html('RealityStream ist eine Online App...');
      
      toastr.info ("Leider sind alle Server im Moment besetzt. Bitte versuchen Sie es in ein paar Minuten erneut.");
      
      // 7. Ladebalken STOPPEN und HINTERGRUND ENTFERNEN
      if(LoadIntervall) clearInterval(LoadIntervall);
      currentWidth = 0;      
      currentCheckpoint = 0; 
      $("#btn3D").css("background", ""); 
    });
    canClick = false;
  }

// --- NEUE FUNKTION: Wird nach dem 15s Warmup aufgerufen ---
function setClientReadyState() {
    // Status auf "Fertig geladen" setzen
    if(typeof ButtonStateEnum !== 'undefined') {
        __ButtonState = ButtonStateEnum.ELoaddingComplated;
    }
    
    $("#btn3D").removeClass("cursorWait");
    $("#btn3D").removeClass("loading");
    $("#btn3D").removeAttr("disabled");
    
    // Icon Animation stoppen
    $("#btn3D img").removeClass("rotate-icon");

    // Fertig-Text
    $("#btn3D .ui-button__text").html("RealityStream ist bereit! <br />Klicken Sie hier um zu starten.");
    
    // Klasse für den fertigen Zustand (oft grün oder ähnlich definiert)
    if(!$("#btn3D").hasClass("completeButton")) {
        $("#btn3D").addClass("completeButton");
    }
    
    // Ladebalken auf 100% zwingen
    if(typeof LoadIntervall !== 'undefined') clearInterval(LoadIntervall);
    updateGradient(100); 
    
    // Sound oder Toast optional
    toastr.info ("RealityStream ist bereit! Klicken Sie hier um zu starten.");
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

function unlockTools() {
    console.log("🔓 Tools werden freigeschaltet (JS Force) - WARTEN AUF START-KLICK.");
}

function showRightSidebar() {
    // Auskommentiert um automatisches Öffnen zu verhindern
}

// --- FIX: TOUCH SIMULATION DEAKTIVIEREN ---
setInterval(function() {
    if (typeof inputOptions !== 'undefined') {
        if (inputOptions.fakeMouseWithTouches === true) {
            console.log("🚫 Touch-Simulation durch User-Script blockiert.");
            inputOptions.fakeMouseWithTouches = false;
        }
    }
}, 1000);