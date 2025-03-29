export default async function handler(req, res) {
  const { propertyId } = req.query;
  const token = req.cookies?.auth_Token;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  try {
    // Make request to backend API
    const API_URL = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/api/analytics/reviews/property/${propertyId}`;
    
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching property reviews: ${response.statusText}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in property reviews API route:', error);
    return res.status(500).json({ error: error.message });
  }
} 