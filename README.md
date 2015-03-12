#White pages

Search in your own data throught a LDAP interface.

## Test it

    npm install .
    node test.js

Use your favorite ldap client, and ask _bob_ in _o=whitepages_ at _ldap://127.0.0.1:1389_

Or the shell:

    ldapsearch -LLL -H ldap://localhost:1389 -v -x -D cn=rdupond,o=whitepages -w foo -s sub -P 3 -b o=whitepages -t -T /tmp

*ldapsearch* comes with openldap, and is installed on a Mac, Linux users should _aptitude install_ it.

SNOM Phones: user: cn=admin,o=whitepages

## Status
Early alpha.

## The future

 * CardDAV
 * REST api for pushing data
 * LDAP Auth with different strategy
 * LDAP Auth with acl

## Licence
MIT
