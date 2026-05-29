import { useState } from 'react'
import { questions } from '../data/questions.js'

const colorClass = {
  green: 'option-green',
  amber: 'option-amber',
  red: 'option-red',
}

const dotColor = {
  green: 'bg-rag-green',
  amber: 'bg-rag-amber',
  red: 'bg-rag-red',
}

export default function Question({ index, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const q = questions[index]
  const total = questions.length
  const progress = ((index) / total) * 100

  function handleSelect(optionIndex) {
    if (selected !== null) return
    setSelected(optionIndex)
    setTimeout(() => {
      onAnswer(q.options[optionIndex].score)
      setSelected(null)
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-inter text-sm font-medium text-charcoal/50">
            Question {index + 1} of {total}
          </p>
          <p className="font-inter text-sm font-medium text-warm-brown">
            {q.topic}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-black/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-warm-brown rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="card mb-6">
          <h2 className="font-playfair text-xl sm:text-2xl font-500 text-charcoal leading-snug">
            {q.question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {q.options.map((option, i) => {
            const isSelected = selected === i
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`option-btn ${isSelected ? colorClass[option.color] : 'option-unselected'}`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                      isSelected ? dotColor[option.color] : 'bg-black/15'
                    }`}
                  />
                  <span>{option.text}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
