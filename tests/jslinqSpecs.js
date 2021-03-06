describe( 'With jsLINQ', function() {
    var empty = [],
        nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        numsNotSequential = [1, 7, 3, 10, 5, 6, 2, 8, 9, 4],
        numsDups = [25, 200, 47, 3, 98, 365, 5, 200, 2, 98],
        strsNotSequential = ['a', 'c', 'd', 'b', 'f', 'e'],
        strsDups = ['a', 'b', 'c', 'a', 'b'],
        datesNotSequential = [new Date('01/02/2012'), new Date('01/04/2012'), new Date('01/05/2012'), new Date('01/01/2012'), new Date('01/03/2012')],
        people = [
            new helpers.Person( 'Jon', 'Doe', 27, '05/12/1984' ),
            new helpers.Person( 'Ryan', 'Smith', 29, '08/05/1982' ),
            new helpers.Person( 'Adam', 'Bo', 34, '07/24/1977' ),
            new helpers.Person( 'Jon', 'Doe', 30, '01/14/1981' ),
            new helpers.Person( 'Aurora', 'Assar', 31, '10/18/1980' ),
            new helpers.Person( 'Chris', 'Barton', 20, '03/11/1991' ),
            new helpers.Person( 'Ray', 'Weeks', 22, '08/16/1989' ),
            new helpers.Person( 'Jesus', 'Sims', 18, '02/03/1993' ),
            new helpers.Person( 'Sandy', 'Serrano', 27, '12/06/1984' )
        ], ViewModel = function( people, index ) {
            this.root = 'fakeRootId';
            this.index = index || 27;
            this.prople = people;
        };



    describe( 'When using any()', function() {
        describe( 'without a predicate', function() {
            it( 'should return false with empty array', function() {
                expect( empty.any() ).toBe( false );
            });

            it( 'should return true with nums array', function() {
                expect( nums.any() ).toBe( true );
            });
        });
        describe( 'with a predicate', function() { 
           it( 'should return false when asked for nums greater then 50', function() {
                expect( empty.any(function(x) {return x > 50} ) ).toBe( false );
            });

            it( 'should return true when asked for nums greater then 5', function() {
                expect( nums.any(function(x) {return x > 5}) ).toBe( true );
            }); 

            it( 'should be able to filter on people by objects property values', function() {
                expect( people.any(function(x) {return x.age > 25}) ).toBe( true );
                expect( people.any(function(x) {return x.first === 'Jesus'}) ).toBe( true );
                expect( people.any(function(x) {return x.last === 'foobar'}) ).toBe( false );
            });
        });
    });
    
    describe( 'When using count()', function() {
        describe( 'without a predicate', function() {
            it( 'should return 0 with empty array', function() {
                expect( empty.count() ).toBe( 0 );
            });

            it( 'should return 10 with nums array', function() {
                expect( nums.count() ).toBe( 10 );
            });
        });
        describe( 'with a predicate', function() { 
            it( 'should return 0 when asked for nums greater then 50', function() {
                expect( empty.count(function(x) {return x > 50}) ).toBe( 0 );
            });

            it( 'should return 5 when asked for nums greater then 5', function() {
                expect( nums.count(function(x) {return x > 5}) ).toBe( 5 );
            }); 

            it( 'should be able to get count on people by objects property values', function() {
                expect( people.count(function(x) {return x.age > 25}) ).toBe( 6 );
                expect( people.count(function(x) {return x.first === 'Jesus'}) ).toBe( 1 );
                expect( people.count(function(x) {return x.last === 'foobar'}) ).toBe( 0 );
            });
        });
    });

    describe( 'When using single() - first()', function() {
        describe( 'without a predicate', function() {
            it( 'should return undefined for empty array', function() {
                expect( empty.first() ).toBeUndefined();
            });

            it( 'should return 1 with nums array', function() {
                expect( nums.first() ).toBe( 1 );
            });

            it( 'should return person with age 27 from people array', function() {
                expect( people.first().age ).toBe( 27 );
            });
        });
        describe( 'with a predicate', function() { 
            it( 'should return 5 when asked for nums greater then 4', function() {
                expect( nums.single(function(x) {return x > 4}) ).toBe( 5 );
            });

            it( 'should return person with frist of "Adam" when asked for people with age greater then 30', function() {
                expect( people.single(function(x) {return x.age > 30}).first ).toBe( 'Adam' );
            }); 

        });
    });

    describe( 'When using where()', function() {
        it( 'should return all if no predicate is passed', function() {
            expect( nums.where().count() ).toBe( 10 );
            expect( people.where().count() ).toBe( 9 );
        });

        it( 'should return the second 5 items of nums when asked for items greater then 5', function() {
            var tmpArr = nums.where(function(x) {return x > 5});
            expect( tmpArr[0] ).toBe( 6 );
            expect( tmpArr[4] ).toBe( 10 );
        });

        it( 'should return all people over 20 years old', function() {
            var tmpArr = people.where(function(x) {return x.age > 20});
            expect(tmpArr.count()).toBe(7);
        });

        it( 'should parse lamba without prop', function() {
            var tmpArr = nums.where('(n) => n > 5');
            expect(tmpArr.count()).toBe(5);
            expect(tmpArr[0]).toBe(6);
        });

        it( 'should parse lamba with prop when value is a number', function() {
            var tmpArr = people.where('(n) => n.age > 21');
            expect(tmpArr.count()).toBe(7);
            expect(tmpArr[0].full()).toBe('Jon Doe');
        });

        it( 'should parse lamba with prop when value is a string', function() {
            var tmpArr = people.where('(n) => n.first == "Jon"');
            expect(tmpArr.count()).toBe(2);
            expect(tmpArr[0].full()).toBe('Jon Doe');
        });

        it( 'should use the given ctx to execute callbacks', function() {
            var model = new ViewModel( people ),
                tmpArr = people.where('p => p.age == this.index', model);
            expect(tmpArr.count()).toBe(2);
        });

        it( 'should parse lamba with prop and two conditions with and without parens', function() {
            var tmpArr = people.where('(n) => n.first == "Jon" || n.last == "Barton"');
            var tmpArr_2 = people.where('n => n.first == "Jon" || n.last == "Barton"');
            expect(tmpArr.count()).toBe(3);
            expect(tmpArr_2.count()).toBe(3);
            expect(tmpArr[0].full()).toBe('Jon Doe');
            expect(tmpArr_2[0].full()).toBe('Jon Doe');
        });
    });
    
    describe( 'When using select()', function() {
        it( 'should return all if no predicate is passed', function() {
            expect( nums.select().count() ).toBe( 10 );
            expect( people.select().count() ).toBe( 9 );
        });

        it( 'should return an array of full names from people when passed a transform calling full()', function() {
            var tmpArr = people.select( function(x) {return x.full()} );
            expect(tmpArr.count()).toBe( 9 );
            expect(tmpArr[0]).toBe( 'Jon Doe' );
            expect(tmpArr[8]).toBe( 'Sandy Serrano' );
        });

        it( 'should return an array of numbers ++ from nums when passed a transform calling x + 1', function() {
            var tmpArr = nums.select( function(x) {return x + 1} );
            expect(tmpArr.count()).toBe( 10 );
            expect(tmpArr[0]).toBe( 2 );
            expect(tmpArr[9]).toBe( 11 );
        });
    });

    describe( 'When using skip()', function() {
        it( 'should return all if no count is passed', function() {
            expect( nums.skip().count() ).toBe( 10 );
            expect( people.skip().count() ).toBe( 9 );
        });

        it( 'should throw if (not a number) is passed as count argument', function() {
            expect(function() { nums.skip('10') }).toThrow();
            expect(function() { nums.skip([]) }).toThrow();
            expect(function() { nums.skip({}) }).toThrow();
        });

        it( 'should skip the first 5 items in nums and return the second 5 when passed 5', function() {
            var tmpArr = nums.skip(5);
            expect(tmpArr.count()).toBe(5);
            expect(tmpArr.first()).toBe(6);
        });

        it( 'should return an empty array if skip is greater then nums length', function() {
            var tmpArr = nums.skip(50);
            expect(tmpArr.count()).toBe(0);
        });

    });

    describe( 'When using take()', function() {
        it( 'should return all if no count is passed', function() {
            expect( nums.take().count() ).toBe( 10 );
            expect( people.take().count() ).toBe( 9 );
        });

        it( 'should throw if (not a number) is passed as count argument', function() {
            expect(function() { nums.take('10') }).toThrow();
            expect(function() { nums.take([]) }).toThrow();
            expect(function() { nums.take({}) }).toThrow();
        });

        it( 'should take the first 2 people when passed 2', function() {
            var tmpArr = people.take(2);
            expect(tmpArr.count()).toBe(2);
            expect(tmpArr.first().full()).toBe('Jon Doe');
        });

        it( 'should return all items if count is greater then nums length', function() {
            var tmpArr = nums.take(50);
            expect(tmpArr.count()).toBe(10);
        });
    });

    describe( 'When using orderBy() or order()', function() {
        describe( 'with arrays made up of primitive types (Date, String, Number)', function() {
            
            it( 'should thorw if prop is passed with array of Date, String or Number', function() {
                expect(function() {numsNotSequential.orderBy('foo')}).toThrow();
                expect(function() {strsNotSequential.orderBy('foo')}).toThrow();
                expect(function() {datesNotSequential.orderBy('foo')}).toThrow();
            });

            it( 'should sort numsNotSequential', function() {
                var tmpArr = numsNotSequential.order();
                expect(tmpArr[0]).toBe(1);
                expect(tmpArr[1]).toBe(2);
                expect(tmpArr[2]).toBe(3);
                expect(tmpArr[3]).toBe(4);
                expect(tmpArr[4]).toBe(5);
                expect(tmpArr[5]).toBe(6);
                expect(tmpArr[6]).toBe(7);
                expect(tmpArr[7]).toBe(8);
                expect(tmpArr[8]).toBe(9);
                expect(tmpArr[9]).toBe(10);
            });

            it( 'should sort strsNotSequential', function() {
                var tmpArr = strsNotSequential.order();
                expect(tmpArr[0]).toBe('a');
                expect(tmpArr[1]).toBe('b');
                expect(tmpArr[2]).toBe('c');
                expect(tmpArr[3]).toBe('d');
                expect(tmpArr[4]).toBe('e');
                expect(tmpArr[5]).toBe('f');
            });

            it( 'should sort datesNotSequential', function() {
                var tmpArr = datesNotSequential.order();
                expect(tmpArr[0].getDay()).toBe(0); //Monday
                expect(tmpArr[1].getDay()).toBe(1); //Tuesday
                expect(tmpArr[2].getDay()).toBe(2); //Wednesday
                expect(tmpArr[3].getDay()).toBe(3); //Thursday
                expect(tmpArr[4].getDay()).toBe(4); //Friday
            });
        })
        describe( 'with arrays made up of objects', function() {
            it( 'should default compare (a - b) when no prop is passed', function() {
                var tmpArr = people.order();
                expect(tmpArr[0]).toBe(people[0]);
                expect(tmpArr[1]).toBe(people[1]);
                expect(tmpArr[2]).toBe(people[2]);
                expect(tmpArr[3]).toBe(people[3]);
                expect(tmpArr[4]).toBe(people[4]);
                expect(tmpArr[5]).toBe(people[5]);
                expect(tmpArr[6]).toBe(people[6]);
                expect(tmpArr[7]).toBe(people[7]);
                expect(tmpArr[8]).toBe(people[8]);
            });

            it( 'should sort on "dob" of people', function() {
                var tmpArr = people.orderBy('dob');
                expect(tmpArr.first().full()).toBe('Adam Bo');
                expect(tmpArr[8].full()).toBe('Jesus Sims');
            });

            it( 'should sort on "last" of people', function() {
                var tmpArr = people.orderBy('last');
                expect(tmpArr[0].last).toBe('Assar');
                expect(tmpArr[8].last).toBe('Weeks');
            });

            it( 'should sort on "age" of people', function() {
                var tmpArr = people.orderBy('age');
                expect(tmpArr[0].full()).toBe('Jesus Sims');
                expect(tmpArr[8].full()).toBe('Adam Bo');
            });
        });
    });

    describe( 'when using toDictionary() - toHash()', function() {
        it( 'should use the index of the array when no argument key is provided', function() {
            var hash = nums.toHash();
            expect(hash[0]).toBe(1);
            expect(hash[9]).toBe(10);
        });

        it( 'should throw if key argument is supplied on arrays of primimitive types (String, Number, Date)', function() {
            expect(function() {numsNotSequential.toHash('foo')}).toThrow();
            expect(function() {strsNotSequential.toHash('foo')}).toThrow();
            expect(function() {datesNotSequential.toHash('foo')}).toThrow();
        });

        it( 'should use the value of each object in people by argument key as hash key', function(){
            var obj = people.toHash('last');
            expect(obj['Bo'].full()).toBe('Adam Bo');
        });

    });

    describe( 'when using sum()', function() {
        it( 'should thorw if the data is not a Number', function() {
            expect(function() {strsNotSequential.sum()}).toThrow();
        });

        it( 'should return 55 for nums', function() {
            expect(nums.sum()).toBe(55);
        });

        it( 'should return 238 for people when passed arg of age', function() {
            expect(people.sum('age')).toBe(238);
        });
    });

    describe( 'when using average() - mean()', function() {
        it( 'should thorw if the data is not a Number', function() {
            expect(function() {strsNotSequential.average()}).toThrow();
        });

        it( 'should return 5.5 for nums', function() {
            expect(nums.average()).toBe(5.5);
        });

        it( 'should return 26.444444444444443 for people when passed arg of age', function() {
            expect(people.mean('age')).toBe(26.444444444444443);
        });
    });

    describe( 'when using each()', function() {
        it( 'should throw if no func arg is provided', function() {
            expect(function() {nums.each()}).toThrow()
        });

        it( 'should iterate through each item in array and execute the provided function', function() {
            var count = 0, arr = [];
            nums.each(function(item, i) {
                count++;
                arr.push(i);
            });
            expect(count).toBe(10);
            expect(arr.count()).toBe(10);
        });
    });
    
    describe( 'when using max()', function() {
        it( 'should throw if array values are not numbers', function() {
            expect(function() {strsNotSequential.max()}).toThrow()
        });

        it( 'should return 10 for nums', function(){
            expect(nums.max()).toBe(10);
        });

        it( 'should return 31 for people when passed age', function() {
            expect(people.max('age')).toBe(34);
        });
    });

    describe( 'when using min()', function() {
        it( 'should throw if array values are not numbers', function() {
            expect(function() {strsNotSequential.min()}).toThrow()
        });

        it( 'should return 1 for nums', function(){
            expect(nums.min()).toBe(1);
        });

        it( 'should return 18 for people when passed age', function() {
            expect(people.min('age')).toBe(18);
        });
    });

    describe( 'when using unique()', function() {
        it( 'should remove extra 200 and 98 from numsDups', function() {
            var tmpArr = numsDups.unique();
            expect(tmpArr.count()).toBe(8);
            expect(tmpArr.where(function(x) {return x === 200;}).count()).toBe(1);
            expect(tmpArr.where(function(x) {return x === 98;}).count()).toBe(1);
        });

        it( 'should remove extra a and b from strsDups', function() {
            var tmpArr = strsDups.unique();
            expect(tmpArr.count()).toBe(3);
            expect(tmpArr.where(function(x) {return x === 'a';}).count()).toBe(1);
            expect(tmpArr.where(function(x) {return x === 'b';}).count()).toBe(1);
        });
    });

    describe( 'when using union()', function() {
        it( 'should thorw if no arguments are supplied', function() {
            expect(function(){nums.union()}).toThrow();
        });

        it( 'should only return unique array from nums and numsDups', function() {
            var tmpArr = nums.union(numsDups);
            expect(tmpArr.count()).toBe(15);
            expect(tmpArr.where(function(x) {return x === 5;}).count()).toBe(1);
        });

        it( 'should only return unique array from nums, numsNotSequential and numsDups', function() {
            var tmpArr = nums.union(numsDups, numsNotSequential);
            expect(tmpArr.count()).toBe(15);
            expect(tmpArr.where(function(x) {return x === 5;}).count()).toBe(1);
        });
    });

    describe( 'when using intersect()', function() {
        it( 'should throw when no arguments ar passed', function(){
            expect(function() {nums.intersect()}).toThrow();
        });

        it( 'should only return unique array of like numbers from nums and numsNotSequential', function() {
            var tmpArr = nums.intersect(numsNotSequential);
            expect(tmpArr.count()).toBe(10);
        });

        it( 'should only return unique array of like numbers from nums and numsDups', function() {
            var tmpArr = nums.intersect(numsDups);
            expect(tmpArr.count()).toBe(3);
        });
    });

    describe( 'when using shuffle()', function() {
        it( 'should put nums in random order by value', function() {
            var tmpArr = nums.shuffle();
            expect(tmpArr[0]).not.toBe(nums.shuffle()[0]);
        });

        it( 'should put strsNotSequential in random order by value', function() {
            var tmpArr = strsNotSequential.shuffle();
            expect(tmpArr[0] === strsNotSequential[0] && tmpArr[3] === strsNotSequential[3]).toBe(false);
        });
    });
    
    describe( 'params', function() {

        describe( 'When using sequential indexes', function() {
            var mockSequentialString = '{0} {1} {2}';
            it( 'should replace {0} with first supplied argument of "foo"', function() {
                expect( mockSequentialString.params( 'foo' )).toBe( 'foo {1} {2}' );
            });

            it( 'should replace {1} with second supplied argument of "bar"', function() {
                expect( mockSequentialString.params( 'foo', 'bar' ) ).toBe( 'foo bar {2}' );
            });

            it( 'should replace {2} with second supplied argument of "baz"', function() {
                expect( mockSequentialString.params( 'foo', 'bar', 'baz' ) ).toBe( 'foo bar baz' );
            });
        });

        describe("When using object properties", function() {
            var mockObjectStringSingle = '{firstName} - {lastName}',
                mockObjectStringMultiple = '{firstName} {lastName} - {firstName} {firstName}',
                mockObjectStringCase = '{FirstName} - {LastName}',
                person = {
                    firstName: 'Mock',
                    lastName: 'Smith'
                };

            it( 'should replace {firstName} and {lastName} with values from corresponding prop names of supplied person object', function() {
                expect( mockObjectStringSingle.params( person )).toBe( 'Mock - Smith' );
            });

            it( 'should replace all instances of {firstName} with value from corresponding prop name of supplied person object', function() {
                expect( mockObjectStringMultiple.params( person )).toBe( 'Mock Smith - Mock Mock' );
            });

            it( 'should be case sensitive and not replace {FirstName} and {LastName} with values from supplied person object', function() {
                expect( mockObjectStringCase.params( person )).toBe( '{FirstName} - {LastName}' );
            });
        });
    });

});

