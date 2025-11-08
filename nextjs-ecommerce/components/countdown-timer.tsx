"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  deadline: Date | string;
  onExpire?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onExpire, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const total = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));

    if (total <= 0) {
      setIsExpired(true);
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));

      if (diff <= 0) {
        setIsExpired(true);
        if (onExpire) {
          onExpire();
        }
        return null;
      }

      return {
        minutes: Math.floor(diff / 60),
        seconds: diff % 60,
        total: diff,
      };
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (isExpired || !timeLeft) {
    return (
      <div className={`text-red-500 dark:text-red-400 font-semibold ${className}`}>
        ⏰ Đã hết thời gian thanh toán
      </div>
    );
  }

  const minutes = timeLeft.minutes.toString().padStart(2, "0");
  const seconds = timeLeft.seconds.toString().padStart(2, "0");

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-orange-500 dark:text-orange-400 font-bold text-2xl">⏰</span>
        <span className="text-base font-semibold text-foreground">Còn lại:</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={`font-mono font-bold text-4xl px-4 py-2 rounded-lg ${
          timeLeft.total <= 300 
            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20" 
            : "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
        }`}>
          {minutes}:{seconds}
        </div>
      </div>
      <span className={`text-sm font-medium ${
        timeLeft.total <= 300 
          ? "text-red-600 dark:text-red-400" 
          : "text-muted-foreground"
      }`}>
        {timeLeft.total <= 300 ? "⚠️ Sắp hết hạn!" : "để xác nhận thanh toán"}
      </span>
    </div>
  );
};

export default CountdownTimer;

