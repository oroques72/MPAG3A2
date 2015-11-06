// run with :
// casperjs test casperAccueil.js [--capture=true] [--dump=true]

var CAPTURE = false ;
var REP_CAPTURE = "captures/" ;
var DUMP = false ;
var REQUIRE = false ;
var RESOLUTION = "";
var APP_URL = 'file:///tmp/OPTIweb.html' ;
var APP_VERSION = '0.1' ;

// Test data ////////////////////////////////////
    
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

casper.then(function(){
    this.test.comment('##############');
    this.test.comment("Page d'Accueil");
    this.test.comment('##############');
    if ( CAPTURE ) { this.captureSelector(REP_CAPTURE+"creditsButton"+RESOLUTION+".png",'#accueil div.ui-header a'); }
    if ( CAPTURE ) { this.capture(REP_CAPTURE+"accueil"+RESOLUTION+".png"); }
    this.test.comment('');
    this.test.comment('Contenu de #accueil header');
    this.test.assertSelectorHasText('#accueil div a', 'Crédits');
    var expected = 'P<span class="landscape">rojets </span>tut<span class="landscape">orés</span> 2014-2015<br>Département INFO<span class="landscape">RMATIQUE</span><br>IUT de Blagnac';
    var h1 = this.getHTML('#accueil h1');
    this.test.assertEquals(h1,expected,'h1 = "'+expected+'"');
    this.test.comment('');
    this.test.comment('Contenu de #listeSources');
    this.test.assertSelectorHasText('#listeSources', 'Projets');
    this.test.assertSelectorHasText('#listeSources', 'Sujets');
    this.test.assertSelectorHasText('#listeSources', 'Etudiants');
    this.test.assertSelectorHasText('#listeSources', 'Intervenants');
    this.test.comment('');
    this.test.comment('Contenu de #accueil h4 (footer)');
    var expected = "OPTIweb Version "+APP_VERSION+" ";
    var h4 = this.fetchText('#accueil h4');
    this.test.assertEquals(h4,expected,'h4 = "'+expected+'"');
});

///////////////////////////////////////////////////////////////
// main 
casper.run(function() {
	this.echo("#");
	this.echo("# That's All Folks");
	this.echo("#");
    this.test.renderResults(true);
    this.test.done(8);
});
