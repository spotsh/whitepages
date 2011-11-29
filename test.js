var Book = require('./lib/book').Book,
    Gravatar = require('./lib/gravatar').Gravatar,
    WhitePages = require('./lib/whitepages').WhitePages;

var wp = new WhitePages();
var g = new Gravatar('mathieu@garambrogne.net')
g.jpeg(function(jpeg) {
    var book = new Book([{
            objectclass: ["person", "top" ],
            cn: "Robert Dupond",
            mail: "robert@dupond.com",
            givenname: "Robert",
            sn: "bob",
            o: "dupondinc",
            ou: "sales",
            jpegPhoto: jpeg,
            c: "france",
            labeledURI: "http://github.com",
            nickname: "Bob",
            xmozillanickname: "Bob le mozillien",
            info: "more infos",
            uid: "bdupond",
            description: "Description",
            displayName: "RoBeRt"
          }]);

    wp.read(book);
    wp.listen(1389, '127.0.0.1', function(){
        console.log("White pages at %s", wp.ldap.url);
    })

});
