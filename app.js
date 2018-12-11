//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    cloudantlib = require( '@cloudant/cloudant' ),
    app = express();
var settings = require( './settings' );

var db = null;
var cloudant = cloudantlib( { account: settings.db_username, password: settings.db_password } );
if( cloudant ){
  cloudant.db.get( settings.db_name, function( err, body ){
    if( err ){
      if( err.statusCode == 404 ){
        cloudant.db.create( settings.db_name, function( err, body ){
          if( err ){
            db = null;
          }else{
            db = cloudant.db.use( settings.db_name );
          }
        });
      }else{
        db = cloudant.db.use( settings.db_name );
      }
    }else{
      db = cloudant.db.use( settings.db_name );
    }
  });
}

var appEnv = cfenv.getAppEnv();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );


app.get( '/prefs', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  if( db ){
    db.list( { include_docs: true }, function( err, result ){
      if( err ){
      }else{
        var prefs = [];
        result.rows.forEach( function( pref ){
          var _pref = JSON.parse(JSON.stringify(pref.doc));
          if( _pref._id.indexOf( '_' ) !== 0 ){
            prefs.push( _pref );
          }
        });

        var result = { status: true, prefs: prefs };
        res.write( JSON.stringify( result, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: "db not initialized." }, 2, null ) );
    res.end();
  }
});

app.get( '/polygonsearch', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  if( db ){
    var polygon = req.query.polygon;  //. polygon = '((140.12333 35.60472,138.18111 36.65139,138.38306 34.97694,140.12333 35.60472))'
    //polygon = polygon.split( ' ' ).join( '%20' );  //. 不要

    var query = {
      include_docs: true,
      g: 'polygon' + polygon
    };
    //console.log( query );

    db.geo( 'geodd', 'geoidx', query, function( err, result ){
      if( err ){
        //console.log( err );
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: err }, 2, null ) );
        res.end();
      }else{
        //console.log( result.rows );
        res.write( JSON.stringify( { status: true, prefs: result.rows }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: "db not initialized." }, 2, null ) );
    res.end();
  }
});


app.listen( appEnv.port );
console.log( "server stating on " + appEnv.port + " ..." );
