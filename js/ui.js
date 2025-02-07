/*

	@ File : ui.js
	@ Author : Hassen Chougar, Service Cartographie du CGET
	@ Date : 08/2019

	@ For : ViZonage - Carte interactive des contrats et zonages de politiques publiques
	@ Main file : index.html

	@ Description : script nécessaire à la gestion dynamique de certains éléments
                  d'interface : sidebar, sidepanel, boutons sidebar, fiche
                  territoire, checkboxes, popup "à propos".
                  Certaines des fonctions présentes dans ce fichier sont
                  également appelées au sein du ficher layer_management.js :
                   -> showContent();
                   -> showFiche() et hideFiche();
                   -> showFiche() et hideFiche();

                 A manipuler avec précaution.
*/

/******************************************************************************/
/************************ INTERACTION PANNEAU LATERAL *************************/
/******************************************************************************/
// sidebar buttons
var homeBtn = document.getElementById('homeBtn');
var closeBtn = document.getElementById('closeContent');
// var donwload = document.getElementById('download');
// elements to toggle
var panel =  document.getElementById('sidebar-panel');
var intro = document.getElementById("intro");
var listeZonages = document.getElementById('cat-zonages');
let featureInfo = document.getElementById("ficheTerritoire");

// attributs css
// largeur du panneau latéral
let panelLenght = '600px'
// ouvrir la fenetre latérale au chargement
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        panelSlide();
        clearInterval(interval);
      }
    }, 2000);

// sur chaque bouton, appliquer la fonction pour fermer le panneau latéral
[homeBtn,closeBtn].forEach(function (btn) {
  btn.addEventListener('click', function() {
    showContent();
    hideFiche();
  });
})


function showContent() {
  if (panel.style.width === '0px') {
    panelSlide();
  } else {
    closeBtn.style.transform = 'rotate(-180deg)';
    panel.style.width = '0px';
    document.getElementById('legend').style.marginLeft = '70px'
    let t = setInterval(function() {
      mymap.setZoom(6.458);
      mymap.setView([46.5, 3]);
      clearInterval(t)
    },0);
  }
};

function panelSlide() {
  closeBtn.style.transform = 'rotate(0deg)';
  panel.style.width = panelLenght;
  document.getElementById('legend').style.marginLeft = '620px'
  // déplacement du centre de la carte
  let t = setInterval(function() {
    mymap.setView([46.5, -2])
    clearInterval(t)
  },0);
  if (panel.style.width === panelLenght) {
    let x = setInterval(function () {
      if (featureInfo.style.display == "block") {
        listeZonages.style.display = 'none';
      } else {
        listeZonages.style.display = 'block'
      }
      clearInterval(x)
    },50);
  }
};



/******************************************************************************/
/************************** MENUS CONTRATS/ZONAGES ****************************/
/******************************************************************************/

let expandBtn = document.querySelectorAll('button.expandBtn');
let descriptions = document.querySelectorAll('.description');
// let expandBtn = document.querySelectorAll('button.expandBtn');
// style description
let descriptionStyle = 'rgba(0,0,0,0.35)';

expandBtn.forEach(btn => {
  btn.addEventListener('click', function(e) {
    // le nom de classe devient 'expandBtn collapsed'
    let setClasses = !this.classList.contains('collapsed')
    setClass(expandBtn,'collapsed','remove')
    setClass(descriptions,'show','remove')
    if (setClasses) {
      this.classList.toggle('collapsed');
      // récupère l'élément situé après le bouton dans le html [div description]
      this.nextElementSibling.classList.toggle('show')
    }
  })
});

// expandBtn.forEach(btn => {
//   btn.addEventListener('click', function(e) {
//     // récupère l'élément situé après le bouton dans le html [div description]
//     let description = this.nextElementSibling;
//     // contrôle le css du bouton : en déroulant, le bouton devient un "-"
//     this.classList.toggle('collapsed');
//     // le nom de classe devient 'expandBtn collapsed'
//     if (this.className == 'expandBtn collapsed') {
//       description.style.maxHeight = '400px';
//       this.parentNode.style.background = descriptionStyle;
//     } else {
//       description.style.maxHeight = '0px'
//       this.parentNode.style.background = ''
//     }
//   })
// });

