import internships from '../mock/internship.json';

// Simulate an API call to get all internships
export const getAllInternships = async () => {
  console.log('Fetching all internships...');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be an axios.get() call
  return internships;
};

// We will add getInternshipById later