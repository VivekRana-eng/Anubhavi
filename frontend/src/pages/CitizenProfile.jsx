const MOCK_CITIZENS = {
  'CIT-8841': {
    id: 'CIT-8841',
    name: 'Rajesh Sharma',
    age: 72,
    gender: 'Male',
    mobile: '+91 98721-00214',
    aadhaar_masked: 'XXXX-XXXX-4912',
    address: 'H.No 412, Lane 4, Model Town Phase 2, Ludhiana',
    landmark: 'Near Model Town Park',
    latitude: 30.9010,
    longitude: 75.8573,
    risk_level: 'HIGH',
    status: 'ACTIVE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Severe Cardiac History, Pacemaker Fitted (2023)',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-9102': {
    id: 'CIT-9102',
    name: 'Sunita Devi',
    age: 68,
    gender: 'Female',
    mobile: '+91 97812-33412',
    aadhaar_masked: 'XXXX-XXXX-8102',
    address: 'Flat 302, Block B, Sector 17, Chandigarh',
    landmark: 'Near Sector 17 Shopping Complex',
    latitude: 30.7333,
    longitude: 76.7794,
    risk_level: 'HIGH',
    status: 'ACTIVE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Hypertension, Joint Pain History',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-7714': {
    id: 'CIT-7714',
    name: 'Mohan Lal',
    age: 75,
    gender: 'Male',
    mobile: '+91 99145-88210',
    aadhaar_masked: 'XXXX-XXXX-3341',
    address: 'House 125, Phase 8, Mohali',
    landmark: 'Near Phase 8 Gurudwara',
    latitude: 30.7046,
    longitude: 76.7179,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES WITH SPOUSE',
    medical_conditions: 'Diabetic, Limited Mobility',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-6629': {
    id: 'CIT-6629',
    name: 'Kamla Sharma',
    age: 70,
    gender: 'Female',
    mobile: '+91 96461-44912',
    aadhaar_masked: 'XXXX-XXXX-9912',
    address: '88 Commercial Complex, Central Bazaar',
    landmark: 'Opposite Central Bank',
    latitude: 30.7300,
    longitude: 76.7800,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Asthma, High Blood Pressure',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-5510': {
    id: 'CIT-5510',
    name: 'Harish Kumar',
    age: 74,
    gender: 'Male',
    mobile: '+91 98881-22901',
    aadhaar_masked: 'XXXX-XXXX-5520',
    address: 'GT Road Crossing, North Zone Sector 4',
    landmark: 'Near GT Road Flyover',
    latitude: 30.9100,
    longitude: 75.8500,
    risk_level: 'HIGH',
    status: 'ACTIVE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Cardiac Arrhythmia History',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-4481': {
    id: 'CIT-4481',
    name: 'Prem Prakash',
    age: 78,
    gender: 'Male',
    mobile: '+91 98140-55123',
    aadhaar_masked: 'XXXX-XXXX-4412',
    address: '45 Park Avenue, South Zone',
    landmark: 'Opposite South Zone Park',
    latitude: 30.8900,
    longitude: 75.8300,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Arthritis, Mild Hearing Impairment',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-4567': {
    id: 'CIT-4567',
    name: 'Swaran Singh',
    age: 85,
    gender: 'Male',
    mobile: '+91 99140-55443',
    aadhaar_masked: 'XXXX-XXXX-4567',
    address: 'Phase 8 Industrial Area Gate 1',
    landmark: 'Near Gate 1 Industrial Complex',
    latitude: 30.7060,
    longitude: 76.7190,
    risk_level: 'HIGH',
    status: 'ACTIVE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Cardiac History, Respiratory Care Needed',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-3312': {
    id: 'CIT-3312',
    name: 'Gurdev Singh',
    age: 81,
    gender: 'Male',
    mobile: '+91 94172-66301',
    aadhaar_masked: 'XXXX-XXXX-3312',
    address: 'Sector 3 Main Gate, Model Town',
    landmark: 'Main Gate Model Town',
    latitude: 30.9020,
    longitude: 75.8560,
    risk_level: 'HIGH',
    status: 'SAFE',
    living_status: 'LIVES WITH FAMILY',
    medical_conditions: 'Memory Loss, Dementia',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-2291': {
    id: 'CIT-2291',
    name: 'Vidya Wanti',
    age: 76,
    gender: 'Female',
    mobile: '+91 98150-11234',
    aadhaar_masked: 'XXXX-XXXX-2291',
    address: 'Villa 12, Sector 17',
    landmark: 'Sector 17 Villa Colony',
    latitude: 30.7350,
    longitude: 76.7780,
    risk_level: 'LOW',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Bronchitis',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-1182': {
    id: 'CIT-1182',
    name: 'Baldev Raj',
    age: 73,
    gender: 'Male',
    mobile: '+91 98760-44321',
    aadhaar_masked: 'XXXX-XXXX-1182',
    address: '104 Rosewood Enclave, Phase 8',
    landmark: 'Rosewood Enclave',
    latitude: 30.7050,
    longitude: 76.7180,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES WITH SPOUSE',
    medical_conditions: 'Hypertension, Cardiac Issue',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-9011': {
    id: 'CIT-9011',
    name: 'Asha Rani',
    age: 69,
    gender: 'Female',
    mobile: '+91 98111-77890',
    aadhaar_masked: 'XXXX-XXXX-9011',
    address: 'Central Mall Parking Level 2',
    landmark: 'Central Mall',
    latitude: 30.7310,
    longitude: 76.7810,
    risk_level: 'MEDIUM',
    status: 'ACTIVE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'None',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-8123': {
    id: 'CIT-8123',
    name: 'Ramesh Chander',
    age: 77,
    gender: 'Male',
    mobile: '+91 98888-33210',
    aadhaar_masked: 'XXXX-XXXX-8123',
    address: 'North Zone Community Hall',
    landmark: 'North Zone Community Hall',
    latitude: 30.9110,
    longitude: 75.8510,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES WITH SPOUSE',
    medical_conditions: 'Mobility Limitation',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-7234': {
    id: 'CIT-7234',
    name: 'Savitri Devi',
    age: 82,
    gender: 'Female',
    mobile: '+91 94170-99887',
    aadhaar_masked: 'XXXX-XXXX-7234',
    address: '219 Officers Colony, South Zone',
    landmark: 'Officers Colony',
    latitude: 30.8910,
    longitude: 75.8310,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Hearing Impaired',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-6345': {
    id: 'CIT-6345',
    name: 'Tilak Raj',
    age: 79,
    gender: 'Male',
    mobile: '+91 98720-11223',
    aadhaar_masked: 'XXXX-XXXX-6345',
    address: 'House 50, Model Town Extension',
    landmark: 'Model Town Extension',
    latitude: 30.9030,
    longitude: 75.8580,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Asthma',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-5456': {
    id: 'CIT-5456',
    name: 'Santosh Kumari',
    age: 71,
    gender: 'Female',
    mobile: '+91 98141-88765',
    aadhaar_masked: 'XXXX-XXXX-5456',
    address: 'Sector 17 Bus Stand Junction',
    landmark: 'Bus Stand Junction',
    latitude: 30.7340,
    longitude: 76.7770,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Diabetic',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-3678': {
    id: 'CIT-3678',
    name: 'Krishna Gopal',
    age: 73,
    gender: 'Male',
    mobile: '+91 98765-12345',
    aadhaar_masked: 'XXXX-XXXX-3678',
    address: 'Railway Station Exit 3, Central',
    landmark: 'Railway Station Exit 3',
    latitude: 30.7320,
    longitude: 76.7820,
    risk_level: 'HIGH',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Dementia',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-2789': {
    id: 'CIT-2789',
    name: 'Pushpa Rani',
    age: 67,
    gender: 'Female',
    mobile: '+91 98112-66554',
    aadhaar_masked: 'XXXX-XXXX-2789',
    address: 'North Zone Bypass Road',
    landmark: 'North Zone Bypass',
    latitude: 30.9120,
    longitude: 75.8520,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Hypertension',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-1890': {
    id: 'CIT-1890',
    name: 'Joginder Pal',
    age: 80,
    gender: 'Male',
    mobile: '+91 94171-33221',
    aadhaar_masked: 'XXXX-XXXX-1890',
    address: '12 South Zone Green Park',
    landmark: 'Green Park',
    latitude: 30.8920,
    longitude: 75.8320,
    risk_level: 'LOW',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Joint Pain',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-0901': {
    id: 'CIT-0901',
    name: 'Darshan Lal',
    age: 76,
    gender: 'Male',
    mobile: '+91 98722-88990',
    aadhaar_masked: 'XXXX-XXXX-0901',
    address: 'Model Town Phase 3 Market',
    landmark: 'Phase 3 Market',
    latitude: 30.9040,
    longitude: 75.8590,
    risk_level: 'MEDIUM',
    status: 'ACTIVE',
    living_status: 'LIVES WITH SPOUSE',
    medical_conditions: 'Diabetes',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  },
  'CIT-9812': {
    id: 'CIT-9812',
    name: 'Nirmala Devi',
    age: 74,
    gender: 'Female',
    mobile: '+91 98142-11009',
    aadhaar_masked: 'XXXX-XXXX-9812',
    address: 'Sector 17 House #512',
    landmark: 'Sector 17',
    latitude: 30.7360,
    longitude: 76.7760,
    risk_level: 'MEDIUM',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Hypertension',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  }
};

export default function CitizenProfile() {
  const { citizenId } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/citizens/${citizenId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [citizenId]);

  if (loading) {
    return (
      <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant flex flex-col items-center gap-spacing-md">
        <span className="material-symbols-outlined text-[36px] animate-spin text-primary">sync</span>
        Loading View-Only Dossier ({citizenId})...
      </div>
    );
  }

  const defaultCitizen = (MOCK_CITIZENS[citizenId]) ? MOCK_CITIZENS[citizenId] : {
    id: citizenId || 'CIT-8841',
    name: 'Rajesh Sharma',
    age: 72,
    gender: 'Male',
    mobile: '+91 98102-33412',
    aadhaar_masked: 'XXXX-XXXX-4912',
    address: 'House #402, Sector 3, Model Town, Ludhiana',
    landmark: 'Near Model Town Community Park',
    latitude: 30.9010,
    longitude: 75.8573,
    risk_level: 'HIGH',
    status: 'SAFE',
    living_status: 'LIVES_ALONE',
    medical_conditions: 'Severe Cardiac History, Pacemaker Installed (2023), Hypertension',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD'
  };

  const c = (data && data.citizen) ? data.citizen : defaultCitizen;
  const emergency_contacts = (data && data.emergency_contacts && data.emergency_contacts.length > 0) ? data.emergency_contacts : [
    { id: 'EC-01', name: 'Amit Sharma', relationship: 'Son (Primary Kin)', mobile: '+91 98721-00123', location: 'Model Town Phase 2', notify_status: 'VERIFIED KEYHOLDER', is_keyholder: 1 },
    { id: 'EC-02', name: 'Col. S. Dhillon', relationship: 'Neighbor & Keyholder', mobile: '+91 94172-88301', location: 'Immediate Next Door', notify_status: 'ON FILE', is_keyholder: 1 }
  ];
  const sos_history = (data && data.sos_history && data.sos_history.length > 0) ? data.sos_history : [
    { id: 'ANB-SOS-2026-00124', emergency_type: 'Medical Emergency (Cardiac Fall)', created_at: 'Today, 02:34 PM', status: 'RESOLVED', location_address: c.address },
    { id: 'ANB-SOS-2026-00088', emergency_type: 'Accidental Panic Ping', created_at: '15 Aug 2026', status: 'RESOLVED', location_address: c.address }
  ];
  const assistance_requests = (data && data.assistance_requests && data.assistance_requests.length > 0) ? data.assistance_requests : [
    { id: 'AST-2026-042', request_type: 'Beat Constable Gate Lock Check', created_at: 'Yesterday, 04:00 PM', status: 'COMPLETED', description: 'Elder requested police officer to check main entrance deadbolt.' }
  ];
  const welfare_checks = (data && data.welfare_checks && data.welfare_checks.length > 0) ? data.welfare_checks : [
    { id: 'WEL-101', check_type: 'Periodic Beat Check-in', scheduled_date: 'Today', scheduled_time: '11:00 AM', status: 'SCHEDULED', assigned_officer_name: 'HC Raj Kumar', purpose: 'Routine elder safety & medical check' }
  ];
  const audit_trail = (data && data.audit_trail && data.audit_trail.length > 0) ? data.audit_trail : [
    { id: 'AUD-101', action: 'VIEW ONLY DOSSIER ACCESSED', description: `View Only dossier loaded for ${c.name} (${c.id})`, timestamp: 'Today, 07:40 PM' }
  ];

  const tabs = [
    'Overview', 'Emergency Contacts', 'SOS History', 'Assistance Requests',
    'Welfare Checks', 'Assigned Officers', 'Audit Trail'
  ];

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* TOP NAVIGATION BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/sho/citizens')}
          className="px-spacing-md py-spacing-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg font-bold shadow-sm border border-surface-container-highest flex items-center gap-spacing-xs transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
          ← BACK TO SENIOR REGISTRY
        </button>

        <div className="flex items-center gap-spacing-xs">
          <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold uppercase">
            VIEW ONLY MODE
          </span>
          <span className="font-code-md text-on-surface-variant font-bold">
            CCTNS 360 DOSSIER • {c.id}
          </span>
        </div>
      </div>

      {/* CITIZEN HEADER CARD */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <img src={c.avatar_url} alt={c.name} className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container border-2 border-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-spacing-xs">
              <h1 className="font-headline-lg text-on-surface font-extrabold">{c.name}</h1>
              <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm font-bold">
                {c.id}
              </span>
              <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                c.status === 'SOS_ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                c.status === 'MISSED_CHECKIN' ? 'bg-error-container text-on-error-container' :
                'bg-secondary-container text-on-secondary-container'
              }`}>
                {c.status}
              </span>
            </div>
            <span className="font-body-sm text-on-surface-variant mt-0.5">
              {c.age} Yrs • {c.gender} • Living Status: <strong className="text-on-surface">{c.living_status}</strong> • Aadhaar: {c.aadhaar_masked}
            </span>
            <span className="font-code-md text-primary font-bold mt-1">Mobile: {c.mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <span className="px-spacing-md py-spacing-xs bg-surface-container-high text-on-surface font-label-md rounded-lg font-bold border border-surface-container-highest">
            📄 VIEW ONLY READ-ONLY DOSSIER
          </span>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex overflow-x-auto border-b border-surface-container-highest bg-surface-container-low px-spacing-md rounded-t-xl gap-spacing-xs">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`py-spacing-sm px-spacing-md font-label-md font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === t
                ? 'border-primary text-primary bg-surface-container-lowest shadow-sm'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS WITH GUARANTEED MOCK DATA */}
      <div className="bg-surface-container-lowest p-spacing-lg rounded-b-xl shadow-sm border border-surface-container-highest min-h-[320px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Registered Residence</span>
              <span className="font-body-sm text-on-surface font-semibold">{c.address}</span>
              <span className="font-label-sm text-secondary">Landmark: {c.landmark || 'Near Community Park'}</span>
              <span className="font-code-md text-primary font-bold mt-1">Geo Position: {c.latitude || 30.9010}° N, {c.longitude || 75.8573}° E</span>
              <span className="text-[12px] text-on-surface-variant mt-1">Jurisdiction: Model Town PS • Sector 3</span>
            </div>

            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-error uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Dossier (Critical)
              </span>
              <p className="font-body-sm text-on-surface font-semibold">{c.medical_conditions}</p>
              <div className="flex flex-wrap gap-spacing-xs mt-spacing-xs">
                <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold">
                  Last Active Check-in: Today, 09:30 AM
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY CONTACTS TAB */}
        {activeTab === 'Emergency Contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            {emergency_contacts.map((ec) => (
              <div key={ec.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex flex-col justify-between gap-spacing-xs">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="font-headline-sm text-on-surface font-bold">{ec.name}</span>
                      <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest font-label-sm font-bold text-on-surface-variant">
                        {ec.relationship}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant">{ec.location}</span>
                    <span className="font-code-md text-primary font-bold mt-1">{ec.mobile}</span>
                  </div>
                  {ec.is_keyholder ? (
                    <span className="px-spacing-xs py-spacing-3xs rounded bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">key</span> KEYHOLDER
                    </span>
                  ) : null}
                </div>
                <div className="bg-surface-container-lowest p-spacing-xs rounded border border-surface-container-highest flex items-center justify-between">
                  <span className="font-label-sm text-secondary font-bold">Status: {ec.notify_status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SOS HISTORY TAB */}
        {activeTab === 'SOS History' && (
          <div className="flex flex-col gap-spacing-sm">
            {sos_history.map(s => (
              <div key={s.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-spacing-xs">
                    <span className="font-code-md text-primary font-bold">{s.id}</span>
                    <span className="font-headline-sm font-bold text-on-surface">{s.emergency_type}</span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant">{s.location_address || c.address} • Logged: {s.created_at}</span>
                </div>
                <div className="flex items-center gap-spacing-sm">
                  <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-primary-container text-on-primary rounded">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ASSISTANCE REQUESTS TAB */}
        {activeTab === 'Assistance Requests' && (
          <div className="flex flex-col gap-spacing-sm">
            {assistance_requests.map(a => (
              <div key={a.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-spacing-xs">
                    <span className="font-code-md text-primary font-bold">{a.id}</span>
                    <span className="font-headline-sm font-bold text-on-surface">{a.request_type}</span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant">{a.description} • {a.created_at}</span>
                </div>
                <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-secondary-container text-on-secondary-container rounded">{a.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* WELFARE CHECKS TAB */}
        {activeTab === 'Welfare Checks' && (
          <div className="flex flex-col gap-spacing-sm">
            {welfare_checks.map(w => (
              <div key={w.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm font-bold text-on-surface">{w.check_type}</span>
                  <span className="font-body-sm text-on-surface-variant">{w.purpose} • Officer: {w.assigned_officer_name || 'HC Raj Kumar'}</span>
                  <span className="font-code-md text-primary font-bold mt-0.5">Scheduled: {w.scheduled_date} at {w.scheduled_time}</span>
                </div>
                <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-surface-container-highest text-on-surface rounded">{w.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* ASSIGNED OFFICERS TAB */}
        {activeTab === 'Assigned Officers' && (
          <div className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center gap-spacing-md">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO" alt="Officer" className="w-16 h-16 rounded-full object-cover shadow border border-primary" />
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold text-on-surface">Head Constable Raj Kumar (POL-1024)</span>
              <span className="font-body-sm text-on-surface-variant">Primary Beat Patrol Officer • PCR Van #04</span>
              <span className="font-code-md text-primary font-bold">+91 98140-99812</span>
            </div>
          </div>
        )}

        {/* AUDIT TRAIL TAB */}
        {activeTab === 'Audit Trail' && (
          <div className="flex flex-col gap-spacing-xs">
            {audit_trail.map(au => (
              <div key={au.id} className="p-spacing-sm bg-surface-container-low rounded border border-surface-container-highest flex items-center justify-between text-xs">
                <span className="text-on-surface"><strong>{au.action}:</strong> {au.description}</span>
                <span className="font-code-md text-on-surface-variant font-semibold">{au.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
