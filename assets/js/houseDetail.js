//houseDetail.js
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
        "name": "Haus A EG West",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "00*",
        "enterunique"       : "00+",
        "leaveunique"       : "00-",
        "HTMVal"            : "15",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano882&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano882&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A 1.Og West",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "01*",
        "enterunique"       : "01+",
        "leaveunique"       : "01-",
        "HTMVal"            : "14",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano876&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano876&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A 2.Og West",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "02*",
        "enterunique"       : "02+",
        "leaveunique"       : "02-",
        "HTMVal"            : "13",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano878&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano878&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A DG West",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "03*",
        "enterunique"       : "03+",
        "leaveunique"       : "03-",
        "HTMVal"            : "12",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano880&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano880&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A EG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "04*",
        "enterunique"       : "04+",
        "leaveunique"       : "04-",
        "HTMVal"            : "11",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano881&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano881&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A 1.OG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "05*",
        "enterunique"       : "05+",
        "leaveunique"       : "05-",
        "HTMVal"            : "10",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano875&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano875&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
        {
        "name": "Haus A 2.OG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "06*",
        "enterunique"       : "06+",
        "leaveunique"       : "06-",
        "HTMVal"            : "9",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano877&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano877&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus A DG West",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "07*",
        "enterunique"       : "07+",
        "leaveunique"       : "07-",
        "HTMVal"            : "8",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano879&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano879&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B EG Ost ",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "08*",
        "enterunique"       : "08+",
        "leaveunique"       : "08-",
        "HTMVal"            : "7",
        "url"               : "hhttps://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano890&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano890&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B 1.OG Ost ",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "09*",
        "enterunique"       : "09+",
        "leaveunique"       : "09-",
        "HTMVal"            : "6",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano883&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano883&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B 2.OG Ost ",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "10*",
        "enterunique"       : "10+",
        "leaveunique"       : "10-",
        "HTMVal"            : "5",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano886&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano886&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B DG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "11*",
        "enterunique"       : "11+",
        "leaveunique"       : "11-",
        "HTMVal"            : "1",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano888&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano888&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B EG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "12*",
        "enterunique"       : "12+",
        "leaveunique"       : "12-",
        "HTMVal"            : "4",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano889&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano889&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B 1.OG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "13*",
        "enterunique"       : "13+",
        "leaveunique"       : "13-",
        "HTMVal"            : "3",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano884&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano884&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B 2.OG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "14*",
        "enterunique"       : "14+",
        "leaveunique"       : "14-",
        "HTMVal"            : "2",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano885&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano885&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
    },
    {
        "name": "Haus B DG Ost",
        "detail": "",
        "area"              : "",
        "zi"                : "",
        "money"             : "",
        "unique"            : "15*",
        "enterunique"       : "15+",
        "leaveunique"       : "15-",
        "HTMVal"            : "0",
        "url"               : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano887&skipintro=true",
        "link360"           : "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html?s=pano887&skipintro=true",
        "Status"            : "0",
        "StatusText"        : "verkauft" 
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
__360MainPage = "https://www.dvdarch.ch/Hosting/AeschlenstrasseRS.html";
__ProjectName = "Sigriswil";
})(jQuery)
