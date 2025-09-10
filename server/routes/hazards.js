const express = require('express');
const { 
  addHazard, 
  getAllHazards, 
  getHazardsByUser, 
  updateHazard, 
  getHazardById,
  verifyHazard 
} = require('../data/storage');
const { validate, hazardSchema } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all hazards (public)
router.get('/', (req, res) => {
  try {
    const { status, type, limit = 50 } = req.query;
    let hazards = getAllHazards();

    // Filter by status
    if (status) {
      hazards = hazards.filter(hazard => hazard.status === status);
    }

    // Filter by type
    if (type) {
      hazards = hazards.filter(hazard => hazard.type === type);
    }

    // Limit results
    hazards = hazards.slice(0, parseInt(limit));

    res.json({ hazards });
  } catch (error) {
    console.error('Get hazards error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get hazard by ID (public)
router.get('/:id', (req, res) => {
  try {
    const hazard = getHazardById(req.params.id);
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    res.json({ hazard });
  } catch (error) {
    console.error('Get hazard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new hazard report (authenticated)
router.post('/', authenticateToken, validate(hazardSchema), (req, res) => {
  try {
    const hazardData = {
      ...req.body,
      userId: req.user.id
    };

    const hazard = addHazard(hazardData);

    // Auto-verify using AI
    const verification = verifyHazard(hazard);
    if (verification.verified) {
      updateHazard(hazard.id, {
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'AI_VERIFICATION'
      });
    } else {
      updateHazard(hazard.id, {
        status: 'rejected',
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'AI_VERIFICATION',
        rejectionReason: verification.reason
      });
    }

    // Get updated hazard
    const updatedHazard = getHazardById(hazard.id);

    res.status(201).json({
      message: 'Hazard report submitted successfully',
      hazard: updatedHazard,
      verification: verification
    });
  } catch (error) {
    console.error('Create hazard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's own hazard reports
router.get('/user/my-reports', authenticateToken, (req, res) => {
  try {
    const userHazards = getHazardsByUser(req.user.id);
    res.json({ hazards: userHazards });
  } catch (error) {
    console.error('Get user hazards error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update hazard status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updates = {
      status,
      verifiedAt: new Date().toISOString(),
      verifiedBy: req.user.id
    };

    if (status === 'rejected' && rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }

    const updatedHazard = updateHazard(req.params.id, updates);
    if (!updatedHazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }

    res.json({
      message: 'Hazard status updated successfully',
      hazard: updatedHazard
    });
  } catch (error) {
    console.error('Update hazard status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get hazard statistics (admin only)
router.get('/admin/statistics', authenticateToken, requireAdmin, (req, res) => {
  try {
    const hazards = getAllHazards();
    
    const stats = {
      total: hazards.length,
      byStatus: {
        pending: hazards.filter(h => h.status === 'pending').length,
        verified: hazards.filter(h => h.status === 'verified').length,
        rejected: hazards.filter(h => h.status === 'rejected').length
      },
      byType: hazards.reduce((acc, hazard) => {
        acc[hazard.type] = (acc[hazard.type] || 0) + 1;
        return acc;
      }, {}),
      bySeverity: hazards.reduce((acc, hazard) => {
        acc[hazard.severity] = (acc[hazard.severity] || 0) + 1;
        return acc;
      }, {}),
      recent: hazards.filter(h => {
        const hoursDiff = (new Date() - new Date(h.createdAt)) / (1000 * 60 * 60);
        return hoursDiff <= 24;
      }).length
    };

    res.json({ statistics: stats });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;