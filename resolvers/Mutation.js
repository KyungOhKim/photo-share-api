const { authorizeWithGithub } = require("../lib");
const fetch = require("node-fetch");
const { ObjectID } = require("mongodb");

module.exports = {
  async postPhoto(parent, args) {
    const newPhoto = {
      ...args.input,
      created: new Date()
    };
    return newPhoto;
  },
  async githubAuth(parent, { code }, { db }) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    });
    if (message) {
      throw new Error(message);
    }
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };
    const {
      ops: [user]
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
    return { user, token: access_token };
  }
};
