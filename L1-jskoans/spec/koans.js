context = describe;

context = describe;

describe("JavaScript", function() {

  describe("has different types and operators", function() {
    it("considers numbers to be equal to their string representation", function() {
      expect(1 == "1").toBeTruthy();
      expect(1 != "1").toBeFalsy();// Truthy or Falsy
    });

    it("knows that numbers and strings are not exactly the same", function() {
      expect(1 === "1").toBeFalsy(); // Truthy or Falsy
      expect(1 !== "1").toBeTruthy(); // Truthy or Falsy
    });

    it("joins parts as string when using the plus operator", function() {
      expect(1 + "a").toEqual("1a"); // give the expected value as argument to toEqual()
    });

    it("operates integers before joining the string", function() {
      // expect(1 + 1 + "2").toEqual(...); //  give the expected value as argument to toEqual()
    });

    it("knows the type of the variable", function() {
      var x = 1;

      // expect(typeof(x)).toEqual('number'); // types are describes as string in JavaScript 
    });

    it("surprises me, NaN is not comparable with NaN", function() {
      // expect(5 / "a").toEqual(5 / "a");
      // expect(typeof(NaN)).toEqual();
      // expect(isNaN(5 / "a")).toBe....(); // Truthy or Falsy
    });

    it("considers an empty string to be falsy", function() {
      //expect("" == false).toBe.....();// Truthy or Falsy
      //expect("" === false).toBe......();// Truthy or Falsy
    });

    it("considers zero to be falsy", function() {
      //expect(0 == false).toBe......();// Truthy or Falsy
      //expect(0 === false).toBe.....();// Truthy or Falsy
    });

    it("considers nulls to be falsy", function() {
      var x = null;
      var result;

      if (x) {
         result = true;
      } else {
         result = false;
      }

      //expect(result == false).toBe......();// Truthy or Falsy
      //expect(null === false).toBe.....();// Truthy or Falsy
      //expect(null == false).toBe....();// Truthy or Falsy
    });

    it("knows the type of a function", function() {
      function x(){}

      //expect(typeof(x)).toBe('...');
    });

    it("has arrays and they can contain anything inside", function() {
      var arr = [1,2,3,4];
      arr.push(5);
      arr[9] = 6;
      var matrix = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 7, 8]];

      /*
      expect(arr[1]).toEqual();
      expect(arr[4]).toEqual();
      expect(arr[6]).toEqual();
      expect(arr[9]).toEqual();
      expect(matrix[0][2]).toEqual();
      */
    });

    it("may contain functions inside arrays", function() {
      var arr = [1,2, function(arg){ return 3 + arg;}];

      //expect(arr[2](1)).toEqual();
    });

    it("concatenate arrays in an 'interesting' way", function() {
      var a = [1,2,3];
      var b = [4,5,6];

      // expect(a + b).toEqual();
    });

    it("joins arrays and other things in an 'interesting' way", function() {
      var a = [1,2,3];

      //expect ("1" + a).toEqual();
      //expect(a + "1").toEqual();
      //expect(1 + a).toEqual();
      //expect(a + 1).toEqual();

      var b = ['x', 'y', 'z'];

      //expect(1 + b).toEqual();
      //expect(true + a).toEqual();
    });

    it("can't compare arrays", function() {
      var a = [1,2,3];
      var b = [1,2,3];

      //expect(a == b).toBe.....();  // Truthy or Falsy
      //expect(a === b).toBe.....(); // Truthy or Falsy
    });

    it("is not the same to compare by value than by reference ", function() {
      var a = [1,2,3];
      var b = [1,2,3];

      //expect(a).toEqual(b);        // Jasmine toEqual compares by value
      //expect(a).not.toBe(b);       // Jasmine toBe compares by reference
    });
  });


  describe("considers functions as first class citizens", function() {
    it("can declare named functions", function() {
      function example() {
        return 'some example';
      }

      //expect(example()).toEqual();
    });

    it("can declare anonymous functions", function() {
      var someVar = function(a, b) {
        return a + b;
      };

      //expect(typeof(someVar)).toBe();
      //expect(someVar(1,1)).toBe();
    });

    it("may return anything", function() {
      function example(arg) {
        return [arg, arg * 2, arg * 3];
      }

      var result = example(2);

      //expect(result[1]).toEqual();
    });

    /* skipped -- do on your free time 
    it("may return arrays that contains functions and so on", function() {
      function example() {
         // write the missing code here
      }

      //expect(example()[0](1)[1]).toEqual(10);
    });
    */ 

    it("doesn't care about the declaration order when they are named", function() {
      function exampleA() {
          return exampleB(1);
      }

      //expect(exampleA()).toEqual();

      function exampleB(arg1) {
          return arg1;
      }
    });

    it("matters, the declaration order when the functions are anonymous", function() {
      var exampleA = function() {
          return exampleB(1);
      };

      //expect(exampleA()).toEqual(1);

      var exampleB = function(arg1) {
          return arg1;
      };
    });

    it("can use optional parameters", function() {
      function example(a, b, c) {
        if (c) {
          return a + b + c;
        }
        return a + b;
      }

      //expect(example(1,1,1)).toBe();
      //expect(example(1,1)).toBe();
    });

    /* skipped -- on your free time
    it("anonymous functions are anonymous", function() {
      var x = function z() {
        return 1;
      };
      //expect(typeof(z)).toEqual();
      //expect(x()).toEqual();
    });
    */ 

    // see: https://en.wikipedia.org/wiki/Closure_(computer_programming)
    it("can create closures with free variables", function() {
      function external() {
        var a = 1;

        function internal() {
          return a + 1;
        }

        return internal();
      }

      //expect(external()).toBe();
    });

    it("can create closures with several free variables", function() {
      function external() {
        var a = 1, b = 2;

        function internal() {
          var c = 3;
          return a + b + c;
        }
      }

      //expect(external()).toBe(6);
    });

    it("defines a pure function when there are no free variables", function() {
      function external() {
        var a = 1, b = 2;

        function internal(a, b) {
          var c = 1;
          return a + b + c;
        }

        return internal(4,4);
      }

      //expect(external()).toBe();
    });

    /* skipped
    it("may return arrays that contains closures and so on", function() {
      function example() {
        // write the missing code here
      }

      //expect(example()[0](1)[1]).toEqual(10);
      //expect(example()[0](2)[1]).toEqual(11);
      //expect(example()[0](3)[1]).toEqual(12);
    }); */

    it("passes primitive types as values (a copy) to functions", function() {
      function example(arg) {
        arg = "test!";
      }

      var x = 1;
      var y = "example";
      var z = true;

      example(x);
      //expect(x).toEqual();

      example(y);
      //expect(y).toEqual();

      example(z);
      //expect(z).toEqual();
    });

    it("passes arrays by reference", function() {
      function example(arg) {
        arg[0] = 100;
      }

      var x = [1,2,3];

      example(x);
      //expect(x).toEqual();
    });

    it("passes objects by reference", function() {
      function example(arg) {
        arg.property = 'test';
      }

      var x = { property: 'cool!' };

      example(x);
      //expect(x).toEqual();
    });

    it("may return a function as the result of invoking a function", function() {
      function add(a, b){
        return a + b;
      }

      function example(){
        return add;
      }

      //expect(example()(1,2)).toEqual();
      var f = example();
      //expect(f(2,2)).toEqual();
    });

    it("can return closures as a function result", function() {
      function plus(amount){
        return function(number){
          return number + amount;
        };
      }

      var f = plus(5);

      //expect(f(3)).toBe();
    });

    it("can have functions that receive other functions as arguments", function() {
      function add(a,b){
        return a + b;
      }

      function example(arg){
        return arg(2,2) + 1;
      }

      //expect(example(add)).toEqual();
    });

    it("may have functions as the input and the output", function() {
      function plus(originalFunction) {
        return function(arg1) {
          return originalFunction() + arg1;
        };
      }

      var f = plus(function() {return 1;});

      //expect(f(2)).toBe();
    });

    // call: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    // apply: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    it("can invoke functions indirectly using the special 'call' and 'apply' functions", function() {
      function f(a, b){
        return a + b;
      }

      //expect(f.call(f,1,1)).toEqual();
      //expect(f.apply(f, [1,1])).toEqual();
    });

    it("doesnt have a private scope inside blocks", function() {
      var j = 0;
      for (var i = 0; i < 5; i++) {
        j += i;
      }

      //expect(i).toEqual();
      //expect(j).toEqual();
    });
  });

  describe("has multiple ways to define and create objects", function() {
    it("can define object literals", function() {
        var obj = {
          name:    'bob',
          theName: function() {
            return this.name;
          }
        };

        //expect(obj.theName()).toBe();
    });

    it("can create properties dynamically", function() {
      var obj = {
        name:    'bob',
        surname: 'sponge'
      };
      obj.address = 'palm tree';

      //expect(obj.address).toEqual();
      //expect(obj['address']).toEqual();
      //expect(obj['name']).toEqual();
    });

    it("may define complex objects", function() {
      var user;
      // write the contents of the obj to make the satisfy the expectations:

      //expect(user.address.street).toEqual('sesame');
      //expect(user.friends[0].name).toEqual('triki');
    });

    /* skipped--ES6 has better ways to define objects and classes
    it("has a pattern called, the Module Pattern", function() {
      function createObject() {
        var points = 0;

        return {
          addPoint: function(){ ++points; },
          score:    function(){ return points; }
        };
      }

      var obj = createObject();
      obj.addPoint();

      //expect(obj.score()).toEqual();
      //expect(typeof(obj.points)).toEqual();
    }); */
    
    /* skipped--ES6 has better ways to define objects and classes
    it("may create objects also with the module pattern", function() {
      function createObject(initialScore) {
        // write the code here
      }

      
      //var obj = createObject(5, 'red');
      //obj.incrementScoreIn(5);
      //expect(obj.color).toEqual('red');
      //expect(obj.points()).toEqual(10);
      
    }); */

    /* skipped--ES6 has better ways to define objects and classes
    it("can define constructors", function() {
      function Obj() {
        var name = 'bob';

        this.theName = function() {
          return name;
        };
      }

      var obj = new Obj();
      //expect(obj.theName()).toBe();
    }); */

    /* skipped--ES6 has better ways to define objects and classes
    it("may contain 'static' methods", function() {
      function Obj() {
        var name = 'bob';

        this.theName = function() {
          return name;
        };
      }

      Obj.someStaticMethod = function() {
        return 22;
      };

      //expect(Obj.someStaticMethod()).toBe();
    }); */

    /* skipped--ES6 has better ways to define objects and classes
    it("can have have methods in the prototype", function() {
      function Obj() {
        var name = 'bob';
      }

      Obj.prototype.theName = function() {
        return this.name;
      };

      var obj = new Obj();
      //expect(obj.theName()).toEqual();
      //expect(obj.theName).toBe(new Obj().theName);
    }); */

    /* skipped--ES6 has better ways to define objects and classes
    it("can define a factory", function() {
      function obj() {
        var self = {};
        var name = 'bob';

        self.theName = function() {
          return name;
        };

        return self;
      }

      var instance = obj();
      //expect(instance.theName()).toBe();
      //expect(instance.theName).not.toBe(obj().theName);
    }); */

    /* skipped--ES6 has better ways to define objects and classes
    it("can create methods dynamically on an object instance", function() {
        var obj = {};
        var methodNames = ['meow', 'jump'];

        for (var i = 0; i < methodNames.length; i++) {
          obj[[methodNames[i]]] = function() { return 'it works'; };
        }

        //expect(obj.meow()).toEqual();
    }); */

    /*
    describe("the polymorphism", function() {
      it("may use constructor plus prototype", function() {
        function Parent() {
          this.name = 'parent';
        }
        Parent.prototype.someMethod = function() {
          return 10;
        };

        function Child() {
          Parent.call(this); // constructor stealing
          this.name = 'child';
        }
        Child.prototype = Object.create(Parent.prototype); // prototype chaining

        var child = new Child();
        //expect(child.someMethod()).toEqual();
        //expect(child.name).toEqual();
      });

      it("may use the functional inheritance", function(){
        function parent() {
          var name = 'parent';
          var self = {};
          self.someMethod = function() {
              return 10;
          };
          return self;
        }

        function child() {
          var name = 'child';
          var self = parent();
          return self;
        }

        var instance = child();
        //expect(instance.someMethod()).toBe();
      });

    }); */
  });

  /* skipped, do at home if you want
  describe("commons patterns with functions and behaviors", function() {
    it("can invoke functions immediately to take advantage of scopes", function() {
      var myNamespace = {};

      (function(theNamespace) {
          var counter = 0;

          theNamespace.addOne = function() {
            counter++;
          };

          theNamespace.giveMeTheCount = function() {
            return counter;
          };

      }(myNamespace));

      myNamespace.addOne();
      myNamespace.addOne();

      //expect(myNamespace.giveMeTheCount()).toBe();
    }); 

    // more about hoisting: https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-what-is-hoisting-in-javascript-a63c1b2267a1
    // skipped -- don't use var anyways!
    it("hoists variables the way you probably don't expect", function() {
      function generate() {
        var functions = [];
        for (var i = 0; i < 5; i++) {
          functions.push(function() {
            return i;
          });
        }
        return functions;
      }

      //expect(generate()[0]()).toEqual();
      //expect(generate()[1]()).toEqual();
    }); 
  }); */

  /* skipped---use ES6 classes
  context("has ways to simulate classes", function() {
    // "Class"
    function Cat() {
      this.kilos = 1;
      this.feed = function() {
        this.kilos++;
      };
      this.isPurring = function() {
        return true;
      };
    }

    //////////////////////////////////////
    // "Class"
    //////////////////////////////////////
    function Lion(energy) {
      Cat.call(this);
      this.energy = energy || 100;
      var self = this;

      var run = function() { // private method
        self.energy -= 10;
      };
      var attack = function() { // private method
        self.energy -= 5;
      };
      this.playWithFriend = function(friend) {
        if (friend.isPurring())
          self.energy += 10;
      };
      this.hunt = function(){ // public method
        run();
        attack();
        this.onHunting(); // fire event
      };
      this.onHunting = function() { event }; // event handler
    }

    context("and the THIS keyword", function() {
      var cat;

      beforeEach(function() {
        cat = new Cat();
        window.kilos = 0;
      });

      it("sometimes works as expected in other languages", function() {
        cat.feed();
        cat.feed();

        //expect(cat.kilos).toEqual();
      });

      it("works different on detached functions", function() {
        window.kilos = 10;
        var feed = cat.feed;

        feed();

        //expect(window.kilos).toEqual();
        //expect(cat.kilos).toEqual();
      });

      it("can be bound explicitly with CALL and APPLY", function() {
        var feed = cat.feed;
        feed.apply(cat);

        //expect(cat.kilos).toEqual();
      });

      it("can be bound in modern browsers with BIND", function() {
        var feed = cat.feed;
        var bound = feed.bind(cat);

        bound();

        //expect(cat.kilos).toEqual();
      });

      it("works different when function is attached to other object", function() {
        var otherCat = new Cat();
        otherCat.kilos = 10;
        otherCat.feed = cat.feed;

        otherCat.feed();
        //expect(otherCat.kilos).toEqual();
        //expect(cat.kilos).toEqual();
      });

      it("can be handled using the SELF trick", function() {
        var energy = 200;
        var lion = new Lion(energy);

        lion.hunt();

        //expect(lion.energy).toEqual();
      });

      it("interprets the THIS when the function is executed", function() {
        var energy = 200;
        var lion = new Lion();

        lion.hunt = function() {
          this.energy = 4000;
        };
        lion.hunt();

        //expect(lion.energy).toEqual();
      });
    }); 
  }); */
});


