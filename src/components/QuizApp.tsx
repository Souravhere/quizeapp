"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { RadioGroup, RadioGroupItem } from "./ui/Radio-group"
import { Label } from "./ui/Label"
import { Progress } from "./ui/Progress"
import { motion, AnimatePresence } from "framer-motion"
import confetti from 'canvas-confetti'
import { Sparkles, Brain, Award } from 'lucide-react'
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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    if (currentLevelData && currentQuestionIndex < currentLevelData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
    } else {
      setQuizEnded(true)
    }
  }

  const renderSubjectSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {subjects.map((subject) => (
        <motion.div key={subject.subject} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{subject.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              {subject.levels.map((level) => (
                <Button
                  key={level.level}
                  onClick={() => startQuiz(subject.subject, level.level)}
                  className="w-full mb-2 bg-white text-purple-600 hover:bg-purple-100"
                  variant="outline"
                >
                  {level.level}
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )

  const renderQuestion = () => {
    const currentSubjectData = subjects.find(s => s.subject === currentSubject)
    const currentLevelData = currentSubjectData?.levels.find(l => l.level === currentLevel)
    const currentQuestion = currentLevelData?.questions[currentQuestionIndex]

    if (!currentQuestion) return null

    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="bg-white shadow-xl border-2 border-purple-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Brain className="mr-2" /> {currentSubject} - {currentLevel}
            </CardTitle>
            <Progress value={(currentQuestionIndex + 1) / (currentLevelData?.questions.length || 1) * 100} className="w-full bg-purple-200" />
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">{currentQuestion.question}</h3>
            <RadioGroup onValueChange={handleAnswerSelect} value={selectedAnswer} className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} className="text-purple-600" />
                  <Label htmlFor={`option-${index}`} className="text-lg text-gray-700 cursor-pointer hover:text-purple-600 transition-colors">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={submitAnswer} 
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex === (currentLevelData?.questions.length || 1) - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="text-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex justify-center items-center">
            <Award className="mr-2" /> Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-4">
            Your score: {score} / {subjects.find(s => s.subject === currentSubject)?.levels.find(l => l.level === currentLevel)?.questions.length}
          </p>
          <p className="text-xl mb-6">
            {score === subjects.find(s => s.subject === currentSubject)?.levels.find(l => l.level === currentLevel)?.questions.length
              ? "Perfect score! You're a genius!"
              : "Great job! Keep practicing to improve."}
          </p>
          <Button onClick={() => setQuizStarted(false)} className="w-full bg-white text-purple-600 hover:bg-purple-100 transition-colors">
            Back to Subjects
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        <Sparkles className="inline mr-2" /> Interactive Quiz App
      </h1>
      <AnimatePresence mode="wait">
        {subjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-xl text-gray-600"
          >
            Loading quiz data...
          </motion.p>
        )}
        {subjects.length > 0 && !quizStarted && renderSubjectSelection()}
        {quizStarted && !quizEnded && renderQuestion()}
        {quizEnded && renderResults()}
      </AnimatePresence>
    </div>
  )
}