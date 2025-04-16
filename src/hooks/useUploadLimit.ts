
import { useEffect, useState } from "react";

export function useUploadLimit(userId: string) {
  const [isLimitReached, setIsLimitReached] = useState(false);
  
  useEffect(() => {
    if (userId) {
      const uploadCountKey = `mediscribe_upload_count_${userId}`;
      const currentCount = parseInt(localStorage.getItem(uploadCountKey) || "0", 10);
      setIsLimitReached(currentCount >= 5);
    }
  }, [userId]);

  const checkSubscriptionRequired = (): boolean => {
    if (!userId) return false;
    
    const uploadCountKey = `mediscribe_upload_count_${userId}`;
    const currentCount = parseInt(localStorage.getItem(uploadCountKey) || "0", 10);
    
    return currentCount >= 5;
  };

  const incrementUploadCount = () => {
    if (!userId) return;
    
    const uploadCountKey = `mediscribe_upload_count_${userId}`;
    const currentCount = parseInt(localStorage.getItem(uploadCountKey) || "0", 10);
    localStorage.setItem(uploadCountKey, (currentCount + 1).toString());
    
    // Update state after incrementing
    setIsLimitReached((currentCount + 1) >= 5);
  };

  return {
    isLimitReached,
    checkSubscriptionRequired,
    incrementUploadCount
  };
}
