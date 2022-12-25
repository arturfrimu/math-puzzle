import React, {useState} from "react";
import classes from "./Puzzle.module.scss";
import ApplauseAudio from '../../assets/sounds/applause.mp3'
import WrongAudio from '../../assets/sounds/wrong.mp3'


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

    const playAudio = () => {
        if (wrongAnswer) {
            return new Audio(WrongAudio)
        } else {
            return new Audio(ApplauseAudio)
        }
    }

    const checkAnswer = () => {
        if (+answer === doAction()) {
            new Audio(ApplauseAudio).play()
            const x = randomIntFromInterval(interval);
            setNums({x, y: randomIntFromInterval({...interval, max: x})})
            setWrongAnswer(false)
            setRandomOperator(operators[randomIntFromInterval({min: 0, max: operators.length - 1})])
            setEquations(prev => prev + 1)
            localStorage.setItem('equations', JSON.stringify(equations + 1))
        } else {
            new Audio(WrongAudio).play()
            console.error('Wrong answer!!!')
            setWrongAnswer(true)
            setEquations(prev => prev - 1)
            localStorage.setItem('equations', JSON.stringify(equations - 1))
        }
        // playAudio().play()
        setAnswer("")
    }

    const submitHandler = (e) => {
        e.preventDefault()
        checkAnswer()
    }

    const errorClass = wrongAnswer ? classes.incorrect : ""

    return (
        <section className={classes["puzzle-sectino"]}>
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
        </section>
    );
};

export default Puzzle;
