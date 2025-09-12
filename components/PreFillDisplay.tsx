"use client"
import React, { useState } from 'react';
import { CheckCircle, Brain, AlertCircle, Edit3, Sparkles } from 'lucide-react';
import { PreFillAnswer, getConfidenceDescription, getConfidenceColor } from '@/lib/prefill-api';

interface PreFillDisplayProps {
  questionId: string;
  questionText: string;
  questionType: string;
  preFillAnswer: PreFillAnswer;
  currentValue: any;
  onAcceptAnswer: (questionId: string, answer: any) => void;
  onAcceptSuggestion: (questionId: string, suggestion: string) => void;
  onEditAnswer: (questionId: string, answer: any) => void;
}

export default function PreFillDisplay({
  questionId,
  questionText,
  questionType,
  preFillAnswer,
  currentValue,
  onAcceptAnswer,
  onAcceptSuggestion,
  onEditAnswer
}: PreFillDisplayProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAcceptAutoFill = () => {
    if (preFillAnswer.answer) {
      onAcceptAnswer(questionId, preFillAnswer.answer);
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    onAcceptSuggestion(questionId, suggestion);
    setShowSuggestions(false);
  };

  const handleEditAnswer = () => {
    setIsEditing(true);
    onEditAnswer(questionId, currentValue);
  };

  const renderAutoFillAnswer = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-cyan-300">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <span>Auto-filled from document</span>
        <span className={`text-xs px-2 py-1 rounded-full bg-green-400/20 ${getConfidenceColor(preFillAnswer.confidence)}`}>
          {getConfidenceDescription(preFillAnswer.confidence)} confidence
        </span>
      </div>
      
      <div className="p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
        <p className="text-green-100 font-medium">{preFillAnswer.answer}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAcceptAutoFill}
          className="px-3 py-2 bg-green-500 hover:bg-green-400 text-white text-sm rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Accept Answer
        </button>
        <button
          onClick={handleEditAnswer}
          className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </button>
      </div>
    </div>
  );

  const renderAISuggestions = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-cyan-300">
        <Brain className="h-4 w-4 text-purple-400" />
        <span>AI-generated suggestions</span>
        <span className={`text-xs px-2 py-1 rounded-full bg-purple-400/20 ${getConfidenceColor(preFillAnswer.confidence)}`}>
          {getConfidenceDescription(preFillAnswer.confidence)} confidence
        </span>
      </div>

      {!showSuggestions ? (
        <button
          onClick={() => setShowSuggestions(true)}
          className="w-full p-3 bg-purple-400/10 border border-purple-400/30 rounded-lg hover:bg-purple-400/20 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-purple-100">Show AI Suggestions ({preFillAnswer.suggestions?.length || 0})</span>
        </button>
      ) : (
        <div className="space-y-2">
          {preFillAnswer.suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleAcceptSuggestion(suggestion)}
              className="w-full p-3 text-left bg-purple-400/10 border border-purple-400/30 rounded-lg hover:bg-purple-400/20 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-purple-100">{suggestion}</span>
                <CheckCircle className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </button>
          ))}
          
          <button
            onClick={() => setShowSuggestions(false)}
            className="w-full p-2 text-sm text-purple-300 hover:text-purple-100 transition-colors duration-200"
          >
            Hide suggestions
          </button>
        </div>
      )}
    </div>
  );

  const renderError = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-red-300">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <span>Pre-fill failed</span>
      </div>
      
      <div className="p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
        <p className="text-red-100 text-sm">{preFillAnswer.error}</p>
      </div>
    </div>
  );

  // Don't show if user has already provided an answer
  if (currentValue && (typeof currentValue === 'string' ? currentValue.trim() : currentValue)) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-lg">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-cyan-100 mb-1">Smart Pre-fill</h4>
        <p className="text-xs text-cyan-300/80">Answer suggested based on your uploaded documents</p>
      </div>

      {preFillAnswer.error ? (
        renderError()
      ) : preFillAnswer.type === 'auto-fill' ? (
        renderAutoFillAnswer()
      ) : (
        renderAISuggestions()
      )}
    </div>
  );
}
