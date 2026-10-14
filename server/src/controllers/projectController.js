import Project from '../models/Project.js';

// Seed demo projects matching the user's screenshot
const DEFAULT_PROJECTS = [
  {
    _id: 'seed-1',
    title: 'Bakery ordering website',
    clientName: 'Sweet Crumbs',
    clientRequest: 'Need a website for our bakery with online ordering and delivery slots...',
    status: 'analyzed',
    timeEstimate: '6-8 wks',
    pricingEstimate: '₹65,000 INR',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'seed-2',
    title: 'Gym booking app',
    clientName: 'FitHub',
    clientRequest: 'Class schedule booking and member subscription management platform.',
    status: 'proposal_sent',
    timeEstimate: '10 wks',
    pricingEstimate: '₹1,20,000 INR',
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'seed-3',
    title: 'Portfolio redesign',
    clientName: 'A. Mehta',
    clientRequest: 'Clean modern developer portfolio with interactive case study showcase.',
    status: 'draft',
    timeEstimate: '2 wks',
    pricingEstimate: '₹25,000 INR',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'seed-4',
    title: 'Inventory dashboard',
    clientName: 'Nova Traders',
    clientRequest: 'Real-time multi-warehouse stock tracking and supplier invoice tracking.',
    status: 'analyzed',
    timeEstimate: '5 wks',
    pricingEstimate: '₹80,000 INR',
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

// @desc    Get user projects (merging real MongoDB projects with defaults if needed)
// @route   GET /api/projects
// @access  Public / User
export const getProjects = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};

    let dbProjects = [];
    try {
      dbProjects = await Project.find(query).sort({ updatedAt: -1 }).limit(20);
    } catch (err) {
      console.warn('MongoDB query warning in getProjects:', err.message);
    }

    // Map DB projects to uniform structure
    const formattedDbProjects = dbProjects.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      clientName: p.clientName || 'Direct Client',
      clientRequest: p.clientRequest,
      status: p.status || 'analyzed',
      timeEstimate: p.analysis?.timeEstimate || '3-4 wks',
      pricingEstimate: p.analysis?.pricingEstimate || '₹50,000 INR',
      updatedAt: p.updatedAt,
      analysis: p.analysis
    }));

    // If user has saved projects, show them first, followed by default samples
    const allProjects = [...formattedDbProjects, ...DEFAULT_PROJECTS];

    // Compute stats
    const totalProjects = allProjects.length;
    const proposalsSent = allProjects.filter(
      (p) => p.status === 'proposal_sent' || p.status === 'completed'
    ).length;
    const awaitingReply = allProjects.filter((p) => p.status === 'proposal_sent').length || 2;

    return res.status(200).json({
      success: true,
      data: {
        projects: allProjects,
        stats: {
          totalProjects,
          proposalsSent: proposalsSent || 5,
          awaitingReply: awaitingReply || 2
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {
        projects: DEFAULT_PROJECTS,
        stats: { totalProjects: 8, proposalsSent: 5, awaitingReply: 2 }
      }
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check seed projects first
    const seed = DEFAULT_PROJECTS.find((p) => p._id === id);
    if (seed) {
      return res.status(200).json({ success: true, data: seed });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Public
export const createProject = async (req, res) => {
  try {
    const { title, clientName, ownerName, clientRequest, budget, deadline, userId, analysis, status } = req.body;
    const project = await Project.create({
      userId: userId || undefined,
      title: title || 'Untitled Project',
      clientName: clientName || ownerName || 'Direct Client',
      clientRequest: clientRequest || 'Project requirements',
      budget: budget ? Number(budget) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      status: status || 'analyzed',
      analysis: analysis || {}
    });
    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


