var book = require('../book'),
    util = require('util'),
    fs = require('fs'),
    VCardParser = require('cozy-vcard');

var VcfBook = function(path, cb) {
    this.path = path;
    this.data = [];
    var that = this;
    process.on('SIGHUP', function() {
        that.load();
    });
    this.init(cb);
};

util.inherits(VcfBook, book.Book);

VcfBook.prototype.init = function(cb) {
    this.load();
    if (cb != undefined) {
        cb.call(this);
    }
};

VcfBook.prototype.load = function() {
    // reset data
    this.data = [];
    var raw = fs.readFileSync(this.path, 'utf8');
    var vcf = new VCardParser(raw);
    for(var i = 0; i < vcf.contacts.length; ++i) {
        this.data.push(this.convertToJson(vcf.contacts[i]));
    }
    this.emit('reload');
    console.log('VcfBook: loaded', this.data.length, 'contacts from', this.path);
};

VcfBook.prototype.convertToJson = function(data) {
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
        "objectclass": ["person", "top", "inetorgperson"],
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
