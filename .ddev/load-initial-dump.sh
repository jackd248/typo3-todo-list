#!/bin/bash

# Check if the database is empty
if [ -z "$(echo 'SELECT * FROM pages' | vendor/bin/typo3 database:import)" ]
then
  echo 'Loading initial database dump'
  mariadb db < /var/www/html/.ddev/dump.sql
fi
