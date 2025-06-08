'use client'

import { useTravelPlannerStore } from '@/lib/stores/travel-planner-store'
import { DateSelectionStep } from './steps/DateSelectionStep'
import { DestinationStep } from './steps/DestinationStep'
import { AccommodationStep } from './steps/AccommodationStep'
import { TransportStep } from './steps/TransportStep'
import { TravelersStep } from './steps/TravelersStep'
import { InterestsStep } from './steps/InterestsStep'
import { MustVisitStep } from './steps/MustVisitStep'
import { ResultStep } from './steps/ResultStep'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

export function TravelPlannerWizard() {
  const { currentStep, setCurrentStep } = useTravelPlannerStore()
  const [loading, setLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // hydration 완료 후에만 실제 상태 표시
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  // hydration이 완료되지 않았으면 첫 번째 단계로 표시
  const displayStep = isHydrated ? currentStep : 1
  
  // 단계 변경 디버깅
  useEffect(() => {
    if (isHydrated) {
      console.log(`🎯 Current step: ${displayStep}`)
      console.log(`🗺️ KakaoMap will render in step 8-9 (ResultStep)`)
    }
  }, [displayStep, isHydrated])

  // 컴포넌트 전환 시 로딩 효과
  useEffect(() => {
    if (isHydrated) {
      setLoading(true)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [displayStep, isHydrated])

  const handleReset = () => {
    if (window.confirm('모든 입력 정보가 초기화됩니다. 계속하시겠습니까?')) {
      setCurrentStep(1)
    }
  }

  // 🔧 임시 디버깅: 8단계로 바로 이동
  const handleJumpToResults = () => {
    console.log('🚀 점프: 8단계(ResultStep)로 이동')
    setCurrentStep(8)
  }

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderStepComponent = () => {
    if (!isHydrated || loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )
    }

    switch (displayStep) {
      case 1:
        return <DateSelectionStep />
      case 2:
        return <DestinationStep />
      case 3:
        return <AccommodationStep />
      case 4:
        return <TransportStep />
      case 5:
        return <TravelersStep />
      case 6:
        return <InterestsStep />
      case 7:
        return <MustVisitStep />
      case 8:
      case 9:
        return <ResultStep />
      default:
        return <DateSelectionStep />
    }
  }
  
  return (
    <div>
      {/* 🔧 임시 디버깅 패널 */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔧 디버깅 패널</h3>
        <p className="text-sm text-yellow-700 mb-2">현재 단계: {displayStep} / 8</p>
        <p className="text-sm text-yellow-600 mb-3">지도는 8단계(ResultStep)에서 표시됩니다.</p>
        <Button 
          onClick={handleJumpToResults}
          size="sm"
          variant="outline"
          className="mr-2"
        >
          🗺️ 8단계로 점프 (지도 테스트)
        </Button>
        <Button 
          onClick={handleReset}
          size="sm"
          variant="outline"
        >
          🔄 1단계로 리셋
        </Button>
      </div>

      {renderStepComponent()}
      
      {isHydrated && displayStep > 1 && displayStep < 8 && (
        <div className="mt-8 text-center">
          <Button 
            variant="link" 
            onClick={handleReset}
            className="text-gray-500 text-sm"
          >
            처음부터 다시 시작하기
          </Button>
        </div>
      )}
    </div>
  )
} 