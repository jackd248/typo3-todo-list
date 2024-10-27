#!/bin/bash

# Check if the database is empty
if test -z $(echo "SELECT * FROM be_users" | vendor/bin/typo3 database:import)
then
  echo 'Loading initial database dump'
  mysql db < /var/www/html/.ddev/dump.sql
fi
