// Init functions as false since they're not defined at the start
var C1a = false;  var C1b = false;
var C2a = false;  var C2b = false;
var C2c = false;  var C2d = false;
var C3a = false;  var C3b = false;

// Create closure the "normal" way
function makeAFineFunction(m_in, b_in) { // Word play on "affine" function
  var m = m_in;
  var b = b_in;
  return function(x) { return (m * x) + b; };
}

// Create closure with param "shortcut"
function makeAFineFunctionShort(m_in, b_in) {
  return function(x) { return (m_in * x) + b_in; };
}

// Create closure the "normal" way
function modifyFunction(F, m_in, b_in) {
  var m = m_in;
  var b = b_in;
  return function(x) { return F(m, b, x); };
}

// Create closure that isn't as efficient, but uses .call()
function fullAffineFunction(m, b, x) { // Param list includes all vars in 'y = m*x + b'
  return (m * x) + b;
}

function makeSlowFunction(m_in, b_in) {
  var m = m_in;
  var b = b_in;
  return function(x) { return fullAffineFunction.call(this, m, b, x); };
};

function objSetContext(m_in, b_in) { // No privacy!
  this.m = m_in;
  this.b = b_in;
  this.F = function(x) { return (this.m * x + this.b); }
}

function objSetPrivateContext(m_in, b_in) { // Privacy like closures have
  this.F = function(x) { return (m_in * x + b_in); }
}

myFs = [];

function checkVar(varName, stringIt) {
  var v = eval(varName);
  if ('undefined' == typeof v) {
    mylog('Variable "'+varName+'" is not defined');
  }
  else {
    if (stringIt) { mylog('Variable "'+varName+'" = '+JSON.stringify(v)); }
    else          { mylog('Variable "'+varName+'" = '+v); }
  }
}

function contextPrivacy() {
  mylog('<br>========== Context Privacy in Objects ==========');
  mylog(' -- Normal JS Objects');
//checkVar('C8aObj', true);  checkVar('C8aObj.m', true);  checkVar('C8aObj.b', true);  checkVar('C8aObj.F', false);
  checkVar('C8bObj', true);  checkVar('C8bObj.m', true);  checkVar('C8bObj.b', true);  checkVar('C8bObj.F', false);

  mylog('<br>-- JS Objects w/ privacy. Get private vars - they don\'t exist!<br>NOTE: Stringify() doesn\'t show functions');
//checkVar('C9aObj', true);  checkVar('C9aObj.m', true);  checkVar('C9aObj.b', true);  checkVar('C9aObj.F', false);
  checkVar('C9bObj', true);  checkVar('C9bObj.m', true);  checkVar('C9bObj.b', true);  checkVar('C9bObj.F', false);

  mylog('<br>-- Normal JS Objects, get private vars using param names? Fail!');
//checkVar('C9aObj', true);  checkVar('C9aObj.m_in', true);  checkVar('C9aObj.b_in', true);
  checkVar('C9bObj', true);  checkVar('C9bObj.m_in', true);  checkVar('C9bObj.b_in', true);
  mylog('<br>dummy return val:');
  return 0;
}

function contextInCall() {
  mylog('<br>========== Context in JS\'s call() ==========');
  function fc(a) {
    this.thisZ = a;
    this.print = function() { mylog('this = '+this+', a='+a); }
    this.print();
  }
  fc.call(this, 10);
  fc.call(null,  5);
  var z = new Object;
  z.thisZ = -1;     mylog('z='+z+' z.thisZ='+z.thisZ+'<br>');
  fc.call(z, 99);   mylog('z='+z+' z.thisZ='+z.thisZ);

  return 0;
}


function makeClosures() {
  var e = Math.E;
  var p = Math.PI;
  C1a = makeAFineFunction(1, 0);
  C1b = makeAFineFunction(e, p);

  C2a = makeAFineFunctionShort(1, 0);
  C2b = makeAFineFunctionShort(e, p);

  C3a = modifyFunction(fullAffineFunction, 1, 0);
  C3b = modifyFunction(fullAffineFunction, e, p);

  C4a = makeSlowFunction(1, 0);
  C4b = makeSlowFunction(e, p);

  C5a = function(x) { return fullAffineFunction.call(this, 1, 0, x); }
  C5b = function(x) { return fullAffineFunction.call(this, e, p, x); }

  C6a = function(x) { return fullAffineFunction.apply(this, [1, 0, x]); }
  C6b = function(x) { return fullAffineFunction.apply(this, [e, p, x]); }

  C7a = fullAffineFunction.bind(this, 1, 0);
  C7b = fullAffineFunction.bind(this, e, p);

  C8aObj = new objSetContext(1, 0);
  C8bObj = new objSetContext(e, p);
  C8a = C8aObj.F.bind(C8aObj);
  C8b = C8bObj.F.bind(C8bObj);

  C9aObj = new objSetPrivateContext(1, 0);
  C9bObj = new objSetPrivateContext(e, p);
  C9a = C9aObj.F.bind(C9aObj);
  C9b = C9bObj.F.bind(C9bObj);

  C10a = contextPrivacy;
  C10b = contextInCall;
}

$('.fakeBtnClear').on('click', function() { clearLog(); });

$('.fakeBtn').on('click',
                 function(ev) {
                   var id = ev.target.id;
                 //mylog('target='+ev.target+' id='+id);

		   var x = 1;
		   var jsLine = 'var c='+id+'a(x)';
                 //mylog('jsLine = '+jsLine);
		   eval(jsLine);
		   mylog(id+'a('+x+') = '+c);

		   var jsLine = 'c='+id+'b(x)';
                 //mylog('jsLine = '+jsLine);
		   eval(jsLine);
		   mylog(id+'b('+x+') = '+c);
                 }
                );

$(function() {
  makeClosures();
});