function setClass(els, className, fnName) {
    for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
    }
}

// rendu des balises <li> cliquables
let libZonage = document.querySelectorAll('.libZonage');

libZonage.forEach(label => {
    label.addEventListener('click', function() {
      // récupère le précédent élément du label, soit l'input/checkbox
      input = label.previousElementSibling;
      // récupère l'élément parent, soit la balise li
      li = label.parentNode;
      if (input.checked) {
        label.style = {
          background:'',
          borderRadius:''
        }
        label.style = ""
        // label.style.background = "";
        // label.style.borderRadius = "";
      } else {
        label.style = "font-size: 1.1em;font-family: 'lato-bold';letter-spacing: 0.5px;"
        label.style.background = descriptionStyle;
        label.style.borderTopRadius = "5px";
      }
    });
});


// Ajout des informations au menu déroulant depuis le fichier data/descriptions.csv
getExpanded();

function getExpanded() {
  d3.csv("data/descriptions.csv")
  .then(data => {
    data.forEach(d => {
      div = document.getElementById(d.ACRONYME.toLowerCase().concat("-desc"))
      div.innerHTML = "<p><img src= 'css/img/download.svg' id ='pictoDescr'</img>" +
                      "<a href='cartes/" + d.ACRONYME.toLowerCase().concat("-01.jpg") +
                      "' target='_blank'>"+ "Télécharger la carte papier</a></p>"+
                      "<p><b>Niveau(x) géographique(s) : </b>" + d.ECHELON + "</p>" +
                      "<p><b>À propos : </b>"+
                      ""+ d.DESCRIPTION_COURTE + "</p>" +
                      "<p>"+ d.DESCRIPTION_LONGUE + "</p>" +
                      "<p><b>Dernière mise à jour</b> : " + d.LAST_MAJ + "</p>" +
                      "<p><img src= 'css/img/link.svg' id ='pictoDescr'</img>" +
                      "<a href='"+ d.RESSOURCES +
                      "' target='_blank'>En savoir plus</a></p>"
    })
  });
};

/******************************************************************************/
/****************************** FICHE TERRITOIRE ******************************/
/******************************************************************************/


function showFiche() {
  // attribut "left" pour créer une animation; désactivée au profit de display
  // featureInfo.style.left = "25px";
  // var x = setInterval(function () {
  //   clearInterval(x)
  // }, 250);
  // listeZonages.style.left = "-2000px";
  featureInfo.style.display = "block";
  listeZonages.style.display = "none";
};

function hideFiche() {
  // featureInfo.style.left = "2000px";
  // listeZonages.style.left = "0px";
  featureInfo.style.display = "none";
  listeZonages.style.display = "block";
};


/******************************************************************************/
/************************** FENETRE A PROPOS et iePopup **********************************/
/******************************************************************************/
let iePopup = document.getElementById('iePopup');
let aProposBtn = document.getElementById('aPropos-btn');
let aPropos = document.getElementById('aPropos')
let closePopup = document.getElementById('closePopup');

// ouvre la popup
aProposBtn.onclick = function() {
  aPropos.style.display = 'block';
}

// ferme la Popup
closePopup.onclick = function() {
  aPropos.style.display = 'none';
  iePopup.style.display = "none";
}

// au click n'importe où dans le navigateur
window.onclick = function(event) {
  if (event.target == aPropos) {
    aPropos.style.display = "none";
    iePopup.style.display = "none";
  }
}

/******************************************************************************/
/************************* POPUP au chargement ********************************/
/******************************************************************************/

window.onload = function() {
  iePopup.style.display = "block";
};

window.onclick = function(event) {
  if (event.target == iePopup) {
    iePopup.style.display = "none";
  }
}
