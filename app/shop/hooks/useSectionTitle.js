import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/apiConfig';

export function useSectionTitle(sectionId, defaultTitle) {
  const [customTitle, setCustomTitle] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTitle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/section-titles/${sectionId}`);
        const data = await res.json();
        if (mounted && data.success && data.data && data.data.title !== undefined) {
          setCustomTitle(data.data.title);
        }
      } catch (error) {
      }
    };

    fetchTitle();
    return () => { mounted = false; };
  }, [sectionId]);

  return { title: customTitle !== null ? customTitle : defaultTitle };
}
