import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const { reviewId } = req.query;
  const token = req.cookies?.auth_Token;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const API_URL = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/api/analytics/reviews/${reviewId}`;
  
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        const getResponse = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!getResponse.ok) {
          throw new Error(`Error fetching review: ${getResponse.statusText}`);
        }
        
        const review = await getResponse.json();
        return res.status(200).json(review);
        
      case 'PUT':
        const updateData = req.body;
        
        const updateResponse = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Error updating review: ${updateResponse.statusText}`);
        }
        
        const updatedReview = await updateResponse.json();
        return res.status(200).json(updatedReview);
        
      case 'DELETE':
        const deleteResponse = await fetch(API_URL, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`Error deleting review: ${deleteResponse.statusText}`);
        }
        
        const deleteResult = await deleteResponse.json();
        return res.status(200).json(deleteResult);
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in review API route:', error);
    return res.status(500).json({ error: error.message });
  }
} 