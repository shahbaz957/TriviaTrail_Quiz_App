import { useContext, useEffect, useState } from "react";
import "./App.css";
import { QuizContext } from "./context/QuizContext";
import QuestionPage from "./components/QuestionPage";
import ScorePage from "./components/ScorePage";
import Loader from "./components/Loader";

function App() {
  const { state, dispatch } = useContext(QuizContext);
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState(9);
  const [numq, setNumq] = useState(3);

  function shuffleQuestions(incorrect, correct) {
    const options = [...incorrect, correct];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  useEffect(() => {
    if (state.start) {
      const fetchQuestion = async () => {
        try {
          const response = await fetch(
            `https://opentdb.com/api.php?amount=${numq}&category=${category}&difficulty=${difficulty}&type=multiple`
          );
          const data = await response.json();
          const formatted = data.results.map(q => ({
            question : q.question,
            correct_answer : q.correct_answer,
            options : shuffleQuestions(q.incorrect_answers , q.correct_answer)
          }))
          dispatch({ type: "DATA LOADED", payload: formatted });
        } catch (error) {
          console.error("Error while fetching questions:", error);
        }
      };

      fetchQuestion();
    }
  }, [state.start, numq, category, difficulty, dispatch]);

  
  function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-lg text-white border border-white/30">
        {!state.start && (
          <div>
            <h1 className="text-3xl font-bold text-center mb-2">
              🎯 Quiz Master
            </h1>
            <p className="text-center text-white/80 mb-6">
              Challenge yourself. Learn something new every time.
            </p>

            <hr className="border-white/30 mb-6" />

            {/* Number of Questions */}
            <label className="block mb-4">
              <span className="text-sm font-semibold">Number of Questions</span>
              <select
                className="w-full mt-1 p-3 rounded-lg bg-white/30 border border-white/40 focus:ring-2 focus:ring-white text-black"
                onChange={(e) => setNumq(parseInt(e.target.value))}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </label>

            {/* Category */}
            <label className="block mb-4">
              <span className="text-sm font-semibold">Category</span>
              <select
                className="w-full mt-1 p-3 rounded-lg bg-white/30 border border-white/40 focus:ring-2 focus:ring-white text-black"
                onChange={(e) => setCategory(parseInt(e.target.value))}
              >
                <option value="9">General Knowledge</option>
                <option value="10">Books</option>
                <option value="21">Sports</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="28">Vehicles</option>
                <option value="25">Art</option>
                <option value="32">Cartoon & Animation</option>
              </select>
            </label>

            {/* Difficulty */}
            <label className="block mb-6">
              <span className="text-sm font-semibold">Difficulty</span>
              <select
                className="w-full mt-1 p-3 rounded-lg bg-white/30 border border-white/40 focus:ring-2 focus:ring-white text-black"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            {/* Start Button */}
            <button
              onClick={() => dispatch({ type: "START" })}
              className="w-full py 3 py-2.5 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-200 transition"
            >
              Start Quiz
            </button>
          </div>
        )}
        {state.start && state.loading && <Loader />}
        {state.start &&
        state.questions.length > 0 &&
        state.curIdx < state.questions.length ? (
          <QuestionPage
            question={decodeHTML(state.questions[state.curIdx].question)}
            options={state.questions[state.curIdx].options.map(op => decodeHTML(op))}
            idx={state.curIdx}
            orgAnswer={decodeHTML(state.questions[state.curIdx].correct_answer)}
            total={state.questions.length} 
          />
        ) : state.start &&
          state.questions.length > 0 &&
          state.curIdx >= state.questions.length ? (
          <ScorePage />
        ) : null}
      </div>
    </div>
  );
}

export default App;
