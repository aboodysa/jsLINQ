(function( a, o, w, s ) {
    var getType, 
        sortNumber, 
        sortString, 
        sortProxy, 
        _undefined,
        stringToLambdaFn;
    a.fn = a.prototype;

    if( a.each === _undefined ) {
        a.fn.each = function( func, ctx ) {
            ctx = ctx || w;
            var items = this, l = items.length, i = 0;
            for( i; i < l; i++ ) {
                func.call(ctx, items[i], i);
            }
        };
    }

    if( a.where === _undefined ) {
        a.fn.where = a.fn.all = function( predicate, ctx ) {
            var items = this, arr = [], type;
            ctx = ctx || w;
            if( predicate === _undefined ) return items;
            type = getType( predicate );
            if(type == '[String]') {
                var fn = stringToLambdaFn( predicate );
                items.each(function( item ) {
                    if( fn.call( ctx, item ) === true ) arr.push( item );
                });    
            } else {
                items.each(function( item ) {
                    if( predicate.call( ctx, item ) === true ) arr.push( item );
                });    
            }
            
            return arr;
        };
    }

    if( a.select === _undefined ) {
        a.fn.select = function( func, ctx ) {
            var items = this, arr = [];
            ctx = ctx || w;
            if( func === _undefined ) return items;
            items.each( function( item ) {
                arr.push( func.call( ctx, item ) );
            });
            return arr;
        };
    }
    
    if( a.take === _undefined ) {
        a.fn.take = function( count ) {
            var items = this, l = items.length;
            if( count === _undefined ) return items;
            if( getType(count) !== '[Number]' ) throw 'count must be a number';
            return ( count > l ) ? items : items.slice( 0, count );
        };
    }
    
    if( a.skip === _undefined ) {
        a.fn.skip = function( count ) {
            var items = this, l = items.length;
            if( count === _undefined ) return items;
            if( getType(count) !== '[Number]' ) throw 'count must be a number';
            return ( count > l ) ? items.slice( count - l ) : items.slice( count );
        };
    }
    
    if( a.first === _undefined || a.single === _undefined ) {
        a.fn.first = a.fn.single = function( predicate, ctx ) {
            var items = this;
            if( !predicate ) {
                return items[0];
            }
            return items.where( predicate, ctx )[0];
        };
    }

    if( a.count === _undefined ) {
        a.fn.count = function( predicate, ctx ) {
            var items = this;
            if( predicate  === _undefined ) { 
                return this.length;
            }
            return items.where( predicate, ctx ).length;
        };
    }

    if( a.any === _undefined ) {
        a.fn.any = function( predicate, ctx ) {
            var items = this;
            if( predicate === _undefined ) {
                return this.length > 0;
            }
            return ( items.length <= 0 ) ? false : items.where( predicate, ctx ).length > 0;
        };
    }

    if( a.toHash === _undefined || a.toDictionary === _undefined ) {
        a.fn.toHash = a.fn.toDictionary = function( key ) {
            var items = this, obj = {};
            if(key && items[0][key] === _undefined) throw 'key is only valid for arrays of Object';
            items.each(function(item, i) {
                if(!key) {
                    obj[i] = items[i];
                } else {
                    obj[items[i][key]] = items[i];
                }
            });
            return obj;
        };
    }

    if( a.orderBy === _undefined || a.order === _undefined ) {
        a.fn.orderBy = a.fn.order = function( prop ) {
            var items = this, type, action;
            type = ( prop === _undefined ) ? getType( items[0] ) : getType( items[0][prop] );
            if( prop !== _undefined && type !== '[Object]' && items[0][prop] === _undefined ) throw 'cannot use prop with an Array of primitive types (String, Date, Number, Bool)';
            if( prop === _undefined ) {
                return ( type === '[String]' ) ? items.sort( sortString ) : items.sort( sortNumber );
            }
            return ( type === '[String]' ) ? items.sort(sortProxy(sortString, prop)) : items.sort(sortProxy(sortNumber, prop));
        };
    }

    if( a.sum === _undefined ) {
        a.fn.sum = function( prop ) {
            var items = this, type, sum = 0;
            type = ( prop === _undefined ) ? getType( items[0] ) : getType( items[0][prop] );
            if( type !== '[Number]' ) throw 'array values must be a Number';
            items.each(function(item, i) {
                var val = ( prop === _undefined ) ? items[i] : items[i][prop];
                sum += val;
            });
            return sum;
        };
    }

    if( a.average === _undefined || a.mean === _undefined ) {
        a.fn.average = a.fn.mean = function( prop ) {
            var items = this, l = items.length, type;
            type = ( prop === _undefined ) ? getType( items[0] ) : getType( items[0][prop] );
            if( type !== '[Number]' ) throw 'array values must be a Number';
            return items.sum(prop) / l;
        };
    }

    if( a.max === _undefined ) {
        a.fn.max = function( prop ) {
            var items = this, type, arr;
            type = ( prop === _undefined ) ? getType( items[0] ) : getType( items[0][prop] );
            if( type !== '[Number]' ) throw 'array values must be a Number';
            arr = ( prop === _undefined ) ? items : items.select(function(x) {return x[prop];});
            return Math.max.apply(Math, arr);
        };
    }

    if( a.min === _undefined ) {
        a.fn.min = function( prop ) {
            var items = this, type, arr;
            type = ( prop === _undefined ) ? getType( items[0] ) : getType( items[0][prop] );
            if( type !== '[Number]' ) throw 'array values must be a Number';
            arr = ( prop === _undefined ) ? items : items.select(function(x) {return x[prop];});
            return Math.min.apply(Math, arr);
        };
    }

    if( a.unique === _undefined || a.distinct === _undefined ) {
        a.fn.unique = a.fn.distinct = function() {
            var items = this, arr = [], l = items.length, i = 0;
            for( i; i < l; i++ ) {
              for( var j = i + 1; j < l; j++ ) {
                if ( items[i] === items[j] )
                  j = ++i;
              }
              arr.push( items[i] );
            }
            return arr;
        };
    }

    if( a.union === _undefined ) {
        a.fn.union = function() {
            var items = this, arr = [].concat( items ), l = arguments.length, i = 0;
            if( !l ) throw "arguments must be Arrays";
            for( i; i < l; i++ ) {
                arr = arr.concat( arguments[i] );
            }
            return arr.unique();
        };
    }

    if( a.intersect === _undefined ) {
        a.fn.intersect = function( oArr ) {
            var items = this, arr, arr2, n = 0, l2 = 0, l = arguments.length;
            if( !l ) throw "arguments must be Arrays";
            while( n < arguments.length ) {
                l = items.length;
                arr = [];
                arr2 = arguments[n];
                l2 = arr2.length;
                for( var i = 0; i < l; i++ ) {
                    for( var j = 0; j < l2; j++ ) {
                        if( items[i] === arr2[j] ) arr.push( items[i] );
                    }
                }
                items = arr;
                n++;
            }
            return items.unique();
        };
    }

    if( a.shuffle === _undefined ) {
        a.fn.shuffle = function() {
            var items = this, shuffled = [], rand;
            items.each(function(item, i) {
                rand = Math.floor(Math.random() * (i + 1));
                shuffled[i] = shuffled[rand];
                shuffled[rand] = item;
            });
            return shuffled;
        };
    }
    
    if( !s.params ) {
        s.prototype.params = function ( obj ) {
            var str = this,
            type =  o.prototype.toString.call( obj ).replace( 'object ', '' ),
            i = 0,
            l = arguments.length,
            r;
            if ( type === '[Object]' && l === 1 ) {
                for ( var prop in obj ) {
                    r = new RegExp( '\\{' + prop + '\\}', 'g' );
                    str = str.replace( r, obj[prop] );
                }
            } else {
                for ( ; i < l; i++ ) {
                    r = new RegExp( '\\{' + i + '\\}', 'gi' );
                    str = str.replace( r, arguments[i] );
                }
            }
            return str;
        };
    }

    sortProxy = function( func, prop ) {
        return (function(a, b) {
                    return func(a, b, prop);
                });
    };

    getType = function( obj ) {
        return o.prototype.toString.call( obj ).replace( 'object ', '' );
    };

    sortNumber = function( a, b, prop ) {
        return ( prop === _undefined ) ? a - b : a[prop] - b[prop];
    };

    sortString = function( a, b, prop ) {
        var _a, _b;
        _a = ( prop === _undefined ? a : a[prop] );
        _b = ( prop === _undefined ? b : b[prop] );
        return _a.localeCompare(_b);
    };

    stringToLambdaFn = function ( l ) {
        var fn = l.match(/[\(]?(\w)[\)]?\s*=>\s*(.*)/), p = [], b = '';
        if ( fn && fn.length > 0 ) fn.shift();
        if ( fn && fn.length > 0 ) b = fn.pop();
        if ( fn && fn.length > 0 ) p = fn.pop().replace(/^\s*|\s(?=\s)|\s*$|,/g, '').split(' ');
        fn = ( ( ! /\s*return\s+/.test( b ) ) ? 'return ' : '' ) + b ;   
        p.push( fn ) ;
        try {
           return Function.apply( {}, p ) ;
        }
        catch( e ) {
            return null ;
        }
    };

} )( this.Array, this.Object, this, this.String );