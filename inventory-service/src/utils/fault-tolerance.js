const CircuitBreaker = require('opossum');

// Circuit Breaker - ngăn chặn gọi lặp đi lặp lại đến hệ thống đang bị lỗi
exports.createCircuitBreaker = (fn, options = {}) => {
  const defaultOptions = {
    timeout: 3000,                     // Thời gian tối đa chờ đợi trước khi coi là lỗi
    errorThresholdPercentage: 50,      // Ngưỡng phần trăm lỗi để mở circuit
    resetTimeout: 10000,               // Thời gian thử lại sau khi circuit mở
    ...options
  };
  
  const breaker = new CircuitBreaker(fn, defaultOptions);
  
  // Event listeners
  breaker.on('open', () => console.log('Circuit Breaker opened'));
  breaker.on('close', () => console.log('Circuit Breaker closed'));
  breaker.on('halfOpen', () => console.log('Circuit Breaker half-open'));
  
  return breaker;
};

// Retry - cơ chế thử lại tự động khi xảy ra lỗi
exports.withRetry = async (fn, options = {}) => {
  const { maxRetries = 3, delay = 1000 } = options;
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`Attempt ${attempt + 1} failed with error: ${err.message}`);
      lastError = err;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying... (${attempt + 1}/${maxRetries})`);
      }
    }
  }
  
  throw lastError;
};

// Rate Limiter - giới hạn số lượng request trong một khoảng thời gian
exports.createRateLimiter = (maxRequests = 10, perSeconds = 1) => {
  let tokens = maxRequests;
  let lastRefill = Date.now();
  
  return async (fn) => {
    const now = Date.now();
    const timePassed = now - lastRefill;
    const refillAmount = Math.floor(timePassed / 1000) * maxRequests;
    
    if (refillAmount > 0) {
      tokens = Math.min(maxRequests, tokens + refillAmount);
      lastRefill = now;
    }
    
    if (tokens <= 0) {
      throw new Error('Rate limit exceeded');
    }
    
    tokens--;
    return fn();
  };
};

// Time Limiter - đảm bảo một thao tác hoàn thành trong thời gian định trước
exports.withTimeLimit = (fn, timeoutMs = 2000) => {
  return Promise.race([
    fn(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
};