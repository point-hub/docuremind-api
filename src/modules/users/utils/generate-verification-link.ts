import apiConfig from '@/config/api'

export const generateVerificationLink = () => {
  return `${apiConfig.clientUrl}/verify-email`
}
