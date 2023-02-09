# JSPassword

## Why use JSPassword
JSPassword is a password management tool that helps improve one's password security and provides convenience to the user as well. JSPassword allows a user to store all of their passwords in a secure location so that the user does not need to worry about forgetting their passwords while maintaining their security at the same time. It also gives users the option of generating a secure and random password for them.

## Functions
1) Store and secure passwords
2) Generate secure passwords
3) Autofill username and password forms

## How JSPassword Protects Your Data
JSPassword focuses on security. We ensure that all passwords stored in our database is either hashed or encrypted before being stored.
User's main account login are hashed 260000 times and a salt is added before being stored in the database.
User's saved account password are encrypted with AES encryption with their password's hash as the key.
Connection to our service is secure as well as we use SSL Connection to ensure that any attacker listening to the communication will not be able to get any useful information.

## How to use password manager
1) Install JSPassword extension
2) Head to https://cz4010.joelng.com/ directly to access the password manager
3) Register a new user and add new accounts once in the dashboard
4) When creating new account, 'password' refers to the account's password and 'Main password' refers to the user's password

## JSPassword Extension Installation
Extension is only supported on Firefox.
To add the browser extension to your firefox browser, go to url 'about:debugging' and click on 'this firefox' at the left panel.
click on 'Load Temporary Add-on' and then select the manifest.json file of the firefox extension folder.

## Database
The installation for the server is a very long process which we decided to not include here as there were too many steps.

The database structure can be found in file 'cz4010db'. To use this file, use PGAdmin4 and right click on a database that you want to insert the tables into and click restore and select the file.

## Software Use
Our server uses Django for the webserver
Cert-bot to get the SSL cert
Postgres for database

NTU CZ4010 - Topic 4 - Secure and Authenticated Password Management Tool 
