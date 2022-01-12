const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address!'],
  },
  thoughts: {
    // Array of _id values referencing the Thought model
    type: Schema.Types.ObjectId,
    ref: "Thought",
  },
  friends: [
    {
    // Array of _id values referencing the User model (self-reference)
    type: Schema.Types.ObjectId,
    ref: "User",
  },
],
},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
});
//Schema Settings
// Create a virtual called friendCount 
userSchema.virtual("friendCount").get
( function () {
  //  retrieves the length of the user's friends 
return this.friends.length;
});

//create user model using user schema
const User = model("User", userSchema);
//exportuser model
module.exports = User;

