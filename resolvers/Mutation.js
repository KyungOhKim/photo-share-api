module.exports = {
  async postPhoto(parent, args) {
    const newPhoto = {
      ...args.input,
      created: new Date()
    };
    return newPhoto;
  }
};
