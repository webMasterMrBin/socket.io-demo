var bar = "fuck";

setTimeout(() => {
  bar = "you";
  console.log("执行module!");
}, 3000);

export { bar };
