# Leaflet Search

## Overview

Polygon Search feature in Leaflet map (with geospacial index search)


## Prerequisite

- Node.js & npm installed

- IBM Cloudant service instance

    - Create database named **prefs**

- Create "New Geospacial Index" from Cloudant dashboard

    - Design name: geodd

    - Index name: geoidx


## Load data (with curl)

- `$ curl -u "username:password" -XPOST "https://username.cloudant.com/prefs/_bulk_docs" -H "Content-Type: application/json" -d @prefs.json` 


## Install

- Edit settings.js with username & password of IBM Cloudant

- `$ npm install`

- `$ node app`


## Copyright

2018 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

