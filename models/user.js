const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const schema = mongoose.Schema;
let UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  profile: {
    name: { type: String, default: "" },
    picture: { type: String, default: "" },
  },
  address: String,
  history: [
    {
      date: Date,
      paid: { type: Number, default: 0 },
      //   item: { type: schema.Types.ObjectId, ref: "" },
    },
  ],
});

UserSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      console.log(user.password);
      console.log(hash);
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
