export function assertLocalSensitiveMode() {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.ALLOW_LOCAL_SENSITIVE_DATA !== 'true'
  ) {
    throw new Error(
      'Akses data sensitif hanya diizinkan pada mode local development.',
    )
  }
}
