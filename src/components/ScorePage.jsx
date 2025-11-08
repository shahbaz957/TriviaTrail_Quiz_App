import React, { useContext } from 'react'
import { QuizContext } from '../context/QuizContext'

function ScorePage() {
    const { state, dispatch } = useContext(QuizContext)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-10 text-center text-white border border-white/30 max-w-md w-full">
                <h1 className="text-4xl font-bold mb-4">🎉 Quiz Finished!</h1>
                <h2 className="text-3xl font-semibold mb-6">
                    Your Score: <span className="text-black">{state.score}</span>
                </h2>
                <p className="text-white/80 mb-8">
                    Retake to unleash further jewels of Knowledge
                </p>
                <button
                    onClick={() => dispatch({ type: "RESTART" })}
                    className="py-3 px-6 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
                >
                    Restart Quiz
                </button>
            </div>
        </div>
    )
}

export default ScorePage
