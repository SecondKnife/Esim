/**
 * PM2 Ecosystem Configuration
 * This file configures PM2 process manager for production deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 stop ecosystem.config.js
 *   pm2 restart ecosystem.config.js
 *   pm2 delete ecosystem.config.js
 *   pm2 logs
 *   pm2 monit
 */

module.exports = {
  apps: [
    {
      name: "ecommerce-backend",
      script: "dist/server.js",
      instances: 1, // Set to "max" to use all CPU cores, or a number for specific count
      exec_mode: "fork", // Use "cluster" mode for multiple instances
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      // Logging configuration
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // Auto restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      // Advanced options
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
    },
  ],
};

