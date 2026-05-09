import React from 'react';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  required: boolean;
  pattern?: RegExp;
  enum?: string[];
}

interface ValidationSummaryProps {
  type: 'property' | 'service';
  rules: Record<string, ValidationRule>;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ type, rules }) => {
  const getFieldDisplayName = (field: string): string => {
    const displayNames: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      type: 'Property Type',
      propertyType: 'Property Category',
      style: 'Style',
      address: 'Street Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      postalCode: 'Postal Code',
      maxGuests: 'Maximum Guests',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      beds: 'Beds',
      minNights: 'Minimum Nights',
      basePrice: 'Base Price',
      extraGuestPrice: 'Extra Guest Price',
      cleaningFee: 'Cleaning Fee',
      securityDeposit: 'Security Deposit',
      serviceType: 'Service Type',
      duration: 'Duration',
      groupSize: 'Group Size',
      perPersonPrice: 'Per Person Price'
    };
    return displayNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldDescription = (field: string, rule: ValidationRule): string => {
    const descriptions: Record<string, string> = {
      title: type === 'property' 
        ? 'A descriptive name for your property (e.g., "Cozy Mountain Cabin with Lake View")'
        : 'A descriptive name for your service (e.g., "Guided City Tour with Local Expert")',
      description: type === 'property'
        ? 'Detailed description of your property, amenities, and what makes it special'
        : 'Detailed description of your service, what guests can expect, and unique features',
      type: 'The type of property you are listing',
      propertyType: 'The category/class of your property',
      style: 'The architectural or design style of your property',
      address: 'Complete street address of your property',
      city: 'City where your property is located',
      state: 'State or province where your property is located',
      country: 'Country where your property is located',
      postalCode: 'Postal or ZIP code for your property location',
      maxGuests: 'Maximum number of guests your property can accommodate',
      bedrooms: 'Number of bedrooms available for guests',
      bathrooms: 'Number of bathrooms available for guests',
      beds: 'Total number of beds available for guests',
      minNights: 'Minimum number of nights guests must stay',
      basePrice: 'Base price per night for your property',
      extraGuestPrice: 'Additional cost per extra guest beyond the base occupancy',
      cleaningFee: 'One-time cleaning fee for the entire stay',
      securityDeposit: 'Refundable security deposit amount',
      serviceType: 'The category of service you are offering',
      duration: 'How long your service typically takes',
      groupSize: 'Number of people that can participate in your service',
      perPersonPrice: 'Additional cost per person for your service'
    };
    return descriptions[field] || 'Field description not available';
  };

  const getValidationText = (field: string, rule: ValidationRule): string => {
    const parts: string[] = [];
    
    if (rule.required) {
      parts.push('Required');
    } else {
      parts.push('Optional');
    }

    if (rule.minLength && rule.maxLength) {
      parts.push(`${rule.minLength}-${rule.maxLength} characters`);
    } else if (rule.minLength) {
      parts.push(`Min ${rule.minLength} characters`);
    } else if (rule.maxLength) {
      parts.push(`Max ${rule.maxLength} characters`);
    }

    if (rule.min !== undefined && rule.max !== undefined) {
      parts.push(`Range: ${rule.min}-${rule.max}`);
    } else if (rule.min !== undefined) {
      parts.push(`Min: ${rule.min}`);
    } else if (rule.max !== undefined) {
      parts.push(`Max: ${rule.max}`);
    }

    if (rule.enum) {
      parts.push(`Options: ${rule.enum.join(', ')}`);
    }

    return parts.join(' • ');
  };

  const requiredFields = Object.entries(rules).filter(([_, rule]) => rule.required);
  const optionalFields = Object.entries(rules).filter(([_, rule]) => !rule.required);

  return (
    <div className="bg-gradient-to-r from-[#FDF8F3] to-[#FDF8F3] border border-[#F5E6D3] rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Info className="w-6 h-6 text-[#C45D3E]" />
        <h3 className="text-lg font-semibold text-[#1A1A1A]">
          {type === 'property' ? 'Property' : 'Service'} Requirements Summary
        </h3>
      </div>
      
      <p className="text-[#C45D3E] mb-4">
        Before you start, here's what you'll need to provide. Required fields are marked with a red asterisk (*).
      </p>

      {requiredFields.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-[#1A1A1A] mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Required Fields ({requiredFields.length})
          </h4>
          <div className="space-y-3">
            {requiredFields.map(([field, rule]) => (
              <div key={field} className="bg-white rounded-lg p-3 border border-[#F5E6D3]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">
                      {getFieldDisplayName(field)} <span className="text-red-500">*</span>
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {getFieldDescription(field, rule)}
                    </p>
                    <div className="text-xs text-[#C45D3E] bg-[#FDF8F3] px-2 py-1 rounded">
                      {getValidationText(field, rule)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {optionalFields.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#1A1A1A] mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Optional Fields ({optionalFields.length})
          </h4>
          <div className="space-y-3">
            {optionalFields.map(([field, rule]) => (
              <div key={field} className="bg-white rounded-lg p-3 border border-[#F5E6D3]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">
                      {getFieldDisplayName(field)}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {getFieldDescription(field, rule)}
                    </p>
                    <div className="text-xs text-[#C45D3E] bg-[#FDF8F3] px-2 py-1 rounded">
                      {getValidationText(field, rule)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-[#F5E6D3] rounded-lg">
        <h4 className="font-semibold text-[#1A1A1A] mb-2">💡 Tips for Success</h4>
        <ul className="text-sm text-[#1A1A1A] space-y-1">
          <li>• Fill out all required fields to proceed to the next step</li>
          <li>• Use descriptive titles and detailed descriptions to attract guests</li>
          <li>• Upload high-quality images to showcase your {type === 'property' ? 'property' : 'service'}</li>
          <li>• Set competitive pricing based on your market and amenities</li>
          <li>• Be accurate with location and capacity information</li>
        </ul>
      </div>
    </div>
  );
};

export default ValidationSummary;
