// run with :
// casperjs test casperEtudiants.js [--capture=true] [--dump=true]

var CAPTURE = false ;
var REP_CAPTURE = "captures/" ;
var DUMP = false ;
var REQUIRE = false ;
var RESOLUTION = "";
var APP_URL = 'file:///X:/ou/vous/voulez/OPTIweb/test/OPTIweb.html' ;
var APP_VERSION = '0.1' ;

// Test data ////////////////////////////////////
var GROUPES=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"];
var ETUDIANTS = require('./etudiants2014_2015.json');
ETUDIANTS.sort(function(a,b){return ((a.nom > b.nom) ? 1 : ((a.nom < b.nom) ? -1 : 0))});

// Casper ////////////////////////////////////
var utils = require('utils');

if (REQUIRE) {
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
}


casper.start(APP_URL, function() {
    this.test.comment('');
    this.test.comment('Chargement de '+APP_URL);
    this.viewport(400, 600);
    RESOLUTION = "400x600";
    //this.viewport(800, 600);
    //RESOLUTION = "800x600";
    // test title
    var expected = "OPTIweb - V"+APP_VERSION;
    this.test.assertTitle(expected, 'title = "'+expected+'"');
});

// récupération des paramètres éventuels de la ligne de commande
casper.then(function() {
  CAPTURE = this.cli.get('capture') || CAPTURE ;
  this.test.comment('CAPTURE = '+CAPTURE);
  DUMP = this.cli.get('dump') || DUMP ;
  this.test.comment('DUMP = '+DUMP);
});

casper.thenClick({
        type: 'xpath',
        path: '//li[contains(a,"Etudiants")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#etudiants',function(){
        this.test.assertVisible('#etudiants','Page #etudiants visible');
        this.test.comment('##############');
        this.test.comment("Page Etudiants : click sur la ligne Theo PIBOUBES");
        this.test.comment('##############');
        if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"ligneEtudiantPiboubes"+RESOLUTION+".png",'ol#listeetudiants li[data-find="Theo PIBOUBES"] a'); }
        this.clickLabel("PIBOUBES Theo");
        this.waitUntilVisible('#listeprojets',function(){
            this.test.assertVisible('#listeprojets','Page #projets visible');
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"clickEtudiantPiboubes"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul le projet de Theo PIBOUBES est visible");
            var expectedGroupe = 'E';
            for (var indice=0;indice<GROUPES.length;indice+=1){
                if (GROUPES[indice] != expectedGroupe) {
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li/p[contains(b,"Groupe '+GROUPES[indice]+'")]'
                    },'Groupe '+GROUPES[indice]+" non visible");
                } else {
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li/p[contains(b,"Groupe '+GROUPES[indice]+'")]'
                    },'Groupe '+GROUPES[indice]+" visible");
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li/p[contains(.,"Theo PIBOUBES")]'
                    },"Projet de Theo PIBOUBES visible");
                }
            }
            // raz search form
            this.click('#projets div form a');
            this.test.assertSelectorHasText('#projets div form input','');
            this.waitUntilVisible('#listeprojets',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchProjetEmpty"+RESOLUTION+".png",'#projets div form'); }
                // retour page Etudiants
                this.clickLabel('Back', 'a');
                this.waitUntilVisible('#etudiants',function(){
                    this.test.assertVisible('#etudiants','Page #etudiants visible');
                    // retour page d'accueil
                    this.clickLabel('Back', 'a');
                    this.waitUntilVisible('#accueil',function(){
                        this.test.assertVisible('#accueil','Page #accueil visible');
                    });
                });
            });
        });
    });
});

casper.thenClick({
        type: 'xpath',
        path: '//li[contains(a,"Etudiants")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#etudiants',function(){
        this.test.assertVisible('#etudiants','Page #etudiants visible');
        this.test.comment('##############');
        this.test.comment("Page Etudiants : rechercher LOPEZ");
        this.test.comment('##############');
        this.fill('#etudiants div form', {
            'etudiant': 'LOPEZ'
        }, false);  // do not submit
        this.waitWhileVisible({
                    type: 'xpath',
                    path: '//ol[@id="listeetudiants"]/li['+(ETUDIANTS.length + 1)+']'
                    },function(){
            this.test.assertVisible('#etudiants','Page #etudiants visible');
            if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchFieldEtudiantLopez"+RESOLUTION+".png",'#etudiants div form'); }
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"searchEtudiantLopez"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul LOPEZ Nathan est visible");
            for (var indice=0;indice<ETUDIANTS.length;indice+=1){
                if (ETUDIANTS[indice].nom != 'LOPEZ') {
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeetudiants"]/li['+(indice+2)+']'
                    },ETUDIANTS[indice].nom+' '+ETUDIANTS[indice].prenom+" non visible");
                } else {
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeetudiants"]/li['+(indice+2)+']'
                    },ETUDIANTS[indice].nom+' '+ETUDIANTS[indice].prenom+" ******** visible");
                }
            }
        // raz search form
        this.then(function(){
            this.click('#etudiants div form a');
            this.test.assertSelectorHasText('#etudiants div form input','');
            this.waitUntilVisible('#etudiants div form input',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchEtudiantFieldEmpty"+RESOLUTION+".png",'#etudiants div form'); }
                // retour page d'accueil
                this.clickLabel('Back', 'a');
                this.waitUntilVisible('#accueil',function(){
                    this.test.assertVisible('#accueil','Page #accueil visible');
                });
            });
        });
        });
	});
});

///////////////////////////////////////////////////////////////
// main 
casper.run(function() {
	this.echo("#");
	this.echo("# That's All Folks");
	this.echo("#");
    this.test.renderResults(true);
    this.test.done(98);
});