/*********************************
********* PAIR PROGRAMMING *********
**********************************/

describe('JavaScript ES6', () => {
describe('`let` restricts the scope of the variable to the current block - ', () => {
  describe('`let` vs. `var`.', () => {
    it('`var` works as usual, it does not restricts scope', () => {
      if (true) {
        /*You should add your code in here*/
      }
      // expect(varX).toBe(true);
    });

    it('`let` restricts scope to inside the block', () => {
      /*var or const? letX = false*/
      if (true) {
        /*var or const? letX = true*/
      }
      //expect(letX).toBe(false);
    });

    it('`var` does not restricts scope to inside the block in `for` loops', () => {
      /*var or let? counter = 100*/
      /*for (var or let? counter = 1; counter < 50; counter++){}*/

      //expect(counter).toBe(50);
    });

    it('`let` restricts scope to inside the block also in `for` loops', () => {
      /*var or let? counter = 100*/
      /*for (var or let? counter = 1; counter < 50; counter++){}*/

      //expect(counter).toBe(100);
    });
  });

});

describe('`const` is like `let` plus read-only. ', () => {

  describe('scalar values are read-only', () => {
    it('number are read-only', () => {
      // const constNum = 0;
      // constNum = 1;

      //expect(constNum).toBe(0);
    });

    it('string are read-only', () => {
      // const constString = "I am a const";
      // constString = "Cant change you?";

      //expect(constString).toBe("I am a const");
    });

  });

  /*var, let or const? notChangeable = 23;*/

  it('const scope leaks too', () => {
    //expect(notChangeable).toBe(23);
  });

  describe('complex types are NOT fully read-only', () => {

    it('arrays is not fully read-only', () => {
      const arr = [42, 23];

      //expect(arr[0]).toBe(0);
    });

    it('objects are not fully read-only', () => {
      const obj = {x: 1};

      //expect(obj.x).toBe(2);
    });

  });

});

describe('`string.includes()` finds string within another string. ', () => {

  describe('find a single character', function() {
    it('in a three char string', function() {
      /* const searchString = ???? */
      //expect('xyz'.includes(searchString)).toBe(true);
    });
    it('reports false if character was not found', function() {
      /* const expected = ????*/;
      //expect('xyz'.includes('abc')).toBe(expected);
    });
  });

  describe('find a string', function() {
    it('that matches exactly', function() {
      /* const findSome = .... => 'xyz'.includes();*/
      //expect(findSome('xyz')).toBe(true);
    });
  });

  describe('search for an empty string, is always true', function() {
    it('in an empty string', function() {
      /* .... */
      //expect(''.includes(x)).toBe(true);
    });
    it('in `abc`', function() {
      /* .... */
      //expect('abc'.includes(x)).toBe(true);
    });
  });

  describe('takes a position from where to start searching', function() {
    it('does not find `a` after position 1 in `abc`', function() {
      /*....*/
      //expect('abc'.includes('a', position)).toBe(false);
    });
    it('even the position gets coerced', function() {
      /*const findAtPosition = (pos) => 'xyz'.includes(?????);*/
      //expect(findAtPosition('2')).toBe(true);
    });
    describe('invalid positions get converted to 0', function() {
      it('e.g. `undefined`', function() {
        /*const findAtPosition = (pos) => 'xyz'.includes(?????); */
        //expect(findAtPosition(void 0)).toBe(true);
      });
     
      /* skipped -- you get the point 
      it('negative numbers', function() {
        // const findAtPosition = (pos) => 'xyz'.includes(????); 
        //expect(findAtPosition(-2)).toBe(true);
      });
      it('NaN', function() {
        // const findAtPosition = (pos) => 'xyz'.includes(?????); 
        //expect(findAtPosition(NaN)).toBe(true);
      }); */
    });
  });

});

describe('a template string, is wrapped in ` (backticks) instead of \' or ". ', () => {

  describe('by default, behaves like a normal string', function() {
    it('just surrounded by backticks', function() {
      /*let str = ??????*/
      //expect(str).toEqual('like a string');
    });

  });

  let x = 42;
  let y = 23;

  describe('can evaluate variables, which are wrapped in "${" and "}"', function() {

    it('e.g. a simple variable "${x}" just gets evaluated', function() {
      let evaluated = `x=x`
      //expect(evaluated).toBe('x=' + x);
    });

    it('multiple variables get evaluated too', function() {
      var evaluated = `x+y`;
      //expect(evaluated).toBe(x + '+' + y);
    });

  });

  describe('can evaluate any expression, wrapped inside "${...}"', function() {

    it('all inside "${...}" gets evaluated', function() {
      var evaluated = Number(`x+y`);
      //expect(evaluated).toBe(x+y);
    });

    it('inside "${...}" can also be a function call', function() {
      function getSchool(){
        return 'Ironhack';
      }
      var evaluated = `getSchool()`;
      //expect(evaluated).toBe('Ironhack');
    });

  });

});

describe('The object literal allows for new shorthands. ', () => {

  const x = 1;
  const y = 2;

  describe('with variables', () => {
    it('the short version for `{y: y}` is {y}', () => {
      /*.....*/
      //expect(short).toEqual({y: y});
    });
    it('works with multiple variables too', () => {
      /*.....*/
      //expect(short).toEqual({x: x, y: y});
    });
  });

  describe('with methods', () => {

    const func = () => func;

    it('using the name only uses it as key', () => {
      /*.......*/
      //expect(short).toEqual({func: func});
    });

    it('a different key must be given explicitly, just like before ES6', () => {
      /*.......*/
      //expect(short).toEqual({otherKey: func});
    });
  });

});

// destructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
describe('destructuring arrays makes shorter code. ', () => {

  it('extract value from array, e.g. extract 0 into x like so `let [x] = [0];`', () => {
    let firstValue = [1];
    //expect(firstValue).toEqual(1);
  });

  it('swap two variables, in one operation', () => {
    let [x, y] = ['ax', 'why'];
    [x, y] = [x, y];
    //expect([x, y]).toEqual(['why', 'ax']);
  });

  it('leading commas', () => {
    const all = ['ax', 'why', 'zet'];
    const [z] = all;
    //expect(z).toEqual('zet');
  });

  it('extract from nested arrays', () => {
    const user = [['Some', 'One'], 23];
    const [firstName, surname, age] = user;

    const expected = 'Some One = 23 years';
    //expect(`${firstName} ${surname} = ${age} years`).toEqual(expected);
  });

  it('chained assignments', () => {
    let c, d;
    // let a, b = c, d = [1, 2];
    //expect([a, b, c, d]).toEqual([1, 2, 1, 2]);
  });

});

describe('destructuring also works on strings. ', () => {

  it('destructure every character', () => {
    let a, b, c = 'abc';
    //expect([a, b, c]).toEqual(['a', 'b', 'c']);
  });

  it('missing characters are undefined', () => {
    const [a, c] = 'ab';
    //expect(c).toEqual(void 0);
  });
});

describe('destructuring objects. ', () => {

  it('is simple', () => {
    const x = {x: 1};
    //expect(x).toEqual(1);
  });

  describe('nested', () => {
    it('multiple objects', () => {
      const magic = {first: 23, second: 42};
      /*const first, second  = ??????*/
      //expect(second).toEqual(42);
    });
    it('object and array', () => {
      const {z:x} = {z: [23, 42]};
      //expect(x).toEqual(42);
    });
    it('array and object', () => {
      const lang = [null, [{env: 'browser', lang: 'ES6'}]];
      //expect(lang).toEqual('ES6');
    });
  });

  describe('interesting', () => {
    it('missing refs become undefined', () => {
      const z = {x: 1, y: 2};
      //expect(z).toEqual(void 0);
    });
  });

});

describe('destructuring can also have default values. ', () => {

  it('for an empty array', () => {
    const [a] = [];
    //expect(a).toEqual(1)
  });

  it('for a missing value', () => {
    const [a,b,c] = [1,,3];
    //expect(b).toEqual(2);
  });

  it('in an object', () => {
    const [a, b] = [{a: 1}];
    //expect(b).toEqual(2);
  });

  it('if the value is undefined', () => {
    const {a, b} = {a: 1, b: void 0};
    //expect(b).toEqual(2);
  });

  it('also a string works with defaults', () => {
    const [a, b] = '1';
    //expect(a).toEqual('1');
    // expect(b).toEqual(2);
  });

});

// documentation on arrow functions:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
describe('arrow functions. ', () => {

  it('are shorter to write', function() {
    let func = () => {
      /*........*/
    };
    // expect(func()).toBe('I am func');
  });

  it('a single expression, without curly braces returns too', function() {
    /*let func = () => .........;*/
    //expect(func()).toBe('I return too');
  });

  it('one parameter can be written without parens', () => {
   /* let func = ........;*/
    //expect(func(25)).toEqual(24)
  });

  it('many params require parens', () => {
    /* let func = ........;*/
    //expect(func(23,42)).toEqual(23+42)
  });

  it('body needs parens to return an object', () => {
    let func = () => {iAm: 'an object'}
    // expect(func()).toEqual({iAm: 'an object'});
  });

  class LexicallyBound {

    getFunction() {
      return () => {
        return new LexicallyBound(); /*changes might go here*/
      };
    }

    getArgumentsFunction() {
      return function() { return arguments; }; /*or here*/
    }
  }

  describe('arrow functions have lexical `this`, no dynamic `this`', () => {

    it('bound at definition time, use `=>` ', function() {
      let bound = new LexicallyBound();
      let fn = bound.getFunction();

      //expect(fn()).toBe(bound);
    });

    it('can NOT bind a different context', function() {
      let bound = new LexicallyBound();
      let fn = bound.getFunction();
      let anotherObj = {};
      let expected = anotherObj; //change this

      //expect(fn.call(anotherObj)).toBe(expected);
    });

    it('`arguments` doesnt work inside arrow functions', function() {
      let bound = new LexicallyBound();
      let fn = bound.getArgumentsFunction();

      //expect(fn(1, 2).length).toEqual(0);
    });

  });

});

describe('destructuring function parameters. ', () => {

  describe('destruct parameters', () => {
    it('multiple params can come from a single object', () => {
      const fn = () => {
        //expect(id).toEqual(42);
        //expect(name).toEqual('Wolfram');
      };
      const user = {name: 'Wolfram', id: 42};
      fn(user);
    });

    it('multiple params from array/object', () => {
      const fn = ([]) => {
        //expect(name).toEqual('Alice');
      };
      const users = [{name: 'nobody'}, {name: 'Alice', id: 42}];
      fn(users);
    });
  });

  describe('default values', () => {
    it('for simple values', () => {
      const fn = (id, name) => {
        //expect(id).toEqual(23);
        //expect(name).toEqual('Bob');
      };
      fn(23);
    });

    it('for a missing array value', () => {
      const defaultUser = {id: 23, name: 'Joe'};
      const fn = ([user]) => {
        //expect(user).toEqual(defaultUser);
      };
      fn([]);
    });

    it('mix of parameter types', () => {
      const fn = (id, [arr], {obj}) => {
        //expect(id).toEqual(1);
        //expect(arr).toEqual(2);
        //expect(obj).toEqual(3);
      };
      fn(void 0, [], {});
    });
  });

});

describe('assign object property values to new variables while destructuring. ', () => {

  describe('for simple objects', function() {
    it('use a colon after the property name, like so `propertyName: newName`', () => {
      const {x} = {x: 1};
      //expect(y).toEqual(1);
    });

    it('assign a new name and give it a default value using `= <default value>`', () => {
      const {x} = {y: 23};
      //expect(y).toEqual(42);
    });
  });

  describe('for function parameter names', function() {
    it('do it the same way, with a colon behind it', () => {
      const fn = ({x}) => {
       //expect(y).toEqual(1);
      };
      fn({x: 1});
    });

    it('giving it a default value is possible too, like above', () => {
      const fn = ({x}) => {
        //expect(y).toEqual(3);
      };
      fn({});
    });
  });

});

// rest parameters: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
describe('rest with destructuring', () => {

  it('rest parameter must be last', () => {
    const [all] = [1, 2, 3, 4];
    //expect(all).toEqual([1, 2, 3, 4]);
  });

  it('assign rest of an array to a variable', () => {
    const [all] = [1, 2, 3, 4];
    //expect(all).toEqual([2, 3, 4]);
  });
});

// spread syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
describe('spread with arrays. ', () => {

  it('extracts each array item', function() {
    const [] = [...[1, 2]];
    //expect(a).toEqual(1);
    //expect(b).toEqual(2);
  });

  it('in combination with rest', function() {
    const [a, b, ...rest] = [...[0, 1, 2, 3, 4, 5]];
    //expect(a).toEqual(1);
    //expect(b).toEqual(2);
    //expect(rest).toEqual([3, 4, 5]);
  });

  it('spreading into the rest', function() {
    const [...rest] = [...[,1, 2, 3, 4, 5]];
    //expect(rest).toEqual([1, 2, 3, 4, 5]);
  });

  describe('used as function parameter', () => {
    it('prefix with `...` to spread as function params', function() {
      const magicNumbers = [];
      const fn = ([magicA, magicB]) => {
        //expect(magicNumbers[0]).toEqual(magicA);
        //expect(magicNumbers[1]).toEqual(magicB);
      };
      fn(magicNumbers);
    });
  });
});

describe('spread with strings', () => {

  it('simply spread each char of a string', function() {
    const [b, a] = ['ba'];
    //expect(a).toEqual('a');
    //expect(b).toEqual('b');
  });

  it('works anywhere inside an array (must not be last)', function() {
    const letters = ['a', 'bcd', 'e', 'f'];
    //expect(letters.length).toEqual(6);
  });

});


describe('class creation', () => {

  it('is as simple as `class XXX {}`', function() {
    let TestClass = {};

    // const instance = new TestClass();
    //expect(typeof instance).toBe('object');
  });

  it('class is block scoped', () => {
    class Inside {}
    { class Inside {} }
    //expect(typeof Inside).toBe('undefined');
  });

  it('special method is `constructor`', function() {
    class User {
      constructor(id) {

      }
    }

    const user = new User(42);
    //expect(user.id).toEqual(42);
  });

  it('defining a method is simple', function() {
    class User {

    }

    const notATester = new User();
    //expect(notATester.writesTests()).toBe(false);
  });

  it('multiple methods need no commas (opposed to object notation)', function() {
    class User {
      wroteATest() { this.everWroteATest = true; }
      isLazy()     {  }
    }

    const tester = new User();
    //expect(tester.isLazy()).toBe(true);
    tester.wroteATest();
    //expect(tester.isLazy()).toBe(false);
  });

  it('anonymous class', () => {
    const classType = typeof {};
    //expect(classType).toBe('function');
  });

});
});
