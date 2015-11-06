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

casper.then(function() {
    this.clickLabel('Crédits', 'a');
    this.test.comment('');
    this.test.comment('Click on "Crédits"');
	this.waitUntilVisible('#credits',function(){
        this.test.assertVisible('#credits','Page #crédits visible');
        this.test.comment('##############');
        this.test.comment("Page Crédits");
        this.test.comment('##############');
		if ( CAPTURE ) { this.capture(REP_CAPTURE+"credits"+RESOLUTION+".png"); }
        var expected = "Crédits";
        var h1 = this.fetchText('#credits h1');
        this.test.assertEquals(h1,expected,'h1 = "'+expected+'"');
        this.test.comment('');
        this.test.comment('Contenu de #contacts');
        this.test.assertSelectorHasText('#contacts', 'Product Owner');
        this.test.assertSelectorHasText('#contacts', 'André PÉNINOU');
        this.test.assertSelectorHasText('#contacts', 'Université Toulouse 2 - IUT de Blagnac');
        this.test.assertSelectorHasText('#contacts', 'Département INFORMATIQUE');
        this.test.comment('');
        this.test.comment('Contenu de #listecredits');
        this.test.assertSelectorHasText('#listecredits', 'Membres de l\'équipe enseignante');
        this.test.assertSelectorHasText('#listecredits', 'Jean-Michel BRUEL');
        this.test.assertSelectorHasText('#listecredits', 'Jean-Michel INGLEBERT');
        this.test.assertSelectorHasText('#listecredits', 'André PÉNINOU');
        this.test.assertSelectorHasText('#listecredits', 'Olivier ROQUES');
        this.test.comment('');
        this.test.comment('Contenu de #listepowered');
        this.test.assertSelectorHasText('#listepowered', 'Propulsé par');
        this.test.assertSelectorHasText('#listepowered', 'http://jquerymobile.com/');
        this.test.assertSelectorHasText('#listepowered', 'http://fortawesome.github.io/Font-Awesome/');
        this.test.comment('');
        this.test.comment('Contenu de #credits h4 (footer)');
        var expected = "OPTIweb Version "+APP_VERSION+" ";
        var h4 = this.fetchText('#credits h4');
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

///////////////////////////////////////////////////////////////
// main 
casper.run(function() {
	this.echo("#");
	this.echo("# That's All Folks");
	this.echo("#");
    this.test.renderResults(true);
    this.test.done(98);
});
