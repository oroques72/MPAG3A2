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
        path: '//li[contains(a,"Projets")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#projets',function(){
        this.test.assertVisible('#projets','Page #projets visible');
        this.test.comment('##############');
        this.test.comment("Page Projets");
        this.test.comment('##############');
        if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"backButton"+RESOLUTION+".png",'#projets div.ui-header a'); }
		if ( CAPTURE ) { this.capture(REP_CAPTURE+"projets"+RESOLUTION+".png"); }
        var expected = "Projets 2014-2015";
        var h1 = this.fetchText('#projets h1');
        this.test.assertEquals(h1,expected,'h1 = "'+expected+'"');
        this.test.assertExists('form input#autocomplete-input-projet');
        this.test.assertExists('ol#listeprojets');
        this.test.comment('');
        this.test.comment("Les sujets sont là");
        this.each(SUJETS,function(self,sujet){
          self.test.assertSelectorHasText('#listeprojets li', '['+sujet[0]+']');
          self.test.assertSelectorHasText('#listeprojets li', sujet[1]);
        });
        this.test.comment('');
        this.test.comment('Contenu de #projets h4 (footer)');
        var expected = "OPTIweb Version "+APP_VERSION+" ";
        var h4 = this.fetchText('#projets h4');
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
        path: '//li[contains(a,"Projets")]/a'
    },function(){
    this.test.comment('');
	this.waitUntilVisible('#projets',function(){
        this.test.assertVisible('#projets','Page #projets visible');
        this.test.comment('##############');
        this.test.comment("Page projets : rechercher 'web'");
        this.test.comment('##############');
        this.fill('#projets div form', {
            'projet': 'web'
        }, false);  // do not submit
        this.waitWhileVisible({
                    type: 'xpath',
                    path: '//ol[@id="listeprojets"]/li['+17+']'
                    },function(){
            this.test.assertVisible('#projets','Page #projets visible');
            if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchFieldProjetWeb"+RESOLUTION+".png",'#projets div form'); }
            if ( CAPTURE ) { this.capture(REP_CAPTURE+"searchProjetsWeb"+RESOLUTION+".png"); }
            this.test.comment('');
            this.test.comment("Seul 3 projets sont visibles");
            // TODO: rendre ces tests plus robustes
            for (var indice=1;indice<18;indice+=1){
                if ((indice == 2) || (indice == 13) || (indice == 16)){
                    this.test.assertVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li['+(indice)+']'
                    },"Projet "+indice+" ******** visible");
                } else {
                    this.test.assertNotVisible({
                        type: 'xpath',
                        path: '//ol[@id="listeprojets"]/li['+(indice)+']'
                    },"Projet "+indice+" non visible");
                }
            }
        // raz search form
        this.then(function(){
            this.click('#projets div form a');
            this.test.assertSelectorHasText('#projets div form input','');
            this.waitUntilVisible('#projets div form input',function(){
                if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"searchProjetFieldEmpty"+RESOLUTION+".png",'#projets div form'); }
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
    this.test.done(58);
});
