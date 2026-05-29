import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Question from './components/Question.jsx'
import Results from './components/Results.jsx'
import { questions } from './data/questions.js'

const SCREENS = {
  LANDING: 'landing',
  QUIZ: 'quiz',
  RESULTS: 'results',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  function handleStart() {
    setCurrentIndex(0)
    setAnswers([])
    setScreen(SCREENS.QUIZ)
  }

  function handleAnswer(score) {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (newAnswers.length >= questions.length) {
      setScreen(SCREENS.RESULTS)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  function handleRestart() {
    setScreen(SCREENS.LANDING)
    setCurrentIndex(0)
    setAnswers([])
  }

  return (
    <div className="bg-cream min-h-screen">
      {screen === SCREENS.LANDING && (
        <Landing onStart={handleStart} />
      )}

      {screen === SCREENS.QUIZ && (
        <Question
          key={currentIndex}
          index={currentIndex}
          onAnswer={handleAnswer}
        />
      )}

      {screen === SCREENS.RESULTS && (
        <>
          <Results answers={answers} />
          <div className="pb-12 text-center">
            <button
              onClick={handleRestart}
              className="font-inter text-xs text-charcoal/35 hover:text-charcoal/60 underline transition-colors"
            >
              Start again
            </button>
          </div>
        </>
      )}
    </div>
  )
}
