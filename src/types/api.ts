export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

export interface PageResponse<T> {
  item: T[]
  page: number
  pageSize: number
  total: number
}
