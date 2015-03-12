var white = require('./lib/whitepages.js'),
    crypto = require('crypto'),
    WhitePages = white.WhitePages,
    VcfBook = white.VcfBook;

var wp = new WhitePages('o=whitepages');
var h = crypto.createHmac('sha256', 'wp');
h.update('foo');
wp.hash_key = 'wp';
wp.password = h.digest('hex');

var book = new VcfBook('test.vcf');
wp.read(book);
wp.listen(1389, '0.0.0.0', function(){
     console.log("White pages at %s", wp.ldap.url);
});

