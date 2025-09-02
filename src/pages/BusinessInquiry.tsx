import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { BusinessInquiryForm } from '@/components/BusinessInquiryForm';

export const BusinessInquiry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inquiryType = searchParams.get('type') || 'General Business Inquiry';

  return <BusinessInquiryForm inquiryType={inquiryType} />;
};

