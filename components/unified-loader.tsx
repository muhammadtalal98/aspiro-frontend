"use client"
import { Brain, Loader2, X, RefreshCw } from 'lucide-react'
import React from 'react'

interface UnifiedLoaderProps {
  title?: string
  message?: string
  subMessage?: string
  showAttempts?: boolean
  attempts?: number
  elapsedSeconds?: number
  error?: string | null
  onRetry?: () => void
  retrying?: boolean
  progressPercent?: number
  showProgressBar?: boolean
  overlay?: boolean
  compact?: boolean
}

export const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  title = 'Analyzing your profile with AI',
  message = 'Processing your responses...',
  subMessage,
  showAttempts,
  attempts = 0,
  elapsedSeconds,
  error,
  onRetry,
  retrying,
  progressPercent,
  showProgressBar,
  overlay = true,
  compact = false,
}) => {
  const Container = overlay ? 'div' : React.Fragment as any
  const containerProps = overlay ? { className: 'fixed inset-0 z-50 flex flex-col bg-[#0e2439] !m-0' } : {}

  return (
    <Container {...containerProps}>
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden ${compact ? 'min-h-[280px] sm:min-h-[320px]' : 'min-h-screen'}`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50" />
            <div className="hidden sm:block absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30" />
            <div className="hidden sm:block absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70" />
        </div>
        <div className="relative text-center space-y-6 sm:space-y-8 max-w-sm sm:max-w-xl mx-auto px-4">
          {!compact && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-cyan-100 tracking-wide mb-3 sm:mb-4 text-balance">{title}</h1>
              {subMessage && <p className="text-base sm:text-lg text-cyan-300/80 text-pretty mx-auto">{subMessage}</p>}
            </div>
          )}
          <div className="space-y-6 sm:space-y-8">
            <div className="relative">
              <div className={`${compact ? 'w-48 h-48 sm:w-56 sm:h-56' : 'w-64 h-64 sm:w-80 sm:h-80'} mx-auto relative`}>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-2 sm:px-4">
                    <Brain className={`${compact ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-12 w-12 sm:h-16 sm:w-16'} text-cyan-400 mx-auto mb-3 sm:mb-4 animate-pulse`} />
                    <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Analyzing your</div>
                    <div className="text-lg sm:text-xl font-semibold">profile with AI</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 animate-spin" />
                <span className="text-cyan-300 text-sm sm:text-base">{message}</span>
              </div>
            </div>
            {showProgressBar && (
              <div className="mx-auto w-full max-w-xs sm:max-w-sm text-left space-y-2">
                <div className="h-2 w-full bg-cyan-400/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(progressPercent || 0, 0), 100)}%` }}
                  />
                </div>
                {progressPercent != null && (
                  <p className="text-cyan-300/70 text-xs font-medium">{Math.round(progressPercent)}% complete</p>
                )}
              </div>
            )}
            <div className="text-center space-y-3">
              {(elapsedSeconds != null || showAttempts) && (
                <p className="text-cyan-300/60 text-xs sm:text-sm">
                  {elapsedSeconds != null && <>Elapsed {elapsedSeconds}s</>} {showAttempts && <>• Attempts {attempts}</>}
                </p>
              )}
              {error && (
                <div className="max-w-xs sm:max-w-md mx-auto p-3 sm:p-4 border border-red-400/30 bg-red-500/10 rounded-lg text-red-300 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-medium"><X className="h-4 w-4 flex-shrink-0" /><span>{error}</span></div>
                  {onRetry && (
                    <button onClick={onRetry} disabled={retrying} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-100 text-xs disabled:opacity-50">
                      <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} /> {retrying ? 'Retrying...' : 'Retry'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
