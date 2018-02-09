const GamaPack = require( 'gamapack' )

module.exports = class Router extends GamaPack {

  constructor() {
    super()
  }

  static load() {
    let routeObj

    for ( const key in App.routes ) {
      if ( key === Path.param1 ) {
        if ( Path.param2 && App.routes[ key ][ Path.param2 ] )
          routeObj = App.routes[ key ][ Path.param2 ]
        else routeObj = App.routes[ key ]

        break
      }
    }

    if ( routeObj ) {
      for ( let i = 0; i < routeObj.length; i++ ) {
        if ( getControllerHandler( routeObj[ i ] ) ) {
          const apiObj = eval( 'Api.' + routeObj[ i ].handler )
          return apiObj()
        }
      }
    }

    return new Promise( ( resolve, reject ) => {
      reject( new Error( 'Route not defined' ) )
    } )

  }

}

function getControllerHandler( routeObj ) {

  if (
    routeObj.path &&
    routeObj.method &&
    routeObj.handler &&
    ( routeObj.method.toUpperCase() === Params.httpMethod.toUpperCase() )
  ) {
    const pathSplited = routeObj.path.split( '/' )

    if ( pathSplited[ 0 ] === '' ) pathSplited.shift()
    if ( pathSplited[ pathSplited.length - 1 ] === '' ) pathSplited.pop()

    for ( let i = 0; i < pathSplited.length; i++ ) {
      if (
        ( pathSplited[ i ].charAt( 0 ) === '{' ) &&
        ( pathSplited[ i ].charAt( pathSplited[ i ].length - 1 ) === '}' ) &&
        ( eval( 'Path.param' + ( i + 1 ) ) )
      ) pathSplited[ i ] = eval( 'Path.param' + ( i + 1 ) )
    }

    const pathObj = pathSplited.join( '/' )

    if (
      ( pathObj === Params.path ) ||
      ( '/' + pathObj === Params.path ) ||
      ( pathObj + '/' === Params.path ) ||
      ( '/' + pathObj + '/' === Params.path ) ||
      ( pathObj === Params.path + '/' ) ||
      ( '/' + pathObj === Params.path + '/' )
    ) return true

  }

  return false

}
