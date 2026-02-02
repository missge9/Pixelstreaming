var bStart = false;
var instanceId ;

var StopTimeoutId = null;
var NotReconect = true; 

var complatedTitile ='RealityStream ist bereit! <br />Klicken Sie hier um zu starten.';

console.log("--😈😈DO NOT STEAL OUR CODE😈😈--");
console.log(
`   RRRRRRRRRRRRRRRRR      SSSSSSSSSSSSSSS 
   R::::::::::::::::R   SS:::::::::::::::S
   R::::::RRRRRR:::::R S:::::SSSSSS::::::S
   RR:::::R     R:::::RS:::::S     SSSSSSS
     R::::R     R:::::RS:::::S            
     R::::R     R:::::RS:::::S            
     R::::RRRRRR:::::R  S::::SSSS         
     R:::::::::::::RR    SS::::::SSSSS    
     R::::RRRRRR:::::R     SSS::::::::SS  
     R::::R     R:::::R       SSSSSS::::S 
     R::::R     R:::::R            S:::::S
     R::::R     R:::::R            S:::::S
   RR:::::R     R:::::RSSSSSSS     S:::::S
   R::::::R     R:::::RS::::::SSSSSS:::::S
   R::::::R     R:::::RS:::::::::::::::SS 
   RRRRRRRR     RRRRRRR SSSSSSSSSSSSSSS`
);
console.log("--😈😈AND PLEASE DON'T HACK US😈😈--");
console.log("");

$(".ui-sidebar__list-item").on("click",function(){
  console.log("Hello");
  $(".ui-sidebar__list-item").removeClass("active");
  $(this).addClass("active");
  if(__EventType === EventTypeEnum.E360){
    $("#iframe360").attr("src", $(this).attr("link360"));
  }
})

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

function btn3DClickEvent(){
  var _thisButton  =  $('#btn3D');
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
      //setTimeout(resizePlayerStyle, 10);
      $("#furioos_container").focus();
      if(_thisButton.hasClass("clicked"))
        _thisButton.removeClass("clicked");
      else _thisButton.addClass("clicked");
      $("#btn3D").removeClass("completeButton");
      // $("#btn3D").removeClass("completeButton");
      $("#furioos_container").removeClass("hide");
      $("#iframe360").addClass("hide");
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
        

        // Sie können jetzt eine normale for-Schleife verwenden, um die Elemente zu entfernen
        for (let i = 0; i < videoElements.length - 1; i++) {
            videoElements[i].remove();
        }

        for (let i = 0; i < audioElements.length - 1; i++) {
          audioElements[i].remove();
        }

        window.resizePlayer();

      }, 400); 

      setTimeout(function() {
        // Klicken Sie auf das verbleibende videoElement, wenn es existiert
        
        if (videoParentElement.length > 0) {
          var videoElement = videoParentElement[0]; // Nehmen wir das erste gefundene Element
        
          // Erstellt ein mousedown-Event und löst es auf dem Element aus
          var mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          videoElement.dispatchEvent(mousedownEvent);
        
          // Erstellt ein mouseup-Event und löst es auf dem Element aus
          var mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          videoElement.dispatchEvent(mouseupEvent);
        }
      }, 600); 

      
    };break;
    case ButtonStateEnum.E360:{
      //CODE///
      NotReconect = false;
      __ButtonState = ButtonStateEnum.EPrepare;
      __EventType = EventTypeEnum.E360;
      if(_thisButton.hasClass("clicked"))
      _thisButton.removeClass("clicked");
      else _thisButton.addClass("clicked");


      $("#iframe360").removeClass("hide");
      $("#furioos_container").addClass("hide");
      $("#iframe360").attr("src", __360MainPage);
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
let checkpointIntervals = [10, 300, 800, 600, 100]; 
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

/*
setTimeout(() => {
  currentCheckpoint = 0;
  console.log(currentCheckpoint);
    startFakeLoading();
}, 3000);

// Beispiel: Setzen Sie den zweiten Checkpoint nach 6 Sekunden auf true
setTimeout(() => {
  currentCheckpoint = 1;
  console.log(currentCheckpoint);
    startFakeLoading();
}, 6000);

// Beispiel: Setzen Sie den dritten Checkpoint nach 9 Sekunden auf true
setTimeout(() => {
  currentCheckpoint = 2;
    console.log(currentCheckpoint);
    startFakeLoading();
}, 12000);

// Beispiel: Setzen Sie den dritten Checkpoint nach 9 Sekunden auf true
setTimeout(() => {
  currentCheckpoint = 3;
    console.log(currentCheckpoint);
    startFakeLoading();
}, 15000);
*/