/**
 * Frontend Logging Middleware
 * Captures logs, warns, and errors across the application.
 */

class Logger {
  constructor() {
    this.logs = [];
    
    // Bind original console methods
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console)
    };
  }

  /**
   * Format log entry
   */
  _formatLog(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      url: window.location.href,
    };
  }

  /**
   * Internal push to logs array (and optionally external service)
   */
  _push(level, message, meta) {
    const entry = this._formatLog(level, message, meta);
    this.logs.push(entry);
    
    // In a real production app, this would batch and send to a logging service (e.g. Datadog, Sentry)
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });

    // Output to console using original method to avoid infinite loops if console is intercepted
    this.originalConsole[level](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, meta);
  }

  log(message, meta) {
    this._push('log', message, meta);
  }

  info(message, meta) {
    this._push('info', message, meta);
  }

  warn(message, meta) {
    this._push('warn', message, meta);
  }

  error(message, error, meta = {}) {
    const errorMeta = {
      ...meta,
      errorMessage: error?.message || error,
      stack: error?.stack
    };
    this._push('error', message, errorMeta);
  }

  /**
   * Middleware for Axios to intercept requests and responses
   */
  attachAxiosInterceptor(axiosInstance) {
    axiosInstance.interceptors.request.use(
      (config) => {
        this.info(`API Request Started: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.error('API Request Failed before sending', error);
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        this.info(`API Request Success: ${response.config.method.toUpperCase()} ${response.config.url}`, { status: response.status });
        return response;
      },
      (error) => {
        this.error(`API Request Error`, error, {
          url: error.config?.url,
          status: error.response?.status
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Intercept global unhandled errors
   */
  initGlobalErrorTracking() {
    window.addEventListener('error', (event) => {
      this.error('Global Uncaught Error', event.error || event.message);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', event.reason);
    });
  }
}

const logger = new Logger();
export default logger;
