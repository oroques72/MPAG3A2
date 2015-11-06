var casper = require('casper').create();

casper.start('file:///U:/E/MPA/sprint_4/OPTIwebprof.html', function() {
    this.echo(this.getTitle());
    var expected = 'OPTIweb - V0.1';
    this.test.assertTitle(expected,'title = "' + expected + '"');
});

casper.run();
