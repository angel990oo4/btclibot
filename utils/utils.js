module.exports = {
  validUID(uid) {
    return (
      !Number.isInteger(Number(uid)) || Number(uid) < 0 || Number(uid) > 4095
    );
  },
};
