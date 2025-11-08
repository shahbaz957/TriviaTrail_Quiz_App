import React, { createContext, useEffect, useReducer } from "react";

export const QuizContext = createContext();

const initialState = {
  questions: [],
  curIdx: 0,
  start: false,
  score: 0,
  loading: false,
  timeLeft : 15
};
// This represent the current or persistent state of the App

const reducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...state, start: true, loading: true };
    case "DATA LOADED":
      return { ...state, questions: action.payload, loading: false };
    case "PROCEED":
      return {
        ...state,
        curIdx: state.curIdx + 1,
        score: action.correct ? state.score + 1 : state.score,
        timeLeft : 15
      };

    case "RESTART":
      return initialState;
    case "TICK":
      return {...state , timeLeft : Math.max(state.timeLeft - 1, 0)};

    case "TIME_UP" : 
      return {...state , curIdx : state.curIdx + 1 , timeLeft : 15};
    default:
      return state;
  }
};
// component composition 
export function QuizProvider({children}) {
    const [state , dispatch] = useReducer(reducer , initialState , (state) => {
        const persisted = localStorage.getItem("quizState");
        return persisted ? JSON.parse(persisted) : state
    });

    useEffect(() => {
        localStorage.setItem( "quizState", JSON.stringify(state))
    } , [state])
    return (
        <QuizContext.Provider value={{state , dispatch}}>
            {children}
        </QuizContext.Provider>
    )
}

