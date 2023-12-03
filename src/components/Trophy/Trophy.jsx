import React from 'react'
import "./Trophy.css"
function Trophy({ winner }) {
    return (
        <div class='wrapper'>
            <div class='glow'></div>
            <div class='mask'>
                <div class='container'>
                    <div class='star'>&#10022;</div>
                    <div class='star sec'>&#10022;</div>
                    {/* <div class='main'></div>
                    <div class='stem1'></div>
                    <div class='stemCrease'></div>
                    <div class='stem2'></div>
                    <div class='base'></div>
                    <div class='arms'></div> */}
                    <img src="https://media.tenor.com/8Er0lHRnauMAAAAi/trophy.gif"/>
                </div>
            </div>
            
            <h1 className='top-[11em] absolute text-white flex flex-col'>
                <span className='font-bold'>Congratulations!</span>
                <span className='font-semibold'>{winner?.name} knows everything</span>
            </h1>
        </div>
    )
}

export default Trophy