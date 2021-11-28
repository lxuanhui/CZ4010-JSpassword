JSPassword

Why should I use this service?
JSPassword focuses on security. We ensure that all passwords stored in our database is either hashed or encryptped before being stored.
User's main account login are hashed 260000 times and a salt is added befefore being stored in the database.
User's saved account password are encrypted with AES encryption with their password's hash as the key.
Connection to our service is secure as well as we use SSL Connection to ensure that any attacker listening to the communication will not be able to get any useful informatio.

The installation for the server is a very long process which we decided to not include here as there were too many steps.

The database structure can be found in file 'cz4010db'. To use this file, use PGAdmin4 and right click on a database that you want to insert the tables into and click restore and select the file.

To add the browser extension to your firefox browser, go to url 'about:debugging' and click on 'this firefox' at the left panel.
click on 'Load Temporary Add-on' and then select the manifest.json file of the firefox extension folder.

Our server uses Django for the webserver
Cert-bot to get the SSL cert
Postgres for database
