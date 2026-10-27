import { useQuery } from '@tanstack/react-query'
import type { Option, Track } from '@/features/exploration/types'

interface QuestionWithOptions {
  questionId: string
  maxSelections: number
  options: Option[]
}

const QUESTIONS_BY_TRACK: Record<Track, QuestionWithOptions> = {
  unsure: {
    questionId: 'q-unsure-001',
    maxSelections: 2,
    options: [
      {
        id: 'opt-001',
        questionId: 'q-unsure-001',
        icon: 'Search',
        title: '找出問題原因',
        order: 1,
      },
      {
        id: 'opt-002',
        questionId: 'q-unsure-001',
        icon: 'Puzzle',
        title: '解決複雜問題',
        order: 2,
      },
      {
        id: 'opt-003',
        questionId: 'q-unsure-001',
        icon: 'Palette',
        title: '創造/設計東西',
        order: 3,
      },
      {
        id: 'opt-004',
        questionId: 'q-unsure-001',
        icon: 'Handshake',
        title: '幫助/陪伴別人',
        order: 4,
      },
      {
        id: 'opt-005',
        questionId: 'q-unsure-001',
        icon: 'ChartColumn',
        title: '分析資料/找規律',
        order: 5,
      },
      {
        id: 'opt-006',
        questionId: 'q-unsure-001',
        icon: 'MessageCircle',
        title: '說服/與人溝通',
        order: 6,
      },
      {
        id: 'opt-007',
        questionId: 'q-unsure-001',
        icon: 'ClipboardList',
        title: '規劃與組織事情',
        order: 7,
      },
      {
        id: 'opt-008',
        questionId: 'q-unsure-001',
        icon: 'Microscope',
        title: '研究新知識',
        order: 8,
      },
    ],
  },
  dissatisfied: {
    questionId: 'q-dissatisfied-001',
    maxSelections: 2,
    options: [
      {
        id: 'opt-101',
        questionId: 'q-dissatisfied-001',
        icon: 'FaceSlightlyFrowning',
        title: '工作太無聊',
        order: 1,
      },
      {
        id: 'opt-102',
        questionId: 'q-dissatisfied-001',
        icon: 'Repeat',
        title: '重複性太高',
        order: 2,
      },
      {
        id: 'opt-103',
        questionId: 'q-dissatisfied-001',
        icon: 'TrendingUp',
        title: '沒有成長',
        order: 3,
      },
      {
        id: 'opt-104',
        questionId: 'q-dissatisfied-001',
        icon: 'DollarSign',
        title: '薪水不滿意',
        order: 4,
      },
      {
        id: 'opt-105',
        questionId: 'q-dissatisfied-001',
        icon: 'Building2',
        title: '公司文化不適合',
        order: 5,
      },
      {
        id: 'opt-106',
        questionId: 'q-dissatisfied-001',
        icon: 'Users',
        title: '不喜歡與人相處',
        order: 6,
      },
      {
        id: 'opt-107',
        questionId: 'q-dissatisfied-001',
        icon: 'Briefcase',
        title: '不喜歡管理方式',
        order: 7,
      },
      {
        id: 'opt-108',
        questionId: 'q-dissatisfied-001',
        icon: 'Clock',
        title: '工時/生活失衡',
        order: 8,
      },
      {
        id: 'opt-109',
        questionId: 'q-dissatisfied-001',
        icon: 'Target',
        title: '沒有成就感',
        order: 9,
      },
      {
        id: 'opt-110',
        questionId: 'q-dissatisfied-001',
        icon: 'CircleQuestionMark',
        title: '不知道自己到底在做什麼',
        order: 10,
      },
    ],
  },
  direction: {
    questionId: 'q-direction-001',
    maxSelections: 3,
    options: [
      {
        id: 'opt-201',
        questionId: 'q-direction-001',
        icon: 'Puzzle',
        title: '解決問題',
        order: 1,
      },
      {
        id: 'opt-202',
        questionId: 'q-direction-001',
        icon: 'Trophy',
        title: '做出成果',
        order: 2,
      },
      {
        id: 'opt-203',
        questionId: 'q-direction-001',
        icon: 'Handshake',
        title: '跟人合作',
        order: 3,
      },
      {
        id: 'opt-204',
        questionId: 'q-direction-001',
        icon: 'Target',
        title: '自己決定怎麼做',
        order: 4,
      },
      {
        id: 'opt-205',
        questionId: 'q-direction-001',
        icon: 'BookOpen',
        title: '學習新東西',
        order: 5,
      },
      {
        id: 'opt-206',
        questionId: 'q-direction-001',
        icon: 'House',
        title: '穩定的生活',
        order: 6,
      },
      {
        id: 'opt-207',
        questionId: 'q-direction-001',
        icon: 'DollarSign',
        title: '賺錢',
        order: 7,
      },
      {
        id: 'opt-208',
        questionId: 'q-direction-001',
        icon: 'Heart',
        title: '幫助別人',
        order: 8,
      },
    ],
  },
}

export function useQuestions(track: Track) {
  return useQuery({
    queryKey: ['exploration', 'questions', track],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return QUESTIONS_BY_TRACK[track]
    },
  })
}
