import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";
import { stepOneData, stepTwoData } from "./constants";

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.

Empirica.gameInit((game, treatment, players) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.pluck(players, "id")
  );

  //we don't know the sequence yet
  let taskSequence = game.treatment.StepOne ? stepOneData : stepTwoData;

  if (game.treatment.taskOrder === "shuffle") {
    //TODO: I need to make sure that I keep the first task fixed (if it has training)
    //taskSequence = _.shuffle(taskSequence); //this is full shuffle
    taskSequence = customShuffle(taskSequence); //this is with keeping the first practice round fixed
  }
  if (game.treatment.taskOrder === "reverse") {
    console.log("reversing the order of the tasks");
    //the .slice() so it does not mutate the actually array (i.e., next time it seems to effect the server code)
    taskSequence = taskSequence.slice().reverse();
  }

  //we'll have 1 round, each task is one stage
  const round = game.addRound();
  _.times(taskSequence.length, i => {
    const stage = round.addStage({
      name: i === 0 ? "practice" : i,
      displayName: taskSequence[i].difficulty,
      durationInSeconds: game.treatment.stageDuration
    });
    stage.set("task", taskSequence[i]);
  });
});

// fix the first practice task and shuffle the rest
//to learn more:
//https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
function customShuffle(taskSequence) {
  // Find and remove first and last:
  const practiceTask = taskSequence[0];

  const firstIndex = taskSequence.indexOf(practiceTask);

  if (firstIndex !== -1) {
    taskSequence.splice(firstIndex, 1);
  }

  // Normal shuffle with the remaining elements using ES6:
  for (let i = taskSequence.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));

    [taskSequence[i], taskSequence[j]] = [taskSequence[j], taskSequence[i]];
  }

  // Add them back in their new position:
  if (firstIndex !== -1) {
    taskSequence.unshift(practiceTask);
  }

  return taskSequence;
}
