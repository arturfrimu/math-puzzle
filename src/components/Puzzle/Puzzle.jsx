import React from "react";
import classes from "./Puzzle.module.scss";

const Puzzle = () => {
  return (
    <section className={classes["puzzle-sectino"]}>
      <div className={classes.puzzle}>
        <div className={classes.puzzle__board}>
          <span>4 + 4 = ?</span>
        </div>
        <div className={classes.puzzle__answers}>
          <button className={classes.puzzle__answer}>2</button>
          <button className={classes.puzzle__answer}>6</button>
          <button className={classes.puzzle__answer}>12</button>
          <button className={classes.puzzle__answer}>8</button>
        </div>
      </div>
    </section>
  );
};

export default Puzzle;
