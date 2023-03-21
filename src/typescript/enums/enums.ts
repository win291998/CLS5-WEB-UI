export const typeCardImage = ['full', 'head', undefined] as const
export const typeStatusToast = ['DEFAULT', 'INFO', 'SUCCESS', 'ERROR', 'WARNING'] as const
export enum typeCardImageEnum {
  full, head, undefined,
}
export enum TYPE_REQUEST {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  UPDATE = 'UPDATE',
}
