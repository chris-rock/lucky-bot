'use strict';

var xmpp = require('node-xmpp-server');
var units = require('node-units');
var pem = require('pem');

var domain = 'test1.superfeedr.com';

var r = new xmpp.Router();

pem.createCertificate({
    days: 5,
    selfSigned: true,
    organization: domain.split('.').slice(-2)[0],
    organizationUnit: 'development',
    commonName: domain
}, function (err, keys) {
    if (err) {
        console.error(err);
    } else {

        r.loadCredentials(
            'test1.superfeedr.com',
            keys.serviceKey,
            keys.certificate);

        r.register(domain, function (stanza) {
            if (stanza.attrs.type !== 'error') {
                var q = stanza.getChildText('body');
                var r = units.convert(q);
                var me = stanza.attrs.to
                stanza.attrs.to = stanza.attrs.from
                stanza.attrs.from = me
                stanza.getChild('body').text = r;
                r.send(stanza)
            }
        });

    }
})
