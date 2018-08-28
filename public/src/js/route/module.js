// m1.js
var foo = 'bar';
function change() {
  foo = "baz";
  return foo
}
export { foo };

export default change();
//setTimeout(() => foo = 'baz', 500);
