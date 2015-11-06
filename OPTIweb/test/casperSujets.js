// run with :
// casperjs test casperSujets.js [--capture=true] [--dump=true]

var CAPTURE = false ;
var REP_CAPTURE = "captures/" ;
var DUMP = false ;
var REQUIRE = false ;
var RESOLUTION = "";
var APP_URL = 'file:///X:/ou/vous/voulez/OPTIweb/test/OPTIweb.html' ;
var APP_VERSION = '0.1' ;

// Test data ////////////////////////////////////
var GROUPES=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"];
var SUJETS=[
["ApexEComm","Application et tutoriel Oracle Apex pour un site d'e-commerce"],
["Archeologie","Groupe de recherche Chasséen Méridional"],
["Architekt","Architekt"],
["BDM NoSQL","Développement d’un logiciel de conception d’une base de données multidimensionnelles"],
["Carsat","Questionnaire client sur page web et traitement des données"],
["E-ICGD","Environnement d'intégration continue de génération de documentation"],
["GESDEP","Finalisation et déploiement de l'application de gestion des déplacements des personnels"],
["PrestaShop","Application et tutoriel sur Prestashop (logiciel e-commerce gratuit )"],
["Prodif","Refactoring de l'application Java PRODIF"],
["ReconfMI","Développement interface graphique"],
["Refactor","Refactoring de site web statique en site web dynamique"],
["RegExp","Application pédagogique d'apprentissage des expressions régulières par l'expérience"],
["SimulMI","Développement de simulateur"],
["SoftVolley","SoftVolley : explication de stratégies de jeu au Volley-ball"],
["SWAML",'Site web association "Marie Louise"']
] ;

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
        path: '//li[contains(a,"Sujets")]/a'
    },function(){
    this.test.comment('');
    this.waitUntilVisible('#sujets',function(){
        this.test.assertVisible('#sujets','Page #sujets visible');
        this.test.comment('##############');
        this.test.comment("Page Sujets");
        this.test.comment('##############');
        if ( CAPTURE ) { this.capture(REP_CAPTURE+"sujets"+RESOLUTION+".png"); }
        var expected = "Sujets 2014-2015";
        var h1 = this.fetchText('#sujets h1');
        this.test.assertEquals(h1,expected,'h1 = "'+expected+'"');
        this.test.assertExists('form input#autocomplete-input-sujet');
        this.test.assertExists('ol#listesujets');
        this.test.comment('');
        this.test.comment("Les sujets sont affichés dans l'ordre");
        for (var indice=0;indice<SUJETS.length;indice++){
            this.test.assertSelectorHasText({
                type: 'xpath',
                path: '//ol[@id="listesujets"]/li['+(indice+2)+']'
                }, '['+SUJETS[indice][0]+']');
            this.test.assertSelectorHasText({
                type: 'xpath',
                path: '//ol[@id="listesujets"]/li['+(indice+2)+']'
                }, SUJETS[indice][1]);
        }
        this.test.comment('');
        this.test.comment('Contenu de #sujets h4 (footer)');
        var expected = "OPTIweb Version "+APP_VERSION+" ";
        var h4 = this.fetchText('#sujets h4');
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
        path: '//li[contains(a,"Sujets")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#sujets',function(){
        this.test.assertVisible('#sujets','Page #sujets visible');
        this.test.comment('##############');
        this.test.comment("Page Sujets : click sur la ligne Architekt");
        this.test.comment('##############');
        if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"lineSujetArchitekt"+RESOLUTION+".png",'#listesujets li[data-find="[Architekt]"]'); }
        this.clickLabel("Architekt");
        this.waitUntilVisible('#listeprojets',function(){
            this.test.assertVisible('#listeprojets','Page #projets visible');
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"clickSujetArchitekt"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul les projets Architekt sont visibles (N O)");
            var expectedGroupe1 = 'N';
            var expectedGroupe2 = 'O';
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
                this.waitUntilVisible('#sujets',function(){
                    this.test.assertVisible('#sujets','Page #sujets visible');
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
        path: '//li[contains(a,"Sujets")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#sujets',function(){
        this.test.assertVisible('#sujets','Page #sujets visible');
        this.test.comment('##############');
        this.test.comment("Page Sujets : rechercher logiciel");
        this.test.comment('##############');
        this.fill('#sujets div form', {
            'sujet': 'logiciel'
        }, false);  // do not submit
        this.waitWhileVisible({
                    type: 'xpath',
                    path: '//ol[@id="listesujets"]/li['+17+']'
                    },function(){
            this.test.assertVisible('#sujets','Page #sujets visible');
            if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchFieldSujetLogiciel"+RESOLUTION+".png",'#sujets div form'); }
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"searchSujetLogiciel"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul 2 sujets sont visibles");
            for (var indice=0;indice<SUJETS.length;indice+=1){
                if (SUJETS[indice][0].match(/logiciel/) || SUJETS[indice][1].match(/logiciel/)) {
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listesujets"]/li['+(indice+2)+']'
                    },"Sujet "+SUJETS[indice][0]+" ******* visible");
                } else {
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ol[@id="listesujets"]/li['+(indice+2)+']'
                    },"Sujet "+SUJETS[indice][0]+" non visible");
                }
            }
        // raz search form
        this.then(function(){
            this.click('#sujets div form a');
            this.test.assertSelectorHasText('#sujets div form input','');
            this.waitUntilVisible('#sujets div form input',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchSujetFieldEmpty"+RESOLUTION+".png",'#sujets div form'); }
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
    this.test.done(78);
});
