const compose = (...fns) => (arg) => {
  return fns.reduce((composed, f) => f(composed),arg);
}

const compose = (...fns) => (args) => {
  let result = args;
  for(let fn of fns.reverse()) {
    result = fn(result);
  }
  return result;
}
