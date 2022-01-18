//functionality of Thoughts
const { Thought, User } = require("../models");
const { populate } = require("../models/User");

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      // .sort({ createdAt: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by its _id
  getThoughtById({ params }, res) {
    User.findOne({ _id: params.userId, "thought._id": params.thoughtId })
      .populate("thoughts")
      .then((dbThoughtData) => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
          res
            .status(404)
            .json({
              message: "No thought found with this id! " + params.thoughtId,
            });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST a new thought
  createThought({ body }, res) {
    // // example data
    // {
    //   "username": "lernantino",
    //   "email": "lernantino@gmail.com"
    // }
    console.log(body);
    Thought.create(body)
      .then(({ dbThoughtData }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(404)
            .json({
              message:
                "Thought created but, no user found with this id! " + userId,
            });
          // stop further execution in this callback
          return;
        }
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },
  //   POST to create a reaction stored in a single thought's reactions array field
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      {new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // PUT to update a thought by its _id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      runValidators: true,
      new: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({
              message: "No thought found with this id! " + params.thoughtId,
            });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE to remove thought by its _id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })

      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({
              message: "No thought found with this id! " + params.thoughtId,
            });
          return;
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.status(500).json(err));
  },
  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
module.exports = thoughtController;
