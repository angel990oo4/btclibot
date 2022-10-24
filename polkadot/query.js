module.exports = {
  getNeurons(api) {
    return new Promise((resolve, reject) => {
      api.query.subtensorModule.neurons
        .multi(Array.from(new Array(4096), (x, i) => i))
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};
