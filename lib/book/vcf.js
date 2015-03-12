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
    this.emit('reload');
    
    console.log(JSON.stringify(this.data, null, '    '));
};

VcfBook.prototype.convertToJson = function(data) {

   //console.log(JSON.stringify(data, null, '    '));

    var fullName = data.fn;
    var firstName = fullName;
    var lastName = fullName;
    var url = '';
    try {
        var nsplit = data.n.split(';');
        firstName = nsplit[1];
        lastName = nsplit[0];
    } catch(e) {
    }
    var description = data.note || '';
    
    // data points
    var email = [];
    var tel = [];
    
    data.datapoints.forEach(function (d) {
        switch(d.name)  {
            case 'tel':
                tel.push(d.value);
            break;
            case 'email':
                email.push(d.value);
            break;
        }
    });
    
    // TODO: url (seems to be missing in cozy-vcard, see: https://de.wikipedia.org/wiki/VCard)

    return {
        "objectclass": ["person", "top"],
        "cn": [fullName],
        "mail": email,
        "givenname": firstName,
        "sn": lastName,
        "o": "whitepages",
        "ou": "sales",
        "c": "germany",
        "labeledURI": url,
        "nickname": fullName,
        "info": description,
        "description": description,
        "displayName": fullName,
        "telephoneNumber": tel,
    };
};


exports.VcfBook = VcfBook;
