module.exports = {
  database:
    "mongodb+srv://Dhruvish:Dhruvish@dmazon-uqk7p.mongodb.net/dmazon?retryWrites=true&w=majority",
  port: 3000,
  secretKey: "dhruvishp158",
  facebook: {
    clientID: process.env.FACEBOOK_ID || "924842001325483",
    clientSecret:
      process.env.FACEBOOK_SECRET || "12420045686eb3e4514e93fb2ff295bf",
    profileFields: ["emails", "displayName"],
    callbackURL: "http://localhost:3000/auth/facebook/callback",
  },
};
