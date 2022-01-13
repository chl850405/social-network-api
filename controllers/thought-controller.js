//functionality of Thoughts
const { Thought, User } = require("../models");

const userController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    User.find({})
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by its _id
  getThoughtById({ params }, res) {
    User.findOne({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
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
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Thought created but, no user found with this id!' });
        }
        res.json({ message: 'Thought successfully created!' });
      })
      .catch(err => res.json(err));
  },

  // PUT to update a thought by its _id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      runValidators: true,
      new: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbUThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE to remove thought by its _id
  deleteThought({ params }, res) {
    User.findOneAndDelete({ _id: params.thoughtid })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  //   POST to create a reaction stored in a single thought's reactions array field
  addReaction({ body }, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: body } },
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

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteReaction({ body }, res) {
    Thought.findOneAndUpdate(
      { _id: body.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
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
module.exports = userController;
