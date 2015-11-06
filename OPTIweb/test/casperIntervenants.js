// run with :
// casperjs test casperIntervenants.js [--capture=true] [--dump=true]

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
var INTERVENANTS = require('./intervenants2014_2015.json');

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
        path: '//li[contains(a,"Intervenants")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#intervenants',function(){
        this.test.assertVisible('#intervenants','Page #intervenants visible');
        this.test.comment('##############');
        this.test.comment("Page Intervenants");
        this.test.comment('##############');
		if ( CAPTURE ) { this.capture(REP_CAPTURE+"intervenants"+RESOLUTION+".png"); }
        var expected = "Intervenants 2014-2015";
        var h1 = this.fetchText('#intervenants h1');
        this.test.assertEquals(h1,expected,'h1 = "'+expected+'"');
        this.test.assertExists('form input#autocomplete-input-intervenant');
        this.test.assertExists('ul#listeintervenants');
        this.test.comment('');
        this.test.comment("Les intervenants sont là");
        this.each(INTERVENANTS,function(self,intervenant){
          self.test.assertSelectorHasText('#listeintervenants li', intervenant.nom+' '+intervenant.prenom);
        });
        this.test.comment('');
        this.test.comment('Contenu de #intervenants h4 (footer)');
        var expected = "OPTIweb Version "+APP_VERSION+" ";
        var h4 = this.fetchText('#intervenants h4');
        this.test.assertEquals(h4,expected,'h4 = "'+expected+'"');
        // retour page d'accueil
        this.then(function(){
            this.clickLabel('Back', 'a');
            this.waitUntilVisible('#accueil',function(){
                this.test.assertVisible('#accueil','Page #accueil visible');
            });
        });
	});
});

casper.thenClick({
        type: 'xpath',
        path: '//li[contains(a,"Intervenants")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#intervenants',function(){
        this.test.assertVisible('#intervenants','Page #intervenants visible');
        this.test.comment('##############');
        this.test.comment("Page Intervenants : click sur la ligne ROQUES Olivier");
        this.test.comment('##############');
        this.clickLabel("ROQUES Olivier");
        this.waitUntilVisible('#listeprojets',function(){
            this.test.assertVisible('#listeprojets','Page #projets visible');
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"clickIntervenantRoques"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul les projets de ROQUES Olivier sont visibles (F G)");
            var expectedGroupe1 = 'F';
            var expectedGroupe2 = 'G';
            for (var indice=0;indice<GROUPES.length;indice+=1){
                if ((GROUPES[indice] != expectedGroupe1) && (GROUPES[indice] != expectedGroupe2)){
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li/p[contains(b,"Groupe '+GROUPES[indice]+'")]'
                    },'Groupe '+GROUPES[indice]+" non visible");
                } else {
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li/p[contains(b,"Groupe '+GROUPES[indice]+'")]'
                    },'Groupe '+GROUPES[indice]+" visible");
                }
            }
            // raz search form
            this.click('#projets div form a');
            this.test.assertSelectorHasText('#projets div form input','');
            this.waitUntilVisible('#listeprojets',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchProjetEmpty"+RESOLUTION+".png",'#projets div form'); }
                // retour page Intervenants
                this.clickLabel('Back', 'a');
                this.waitUntilVisible('#intervenants',function(){
                    this.test.assertVisible('#intervenants','Page #intervenants visible');
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
        path: '//li[contains(a,"Intervenants")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#intervenants',function(){
        this.test.assertVisible('#intervenants','Page #intervenants visible');
        this.test.comment('##############');
        this.test.comment("Page intervenants : rechercher BRUEL");
        this.test.comment('##############');
        this.fill('#intervenants div form', {
            'intervenant': 'BRUEL'
        }, false);  // do not submit
        this.waitWhileVisible({
                    type: 'xpath',
                    path: '//ol[@id="listeintervenants"]/li['+(INTERVENANTS.length + 1)+']'
                    },function(){
            this.test.assertVisible('#intervenants','Page #intervenants visible');
            if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchFieldIntervenantsBRUEL"+RESOLUTION+".png",'#intervenants div form'); }
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"searchIntervenantsBRUEL"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul JMB est visible");
            for (var indice=0;indice<INTERVENANTS.length;indice+=1){
                if (INTERVENANTS[indice].nom != 'BRUEL') {
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ul[@id="listeintervenants"]/li['+(indice+2)+']'
                    },INTERVENANTS[indice].nom+" non visible");
                } else {
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ul[@id="listeintervenants"]/li['+(indice+2)+']'
                    },INTERVENANTS[indice].nom+" ******** visible");
                }
            }
        // raz search form
        this.then(function(){
            this.click('#intervenants div form a');
            this.test.assertSelectorHasText('#intervenants div form input','');
            this.waitUntilVisible('#intervenants div form input',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchIntervenantsFieldEmpty"+RESOLUTION+".png",'#intervenants div form'); }
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
    this.test.done(75);
});
