export const formatAndValidateNigerianPhoneNumber = (phone: string): { isValid: boolean; formattedNumber: string; error?: string } => {
  // Remove all whitespace, dashes, parentheses, and plus signs
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // DON'T remove leading zeros immediately - preserve the original for prefix checking
  let number = cleaned;
  let originalPrefix = '';
  
  // If number starts with 0, keep the prefix for validation
  if (number.startsWith('0')) {
    originalPrefix = number.substring(0, 3); // Get the first 3 digits (e.g., 081)
    number = '234' + number.substring(1); // Remove leading 0 and add 234
  } else if (number.startsWith('234')) {
    // Already has country code, extract prefix from after 234
    originalPrefix = number.substring(3, 6);
  } else if (number.length === 10) {
    // Assume it's a 10-digit number without leading zero
    number = '234' + number;
    originalPrefix = number.substring(3, 6);
  } else if (number.length === 11 && !number.startsWith('234')) {
    // 11 digits without country code
    number = '234' + number;
    originalPrefix = number.substring(3, 6);
  } else {
    // Invalid format
    return {
      isValid: false,
      formattedNumber: phone,
      error: 'Invalid phone number format. Please enter a valid Nigerian phone number.'
    };
  }

  // Validate that it's exactly 13 digits after formatting (234 + 10 digits)
  if (number.length !== 13) {
    return {
      isValid: false,
      formattedNumber: phone,
      error: `Phone number must be 11 digits (including leading 0) or 13 digits with country code. You entered ${phone}`
    };
  }

  // Check if it's a valid Nigerian network prefix
  const validPrefixes = [
    '080', '070', '081', '090', '091'
  ];
  
  // Check if prefix is valid
  const isValidPrefix = validPrefixes.includes(originalPrefix);
  
  if (!isValidPrefix) {
    return {
      isValid: false,
      formattedNumber: number,
      error: `Invalid Nigerian phone number prefix. Valid prefixes include 080, 070, 081, 090, 091. You entered ${phone}`
    };
  }

  // Additional validation: check that remaining digits are all numbers
  if (!/^\d+$/.test(number)) {
    return {
      isValid: false,
      formattedNumber: number,
      error: 'Phone number must contain only digits'
    };
  }

  // Success - return formatted number
  return {
    isValid: true,
    formattedNumber: number, // This will be in format 2348130822299
  };
};