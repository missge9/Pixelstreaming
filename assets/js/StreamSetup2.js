const _projectName = __ProjectName;// 'Knecht_Machtmaker_Test';
let   instance_ID;
let   ipAdresse;
let   time;
let   canClick = true;

const socket = io.connect('https://rs.dvdarch.ch/');



function startPixelStreaming() {
  // API-URL
  if(canClick){
    const apiUrl = "https://rs.dvdarch.ch/start-ec2-instance";
    updateGradient(0);
    console.log("---------Start Realitystream-------------");
    // API-Anfrage senden
    fetch(apiUrl, { 
      method: 'POST',
      body: JSON.stringify({ProjectName: _projectName}), 
      headers:{
        'Content-Type': 'application/json'
      }
    })

    .then(response => response.json())
    .then(data => {
      // Pixel Streaming-URL aus der API-Antwort extrahieren
      if(currentCheckpoint !=1){
        currentCheckpoint = 1;
        clearInterval(LoadIntervall); 
        startFakeLoading();
      }
      
      instance_ID = data.instance_ID;
      time = data.time
      console.log(data.instance_ID);
      console.log(time);

      ipAdresse =  "wss://rs.dvdarch.ch/" + data.instance_ID + "/?hoveringMouse=true/?StreamerId=DefaultStreamer";
      $("#publicip").val(ipAdresse);

      window.setIPAdresse(ipAdresse); // Ruft die Setter-Funktion auf
      window.StartIntervallID = setInterval(window.initApplication, 10000);
      
    })

    .catch(error => {
      console.error(error);
      
      // NotReconect = false;
      __ButtonState = ButtonStateEnum.EPrepare;
      __EventType = EventTypeEnum.E360;
      // var _thisButton  =  $('#btn3D');
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
}

function reconectPixelStreaming(){
  console.log("---------------Reconect------------------------");
  startStream();
}

function callAFK() {
  // Die URL der API
  const apiUrl = "https://rs.dvdarch.ch/AFK";

  // Fetch-API-Aufruf
  fetch(apiUrl)
    .then(response => {
      // Prüfe, ob die Anfrage erfolgreich war (Statuscode 200)
      if (!response.ok) {
        throw new Error("API-Anfrage fehlgeschlagen!");
      }
      // Extrahiere die JSON-Daten aus der Antwort
      return response.json();
    })
    .then(data => {
      // Verarbeite die erhaltenen Daten
      console.log(data); // Hier kannst du die Daten verwenden oder weiter verarbeiten
    })
    .catch(error => {
      console.error("Fehler beim API-Aufruf:", error);
    });
}


async function ShutdownInstance(){
  const projectData = "xxxx";
  try {
      const response = await fetch("https://rs.dvdarch.ch/stopInstance", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({instanceIds: instance_ID, ProjectName: _projectName})
      });

      if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht erfolgreich');
      }
  } catch (error) {
      console.error('Es ist ein Fehler aufgetreten:', error);
  }
}