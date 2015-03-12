var book = require('../book'),
    util = require('util'),
    fs = require('fs'),
    VCardParser = require('cozy-vcard');

var VcfBook = function(path, cb) {
    this.path = path;
    this.data = [];
    var that = this;
    var watcher = fs.watch(path, function(evt, filename) {
        that.load();
    });
    this.init(cb);
};

util.inherits(VcfBook, book.Book);

VcfBook.prototype.init = function(cb) {
    this.on('end', function() {
        watcher.close();
    });
    this.load();
    if (cb != undefined) {
        cb.call(this);
    }
};

VcfBook.prototype.load = function() {
    var raw = fs.readFileSync(this.path, 'utf8');
    var vcf = new VCardParser(raw);
    for(var i = 0; i < vcf.contacts.length; ++i) {
        this.data.push(this.convertToJson(vcf.contacts[i]));
    }
    console.log(this.data);
    this.emit('reload');
};

VcfBook.prototype.convertToJson = function(data) {
    var fullName = data.fn;
    var firstName = fullName;
    try {
        var firstName = data.n.split(';')[1]
    } catch(e) {
    }
    var description = data.note || '';
    
    // data points
    var email = '';
    var tel = '';
    
    // TODO: multiple tel and email
    data.datapoints.forEach(function (d) {
        switch(d.name)  {
            case 'tel':
                tel = d.value;
            break;
            case 'email':
                email = d.value;
            break;
        }
    });

    return {
        "objectclass": ["person", "top" ],
        "cn": [fullName],
        "mail": email,
        "givenname": firstName,
        "sn": "Dupont",
        "o": "whitepages",
        "ou": "sales",
        "c": "france",
        "labeledURI": "http://github.com",
        "nickname": fullName,
        "xmozillanickname": "Bob le mozillien",
        "info": "more infos",
        "uid": "rdupond",
        "description": description,
        "displayName": fullName,
        "telephoneNumber": tel,
    };
};


exports.VcfBook = VcfBook;
