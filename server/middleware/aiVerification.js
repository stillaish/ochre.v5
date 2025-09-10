// AI Verification System for Hazard Reports
export const verifyHazardReport = async (req, res, next) => {
  try {
    const { location, description, type } = req.body;
    const [longitude, latitude] = location.coordinates;
    
    let score = 50; // Base score
    let reasons = [];
    
    // 1. Check if location is within India boundaries
    const isInIndia = isLocationInIndia(latitude, longitude);
    if (!isInIndia) {
      score -= 40;
      reasons.push('Location outside India boundaries');
    } else {
      score += 20;
      reasons.push('Valid Indian location');
    }
    
    // 2. Check for spam/fake keywords
    const spamKeywords = ['test', 'fake', 'spam', 'joke', 'lol', 'haha'];
    const hasSpam = spamKeywords.some(keyword => 
      description.toLowerCase().includes(keyword)
    );
    if (hasSpam) {
      score -= 30;
      reasons.push('Contains potential spam keywords');
    }
    
    // 3. Check description length and quality
    if (description.length < 20) {
      score -= 15;
      reasons.push('Description too short');
    } else if (description.length > 50) {
      score += 10;
      reasons.push('Detailed description provided');
    }
    
    // 4. Check for duplicate reports (same user, same location, same type, within 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicate = await req.app.get('HazardReport').findOne({
      user: req.user._id,
      type,
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 1000 // 1km radius
        }
      },
      createdAt: { $gte: oneDayAgo }
    });
    
    if (duplicate) {
      score -= 25;
      reasons.push('Similar report already exists');
    }
    
    // 5. Time-based verification (reports should be recent)
    const reportTime = new Date();
    const currentHour = reportTime.getHours();
    if (currentHour >= 6 && currentHour <= 22) {
      score += 5;
      reasons.push('Reported during active hours');
    }
    
    // 6. High-risk type verification
    const highRiskTypes = ['earthquake', 'cyclone', 'flood'];
    if (highRiskTypes.includes(type)) {
      score += 15;
      reasons.push('High-priority hazard type');
    }
    
    // Determine final status
    let status = 'pending';
    if (score >= 70) {
      status = 'verified';
      reasons.push('Auto-verified by AI system');
    } else if (score <= 30) {
      status = 'rejected';
      reasons.push('Auto-rejected due to low confidence');
    } else {
      reasons.push('Requires manual review');
    }
    
    // Add AI verification data to request
    req.aiVerification = {
      score: Math.max(0, Math.min(100, score)),
      reasons,
      processedAt: new Date(),
      status
    };
    
    next();
  } catch (error) {
    console.error('AI Verification Error:', error);
    // Continue without AI verification if there's an error
    req.aiVerification = {
      score: 50,
      reasons: ['AI verification failed, pending manual review'],
      processedAt: new Date(),
      status: 'pending'
    };
    next();
  }
};

// Simple function to check if coordinates are within India boundaries
function isLocationInIndia(lat, lng) {
  // Rough bounding box for India
  const bounds = {
    north: 37.6,
    south: 6.4,
    east: 97.25,
    west: 68.1
  };
  
  return lat >= bounds.south && lat <= bounds.north && 
         lng >= bounds.west && lng <= bounds.east;
}