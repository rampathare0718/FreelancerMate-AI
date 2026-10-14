/**
 * Proposal Generator Utility
 * Generates comprehensive, 2-page, client-friendly proposals in plain English
 * designed specifically for non-technical and fresher clients.
 */

export function generateStructuredProposal(project) {
  const clientName = project?.clientName || 'Direct Client';
  const projectTitle = project?.title || 'Custom Web Application';
  const timeEstimate = project?.timeEstimate || project?.analysis?.timeEstimate || '3 to 4 Weeks';
  const pricingEstimate = project?.pricingEstimate || project?.analysis?.pricingEstimate || '₹55,000 INR';
  
  // Format current date and 30-day validity
  const createdDate = project?.createdAt ? new Date(project.createdAt) : new Date();
  const dateStr = createdDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const validUntilDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const validUntilStr = validUntilDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const proposalId = `FMA-${Math.abs(hashString(projectTitle + clientName)) % 9000 + 1000}`;

  // Parse existing analysis or generate beginner-friendly content
  const analysis = project?.analysis || {};
  const isBakery = projectTitle.toLowerCase().includes('baker') || clientName.toLowerCase().includes('crumb');
  const isGym = projectTitle.toLowerCase().includes('gym') || projectTitle.toLowerCase().includes('fit') || clientName.toLowerCase().includes('fit');
  const isStore = projectTitle.toLowerCase().includes('store') || projectTitle.toLowerCase().includes('e-com') || projectTitle.toLowerCase().includes('skincare');
  const isInventory = projectTitle.toLowerCase().includes('inventory') || projectTitle.toLowerCase().includes('warehouse');

  // 1. Executive Summary in plain English
  let executiveSummary = analysis.summary || '';
  if (!executiveSummary || executiveSummary.length < 50) {
    if (isBakery) {
      executiveSummary = `This project will provide ${clientName} with a custom, user-friendly online ordering and bakery showcase platform. It eliminates the chaos of phone and WhatsApp order taking, allows customers to personalize custom cakes and treats, choose their preferred pickup or delivery time slots, and pay securely via UPI or Card. It will give your brand a mouth-watering online presence and automate daily order management.`;
    } else if (isGym) {
      executiveSummary = `This platform will equip ${clientName} with an automated membership and 1-on-1 personal training appointment booking system. Members can browse trainer schedules, reserve slots, and purchase session passes online 24/7 without requiring back-and-forth phone calls, saving your staff hours every week.`;
    } else if (isStore) {
      executiveSummary = `This project will launch a modern, high-converting direct-to-consumer e-commerce storefront for ${clientName}. It features smooth mobile browsing, instant product filtering, automated discounts, and fast checkout with Razorpay UPI and cards, helping you sell products across India with zero hassle.`;
    } else if (isInventory) {
      executiveSummary = `This platform delivers an intuitive real-time inventory and supplier management dashboard for ${clientName}. It centralizes stock tracking across warehouses, automatically flags low-stock items, generates daily supply reports, and prevents expensive stockouts or inventory mismatches.`;
    } else {
      executiveSummary = `This proposal outlines a modern, custom-built web application specifically tailored to streamline ${clientName}'s operations and delight your customers. The platform is designed from the ground up to be lightning-fast on mobile phones, easy to manage without technical experience, and fully secure for online transactions.`;
    }
  }

  // 2. Core Functional Modules (broken down for non-tech clients)
  const modules = [
    {
      title: 'Module 1: Customer-Facing Portal (Responsive & Fast)',
      description: 'A beautiful, intuitive interface where your customers can effortlessly view products/services, check availability, customize options, and complete their goals on any mobile phone, tablet, or desktop computer.',
      features: [
        'Mobile-first responsive design tailored with your brand colors & logo',
        'Intuitive navigation, live search filters, and smooth page transitions',
        'Customer shopping cart / booking flow with zero confusing steps',
        'Instant confirmation screen with clear order/booking details'
      ]
    },
    {
      title: 'Module 2: Secure Payment & Checkout Gateway',
      description: 'Integrated bank-grade payment processing enabling customers to pay directly from their preferred apps with instant receipts.',
      features: [
        'Instant Google Pay, PhonePe, Paytm, and UPI QR-code payments',
        'Credit/Debit card and Net Banking support with 100% RBI compliance',
        'Automated payment verification and instant digital invoices',
        'Direct settlement into your designated business bank account'
      ]
    },
    {
      title: 'Module 3: Owner / Admin Control Center',
      description: 'A private, password-protected management dashboard where you and your team can control everything without writing a single line of code.',
      features: [
        'Real-time overview of incoming orders, reservations, and customer inquiries',
        'Easy 1-click status updates (e.g., Received, In Progress, Ready, Completed)',
        'Product, service catalog, price, and inventory management',
        'Downloadable daily and monthly business reports in Excel / PDF format'
      ]
    },
    {
      title: 'Module 4: Automated Customer Alerts & Communications',
      description: 'Keep your customers in the loop automatically so you do not have to answer repetitive "Where is my order?" phone calls.',
      features: [
        'Instant WhatsApp / SMS confirmation alert upon successful booking or order',
        'Automated status update notifications (e.g., "Your order is ready!")',
        'Professional email receipts with your company branding'
      ]
    }
  ];

  // 3. Tech Stack explained in everyday analogies
  const techStackExplained = [
    {
      tech: 'React 19 (Frontend)',
      simpleExplanation: 'The Customer Interface',
      whyItMatters: 'Makes your website feel as fast and smooth as a native mobile smartphone app. Pages load in under 1 second without annoying screen refreshes.'
    },
    {
      tech: 'Node.js & Express (Backend)',
      simpleExplanation: 'The Brain & Engine',
      whyItMatters: 'Processes all calculations, payments, and customer requests reliably behind the scenes with bank-grade security encryption.'
    },
    {
      tech: 'MongoDB Atlas (Database)',
      simpleExplanation: 'The Digital Vault',
      whyItMatters: 'Cloud storage that keeps all your customer records, order history, and product details safe 24/7 with automated daily backups.'
    },
    {
      tech: 'Razorpay Gateway (Payments)',
      simpleExplanation: 'Online Cashier',
      whyItMatters: 'Allows customers to pay via UPI or Card in 10 seconds, with PCI-DSS Level 1 compliance ensuring zero fraudulent leaks.'
    }
  ];

  // 4. Weekly Phase-by-Phase Roadmap
  const roadmapPhases = [
    {
      phase: 'Phase 1 (Week 1): Blueprint, Wireframes & Visual Design',
      deliverables: [
        'Deep dive into your exact branding guidelines, colors, and layout preferences',
        'Creation of interactive visual prototypes (you approve the visual design before coding)',
        'Database architecture setup and project kickoff alignment'
      ]
    },
    {
      phase: 'Phase 2 (Weeks 2-3): Core Feature Development & Database Coding',
      deliverables: [
        'Building the customer-facing interface and product/booking workflow',
        'Development of the private Owner Admin Dashboard with full controls',
        'Secure database integration with automated data validation'
      ]
    },
    {
      phase: 'Phase 3 (Weeks 3-4): Payment Integration & Cross-Device Testing',
      deliverables: [
        'Connection of Razorpay UPI and card payment gateway',
        'Rigorous testing across iPhones, Android phones, tablets, and desktop browsers',
        'Security hardening and speed optimization'
      ]
    },
    {
      phase: 'Phase 4 (Launch Week): Live Deployment, Staff Training & Handover',
      deliverables: [
        'Live deployment to your custom domain with free lifetime SSL security badge (https)',
        '1-on-1 walkthrough training session for you and your staff',
        '100% full source code transfer and official launch celebration!'
      ]
    }
  ];

  // 5. Commercial Investment & 3-Stage Milestone Payment
  const numericPrice = extractNumericPrice(pricingEstimate);
  const m1 = Math.round(numericPrice * 0.40);
  const m2 = Math.round(numericPrice * 0.40);
  const m3 = numericPrice - m1 - m2;

  const milestones = [
    {
      stage: 'Milestone 1: Project Kickoff & UI Approval',
      percentage: '40%',
      amount: `₹${m1.toLocaleString('en-IN')} INR`,
      timing: 'Upon signing of proposal & design mockup approval'
    },
    {
      stage: 'Milestone 2: Functional Beta Demo',
      percentage: '40%',
      amount: `₹${m2.toLocaleString('en-IN')} INR`,
      timing: 'Upon working live demo of customer portal & admin dashboard'
    },
    {
      stage: 'Milestone 3: Final Launch & Handover',
      percentage: '20%',
      amount: `₹${m3.toLocaleString('en-IN')} INR`,
      timing: 'Upon deployment to your live domain & complete source code delivery'
    }
  ];

  // 6. 100% Guaranteed Inclusions
  const inclusions = [
    {
      title: '100% Source Code Ownership',
      desc: 'You own everything we build. All source code, design assets, and database schemas belong exclusively to you with zero vendor lock-in.'
    },
    {
      title: 'Free 30-Day Post-Launch Warranty',
      desc: 'Any unexpected bug, layout tweak, or question that arises within the first 30 days after launch is resolved completely free of charge.'
    },
    {
      title: 'Domain & SSL Setup Included',
      desc: 'We configure your custom web domain and set up high-grade SSL certificates so your website shows the trusted green security padlock.'
    },
    {
      title: '1-on-1 Admin Training Session',
      desc: 'A dedicated video walkthrough demonstrating how to add items, manage orders, and view sales reports with ease.'
    }
  ];

  return {
    proposalId,
    clientName,
    projectTitle,
    dateStr,
    validUntilStr,
    timeEstimate,
    pricingEstimate,
    executiveSummary,
    modules,
    techStackExplained,
    roadmapPhases,
    numericPrice,
    milestones,
    inclusions
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function extractNumericPrice(priceStr) {
  if (!priceStr) return 55000;
  const matches = priceStr.replace(/,/g, '').match(/\d+/g);
  if (matches && matches.length > 0) {
    const num = parseInt(matches[0], 10);
    if (!isNaN(num) && num > 1000) return num;
  }
  return 55000;
}
