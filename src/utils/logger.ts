// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Meta = any;

const logToConsole = (
  level: 'info' | 'warn' | 'error',
  message: string,
  meta?: Meta,
): void => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  if (meta) {
    console[level](meta);
  }
};

export const logger = {
  log: (
    level: 'info' | 'warn' | 'error',
    message: string,
    meta?: Meta,
  ): void => {
    logToConsole(level, message, meta);
  },

  info: (message: string, meta?: Meta): void => {
    logger.log('info', message, meta);
  },

  warn: (message: string, meta?: Meta): void => {
    logger.log('warn', message, meta);
  },

  error: (message: string, meta?: Meta): void => {
    logger.log('error', message, meta);
  },
};
