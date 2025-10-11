"use client"

import { useState, useEffect } from "react"
import MapWrapper from "./MapWrapper"

export default function Quiz() {
  const [currentQuestion, setCurrentQuesiton] = useState<number>(1)
  const [resetQuiz, setResetQuiz] = useState<boolean>(false)
  const [showNextButton, setShowNextButton] = useState<boolean>(false)
  const [showResetButton, setShowResetButton] = useState<boolean>(false)

  useEffect(() => {
    if (currentQuestion !== 1) setShowNextButton(false)
  }, [currentQuestion])

  useEffect(() => {
    if (resetQuiz) {
      setCurrentQuesiton(1)
      setShowNextButton(false)
      setResetQuiz(false)
      setShowResetButton(false)
    }
  }, [resetQuiz])

  useEffect(() => {
    if (showNextButton && !showResetButton) setShowResetButton(true)
  }, [showNextButton])

  return (
    <div className="w-screen h-screen flex flex-col relative gap-3">
      <span className="ml-2">Question: {currentQuestion}</span>
      <div className="flex gap-2">
        {showNextButton && (
          <button
            type="button"
            onClick={() => setCurrentQuesiton((prev) => prev + 1)}
            className="bg-slate-600 hover:bg-slate-300 cursor-pointer text-white w-fit p-3 ml-2"
          >
            Next Question
          </button>
        )}
        {showResetButton && (
          <button
            type="button"
            onClick={() => setResetQuiz(true)}
            className="bg-slate-600 hover:bg-slate-300 cursor-pointer text-white w-fit p-3 ml-2"
          >
            Restart Quiz
          </button>
        )}
      </div>
      <div className="flex-1">
        {currentQuestion === 1 ? (
          <MapWrapper
            level={1}
            onSubmit={() => setShowNextButton(true)}
            reset={resetQuiz}
          />
        ) : currentQuestion === 2 ? (
          <MapWrapper
            level={2}
            onSubmit={() => setShowNextButton(true)}
            reset={resetQuiz}
          />
        ) : (
          <span className="ml-2">More questions soon!</span>
        )}
      </div>
    </div>
  )
}
