var EventTypeEnum;
var ButtonStateEnum;
var __EventType;
var __ButtonState;
var __360MainPage;
var __InstanceIds;
var __AccessUser;
var __APIHost;
var __ProjectName;
(function ($) {houseDetailJson = [
    {
        "name": "Haus B",
        "detail": "PDF Herunterladen",
        "area"              : "175.37 m²",
        "zi"                : "5.5 Zi",
        "money"             : "",
        "unique"            : "00*",
        "enterunique"       : "00+",
        "leaveunique"       : "00-",
        "HTMVal"            : "0",
        "url"               : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf%20Grundrisse.pdf",
        "link360"           : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf.html?s=pano753&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name"              : "Haus C",
        "detail"            : "PDF Herunterladen",
        "area"              : "174.79 m²",
        "zi"                : "5.5 Zi",
        "money"             : "",
        "unique"            : "01*",
        "enterunique"       : "01+",
        "leaveunique"       : "01-",
        "HTMVal"            : "1",
        "url"               : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf%20Grundrisse.pdf",
        "link360"           : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf.html?s=pano756&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "Reseviert" 
    },
    {
        "name": "Haus D",
        "detail": "PDF Herunterladen",
        "area"              : "175.37 m²",
        "zi"                : "5.5 Zi",
        "money"             : "",
        "unique"            : "02*",
        "enterunique"       : "02+",
        "leaveunique"       : "02-",
        "HTMVal"            : "2",
        "url"               : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf%20Grundrisse.pdf",
        "link360"           : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf.html?s=pano759&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "Reseviert" 
    },
    {
        "name": "Haus E",
        "detail": "PDF Herunterladen",
        "area"              : "175.52 m²",
        "zi"                : "5.5 Zi",
        "money"             : "",
        "unique"            : "03*",
        "enterunique"       : "03+",
        "leaveunique"       : "03-",
        "HTMVal"            : "3",
        "url"               : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf%20Grundrisse.pdf",
        "link360"           : "https://www.dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf.html?s=pano762&skipintro=true",
        "Status": "0",
        "StatusText" : "Reseviert" 
    }
];EventTypeEnum = {
E360: "360",
E3D: "3D"
};
ButtonStateEnum = {
EPrepare: "Prepare",
ELoadding: "Loading",
ELoaddingComplated: "LoaddingComplated",
E360: "360State"
};
__360MainPage = "https://dvdarch.ch/Hosting/Oberrohrdorf/Oberrohrdorf.html";
__ProjectName = "Knecht";
})(jQuery)