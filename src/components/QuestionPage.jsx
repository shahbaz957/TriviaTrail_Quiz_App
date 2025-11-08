import React, { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";

function QuestionPage({ question, options, idx, orgAnswer, total }) {
  const { state, dispatch } = useContext(QuizContext);
  const [answer, setAnswer] = useState(null);
  // setAnswer(null);
  useEffect(() => {
    if (state.timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
      return () => clearInterval(timer);
    }else{
        dispatch({type : "TIME_UP"})
    }
  }, [dispatch , state.timeLeft]);

  useEffect(() => {
    setAnswer(null);
  }, [idx]);

  return (
    <div className="max-w-xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-8 text-white shadow-lg border border-white/30">

      {/* Timer */}
<div className="mb-6">
  <h2 className="text-lg font-semibold mb-2">Time Left</h2>
  <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
    <div
      className={`h-4 rounded-full transition-all duration-300 ${
        state.timeLeft <= 5
          ? "bg-red-500"
          : state.timeLeft <= 10
          ? "bg-yellow-400"
          : "bg-green-400"
      }`}
      style={{ width: `${(state.timeLeft / 15) * 100}%` }}
    ></div>
  </div>
  <p className="text-right text-sm mt-1">{state.timeLeft}s</p>
</div>

      {/* Question */}
      <h1 className="text-2xl font-bold mb-6">
        Q{idx + 1}: {question}
      </h1>

      {/* Options */}
      <div className="space-y-4">
        {options.map((item, i) => (
          <div
            key={i}
            onClick={() => setAnswer(item)}
            className={`flex items-center p-4 rounded-lg cursor-pointer border transition 
              ${
                answer === item
                  ? "bg-indigo-600/70 border-indigo-400"
                  : "bg-white/10 border-white/30 hover:bg-white/20"
              }`}
          >
            <input
              type="radio"
              name={`question-${idx}`}
              checked={answer === item}
              onChange={() => setAnswer(item)}
              className="accent-indigo-500 w-5 h-5 mr-4"
            />
            <label className="text-white text-lg">{item}</label>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      <button
        onClick={() =>
          dispatch({ type: "PROCEED", correct: answer === orgAnswer })
        }
        disabled={answer === null}
        className={`mt-6 w-full py-3 rounded-xl font-semibold text-indigo-600 transition 
          ${
            answer
              ? "bg-white hover:bg-gray-200"
              : "bg-white/30 cursor-not-allowed"
          }`}
      >
        {idx === total - 1 ? "Finish" : "Next Question"}
      </button>
    </div>
  );
}

export default QuestionPage;
