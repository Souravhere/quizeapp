"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { RadioGroup, RadioGroupItem } from "./ui/Radio-group"
import { Label } from "./ui/Label"
import { Progress } from "./ui/Progress"
import quizData from '../quizData.json'

type Question = {
  question: string
  options: string[]
  correctAnswer: string
}

type Level = {
  level: string
  questions: Question[]
}

type Subject = {
  subject: string
  levels: Level[]
}

export default function QuizApp() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [currentSubject, setCurrentSubject] = useState<string>('')
  const [currentLevel, setCurrentLevel] = useState<string>('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)

  useEffect(() => {
    setSubjects(quizData)
  }, [])

  const startQuiz = (subject: string, level: string) => {
    setCurrentSubject(subject)
    setCurrentLevel(level)
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizStarted(true)
    setQuizEnded(false)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    const currentSubjectData = subjects.find(s => s.subject === currentSubject)
    const currentLevelData = currentSubjectData?.levels.find(l => l.level === currentLevel)
    const currentQuestion = currentLevelData?.questions[currentQuestionIndex]

    if (currentQuestion && selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    if (currentLevelData && currentQuestionIndex < currentLevelData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
    } else {
      setQuizEnded(true)
    }
  }

  const renderSubjectSelection = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <Card key={subject.subject} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{subject.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            {subject.levels.map((level) => (
              <Button
                key={level.level}
                onClick={() => startQuiz(subject.subject, level.level)}
                className="w-full mb-2"
              >
                {level.level}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderQuestion = () => {
    const currentSubjectData = subjects.find(s => s.subject === currentSubject)
    const currentLevelData = currentSubjectData?.levels.find(l => l.level === currentLevel)
    const currentQuestion = currentLevelData?.questions[currentQuestionIndex]

    if (!currentQuestion) return null

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{currentSubject} - {currentLevel}</CardTitle>
          <Progress value={(currentQuestionIndex + 1) / (currentLevelData?.questions.length || 1) * 100} className="w-full" />
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
          <RadioGroup onValueChange={handleAnswerSelect} value={selectedAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={submitAnswer} className="mt-4 w-full" disabled={!selectedAnswer}>
            {currentQuestionIndex === (currentLevelData?.questions.length || 1) - 1 ? 'Finish' : 'Next'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderResults = () => (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">
          Your score: {score} / {subjects.find(s => s.subject === currentSubject)?.levels.find(l => l.level === currentLevel)?.questions.length}
        </p>
        <Button onClick={() => setQuizStarted(false)} className="w-full">
          Back to Subjects
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Interactive Quiz App</h1>
      {!quizStarted && renderSubjectSelection()}
      {quizStarted && !quizEnded && renderQuestion()}
      {quizEnded && renderResults()}
    </div>
  )
}