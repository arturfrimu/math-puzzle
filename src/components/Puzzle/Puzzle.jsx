import React, {useState} from "react";
import classes from "./Puzzle.module.scss";
import ApplauseAudio from '../../assets/sounds/applause.mp3'
import WrongAudio from '../../assets/sounds/wrong.mp3'

import firework1 from '../../assets/gif/firework1.gif'
import firework2 from '../../assets/gif/firework2.gif'

const interval = {min: 2, max: 10}

const randomIntFromInterval = ({min, max}) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const operators = ["+", "-"]
const x = randomIntFromInterval(interval);

const Puzzle = () => {
    const [nums, setNums] = useState({x, y: randomIntFromInterval({...interval, max: x})})
    const [answer, setAnswer] = useState("")
    const [wrongAnswer, setWrongAnswer] = useState(false)
    const [randomOperator, setRandomOperator] = useState(operators[randomIntFromInterval({
        min: 0,
        max: operators.length - 1
    })])
    const [equations, setEquations] = useState(JSON.parse(localStorage.getItem('equations')) || 0)
    const [gif, setGif] = useState(false)

    const generateEq = () => {
        return `${nums.x} ${randomOperator} ${nums.y} = ${answer ? answer : "?"}`
    }

    function doAction() {
        if (randomOperator === "+") {
            return nums.x + nums.y;
        } else if (randomOperator === "-") {
            return nums.x - nums.y;
        }
    }

    const playAudio = (audio) => {
        new Audio(audio).play()
    }

    const checkAnswer = () => {
        if (+answer === doAction()) {
            playAudio(ApplauseAudio)
            const x = randomIntFromInterval(interval);
            setNums({x, y: randomIntFromInterval({...interval, max: x})})
            setWrongAnswer(false)
            setRandomOperator(operators[randomIntFromInterval({min: 0, max: operators.length - 1})])
            setEquations(prev => prev + 1)
            localStorage.setItem('equations', JSON.stringify(equations + 1))

            setGif(true)
            setTimeout(() => setGif(false), 5000)
        } else {
            playAudio(WrongAudio)
            setWrongAnswer(true)
            setEquations(prev => prev - 1)
            localStorage.setItem('equations', JSON.stringify(equations - 1))
        }
        setAnswer("")
    }

    const submitHandler = (e) => {
        e.preventDefault()
        checkAnswer()
    }

    const errorClass = wrongAnswer ? classes.incorrect : ""

    return (
        <section className={classes["puzzle-sectino"]}>
            {gif && <img src={firework1} alt=""/>}
            <div className={classes.puzzle}>
                <div className={classes.puzzle__board}>
                    <div className={classes.puzzle__equations}>Exercitii rezolvate: {equations}</div>
                    <span>{generateEq()}</span>
                </div>
                <form className={classes.puzzle__answer} onSubmit={submitHandler}>
                    <input type="number" onChange={e => setAnswer(e.target.value)} value={answer}
                           className={errorClass} placeholder={wrongAnswer ? "Raspuns gresit" : ""}/>
                </form>
            </div>
            {gif && <img src={firework2} alt=""/>}
        </section>
    );
};

export default Puzzle;
