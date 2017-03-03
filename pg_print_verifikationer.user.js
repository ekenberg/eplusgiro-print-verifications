// ==UserScript==
// @name        PlusGiro skriv ut verifikationer
// @namespace   http://ekenberg.se
// @description PlusGiro skriv ut verifikationer
// @include     https://eplusgiro.plusgirot.se/elia/account/booked/*
// @grant       none
// ==/UserScript==

//


window.addEventListener("load", function(e) {
   addButton();
}, false);

function addButton(){
   var buttonElems = document.getElementsByTagName('body');
   buttonElems[0].innerHTML = '<form id="pg_print_frm" name="pg_print_frm">'
                            + '<input id="greasemonkeyButton" type="button" value="Skriv ut verifikationer"> '
                            + 'Intervall: <input type="text" name="from_id" size=3 value="0">'
                            + '-<input type="text" name="to_id" size=3></form>'
                            + buttonElems[0].innerHTML;
   addButtonListener();
}

function addButtonListener(){
   var button = document.getElementById("greasemonkeyButton");
   button.addEventListener('click', doMonkey, true);
}

function myOpenDetailBooked(ind) {
   var link;
   var height;
   height = 580;
   if (BET_TYP[ind]=='PR' || BET_TYP[ind]=='FR'){
      if (BEL_TKN[ind]=='+'){
         link = "/elia/html/payment/prelkred.html?BDAT=" + escape(BDAT[ind]) + "&BEL=" + escape(BEL[ind]) + "&BEL_TKN=" + escape(BEL_TKN[ind]) + "&MOTT_MED=" + escape(MOTT_MED[ind]) + "&OTYP=" + escape(OTYP[ind]) + "&BET_TYP=" + escape(BET_TYP[ind]) + "&BEL=" + escape(BEL[ind]) + "&RAD_NR=" + ind;
      }
      else{
         link = "/elia/html/payment/preldeb.html?BDAT=" + escape(BDAT[ind]) + "&BEL=" + escape(BEL[ind]) + "&BEL_TKN=" + escape(BEL_TKN[ind]) + "&MOTT_MED=" + escape(MOTT_MED[ind]) + "&OTYP=" + escape(OTYP[ind]) + "&BET_TYP=" + escape(BET_TYP[ind]) + "&BEL=" + escape(BEL[ind]) + "&RAD_NR=" + ind;
      }
   }
   else{
      link = "/elia/account/booked/bgya027/det?PG_KTO_NR=" + escape(KONTO[0]) + "&FICK_VAL_KOD=" + escape(FICKA[0]) + "&KONTO_GL=" + escape(KONTO[0]) + "&FICKA_GL=" + escape(FICKA[0]) + "&OTYP=" + escape(OTYP[ind]) + "&UNIK_NKL=" + escape(UNIK_NKL[ind]) + "&FUNC=detail&KUNR=" + escape(KUNR[ind]) + "&RAD_NR=" + ind;
   }
   var winDet = window.open(link,"detailwindow","toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,width=450,height=" + height);
//   if (winDet) { if (winDet.focus) setTimeout("winDet.focus()",250); }
   return winDet;
}

function doMonkey(){
   form = document.getElementById('pg_print_frm');
   from_id = form.from_id.value;
   to_id = form.to_id.value;
   if (to_id >= BEL.length) {
      alert("Fel Till-värde, Giltigt: 0-" + BEL.length-1);
      return;
   }

   var printfunc = function(i, max) {
      if (i > max) return;
      var p = myOpenDetailBooked(i);
      if (p) {
         setTimeout(function() {
            if (p.closed) {
               printfunc(++i, max);
            }
            else {
               setTimeout(arguments.callee, 100);
            }
         }, 30000);

         p.addEventListener('load', function() {
            var testPrint = function() {
               try {
                  jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation);
                  jsPrintSetup.setPaperSizeData(9); // A4, se http://webcache.googleusercontent.com/search?q=cache:KGJK8b8iPXgJ:jsprintsetup.mozdev.org/reference.html+&cd=3&hl=sv&ct=clnk&gl=se / http://jsprintsetup.mozdev.org/reference.html
                  jsPrintSetup.clearSilentPrint();
                  jsPrintSetup.setOption('printSilent', 1);
                  jsPrintSetup.print();
                  p.close();
               }
               catch(err) {
                  setTimeout(arguments.callee, 1000);
               }
            };
            testPrint();
         });
      }
   };

   printfunc(from_id, to_id);
}

