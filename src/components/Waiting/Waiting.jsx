import React from 'react'
import { DotLoader } from 'react-spinners'
import ScoreBoard from '../ScoreBoard/ScoreBoard'
import ResScreen from '../ResScreen/ResScreen'
function Waiting({ unAnswered, selectedOption }) {
    return (
        <>
            {unAnswered?.length === 0 ? (
                // <ScoreBoard se/>
               
                <ResScreen selectedOption={selectedOption}/>
            ) : (
                <DotLoader size={300} color='white' />
            )}
        </>
    )
}

export default Waiting