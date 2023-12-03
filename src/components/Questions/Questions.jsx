import React from 'react'
import "./Questions.css"
function Questions({ questions, sendQuestion, setIsStart, startQuiz, curQuestion, setCurQuestion, isStart }) {
    return (
        <div className='questionsBody'>
            <div className='questionsDisplay'>

                {questions.map((question) => {
                    return (
                        <div onClick={() => sendQuestion(question)} className='questionCard'>
                            <span>{question.questionText}</span>
                        </div>
                    )
                })}
            </div>
            <div className='startBtn'>
                <button onClick={() => {
                    sendQuestion(questions[curQuestion + 1])
                    setCurQuestion(curQuestion + 1)
                }}
                    disabled={curQuestion === questions.length - 1 ? 'true' : 'false'}
                >Next</button>
                <button onClick={() => startQuiz()}>Start</button>
            </div>
        </div>
    )
}

export default Questions