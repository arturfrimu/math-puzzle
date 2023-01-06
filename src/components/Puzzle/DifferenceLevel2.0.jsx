import React, {useEffect, useState} from "react";
import classes from "./Puzzle.module.scss";
import ApplauseAudio from '../../assets/sounds/applause.mp3'
import WrongAudio from '../../assets/sounds/wrong.mp3'

import firework1 from '../../assets/gif/firework1.gif'
import firework2 from '../../assets/gif/firework2.gif'

import Lottie from 'react-lottie';
import lottieGif from '../../assets/gif/data.json'
import wrongGif from '../../assets/gif/wrong.json'

const interval = {min: 3, max: 10}

const randomIntFromInterval = ({min, max}) => Math.floor(Math.random() * (max - min + 1) + min)

const gifState = {success: 'success', wrong: 'wrong', none: 'none'}

const operators = ["-"]

const descazut = randomIntFromInterval(interval);
const diferenta = randomIntFromInterval({...interval, max: descazut})

const Puzzle = () => {
    const [nums, setNums] = useState({descazut, diferenta})
    const [answer, setAnswer] = useState("")
    const [wrongAnswer, setWrongAnswer] = useState(false)
    const [randomOperator, setRandomOperator] = useState(operators[randomIntFromInterval({
        min: 0,
        max: operators.length - 1
    })])
    const [equations, setEquations] = useState(JSON.parse(localStorage.getItem('equations')) || 0)
    const [gif, setGif] = useState(gifState.none)

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: lottieGif,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const defaultOptionsWrongText = {
        loop: false,
        autoplay: true,
        animationData: wrongGif,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const generateEq = () => `${nums.descazut} ${randomOperator} ${answer ? answer : "?"} = ${nums.diferenta}`

    const doAction = () => {
        console.log("diferenta: " + diferenta)
        console.log("descazut: " + descazut)
        return nums.descazut - nums.diferenta;
    };

    const playAudio = (audio) => new Audio(audio).play()

    const checkAnswer = () => {
        if (+answer === doAction()) {
            playAudio(ApplauseAudio)
            const descazut = randomIntFromInterval(interval);
            setNums({descazut, diferenta: randomIntFromInterval({...interval, max: descazut})})
            setWrongAnswer(false)
            setRandomOperator(operators[randomIntFromInterval({min: 0, max: operators.length - 1})])
            setEquations(prev => prev + 1)
            localStorage.setItem('equations', JSON.stringify(equations + 1))

            setGif(gifState.success)
        } else {
            playAudio(WrongAudio)
            setWrongAnswer(true)
            setEquations(prev => prev - 1)
            localStorage.setItem('equations', JSON.stringify(equations - 1))

            setGif(gifState.wrong)
        }
        setAnswer("")
    }

    useEffect(() => {
        const time = setTimeout(() => {
            setGif(gifState.none)
        }, 5000)

        return () => clearTimeout(time)
    }, [gif])

    const submitHandler = (e) => {
        e.preventDefault()
        checkAnswer()
    }

    const errorClass = wrongAnswer ? classes.incorrect : ""

    return (
        <section className={classes["puzzle-sectino"]}>
            {gif === 'wrong' && <Lottie options={defaultOptionsWrongText} height={300} width={300}/>}
            <div style={{display: 'flex'}}>
                {gif === 'wrong' && <Lottie options={defaultOptions} height={400} width={400}/>}
                {gif === 'success' && <img src={firework1} alt=""/>}
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
                {gif === 'success' && <img src={firework2} alt=""/>}
                {gif === 'wrong' && <Lottie options={defaultOptions} height={400} width={400}/>}
            </div>
        </section>
    );
};

export default Puzzle;
