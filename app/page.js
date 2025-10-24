"use client"

import Layout from '../components/Layout'
import AnimatedBackground from '../components/AnimatedBackground'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    }))
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Nairobi'
      }))
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <AnimatedBackground />
      <Layout>
        {/* Enhanced Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <span className="brand-icon">🎵</span>
              <span>Music Flow</span>
            </div>
            <ul className="nav-links">
              <li><Link href="/" className="nav-link active">Home</Link></li>
              <li><Link href="/projects" className="nav-link">Projects</Link></li>
              <li><Link href="/about" className="nav-link">About</Link></li>
              <li><Link href="/contact" className="nav-link">Contact</Link></li>
            </ul>
            <div className="nav-extra">
              <span className="time-display">🕒 {currentTime} EAT</span>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀 Innovative Tech Solutions</span>
            </div>
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">Music Flow</span>
            </h1>
            <p className="hero-subtitle">
              Experience music like never before with cutting-edge technology and seamless user experiences
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
            <div className="cta-buttons">
              <button className="btn-primary">
                <span>🚀 Get Started</span>
                <span className="btn-hover-effect">Start Your Project</span>
              </button>
              <button className="btn-secondary">
                <span>📚 Learn More</span>
                <span className="btn-hover-effect">View Our Work</span>
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced About Section */}
        <section className="about-casper">
          <div className="section-container">
            <div className="section-header">
              <h2>About <span className="highlight">CASPER TECH KENYA</span></h2>
              <p className="section-subtitle">Pioneering Technology Solutions from the Heart of Naivasha</p>
            </div>
            
            <div className="about-grid">
              <div className="about-content">
                <p className="lead-text">
                  CASPER TECH KENYA is a cutting-edge technology company founded by <strong>Casper Ng'ang'a</strong>, 
                  a versatile full-stack developer and ethical hacker based in Naivasha, Kenya. With over 5 years 
                  of professional experience, we specialize in creating secure, scalable, and innovative digital solutions.
                </p>
                
                <div className="expertise-areas">
                  <h3>Core Expertise Areas</h3>
                  <div className="expertise-grid">
                    <div className="expertise-card">
                      <div className="expertise-icon">🔐</div>
                      <h4>Cybersecurity</h4>
                      <p>Ethical hacking, penetration testing, and security audits to protect your digital assets</p>
                    </div>
                    <div className="expertise-card">
                      <div className="expertise-icon">📱</div>
                      <h4>Mobile Development</h4>
                      <p>Native Android apps with modern architecture and exceptional user experience</p>
                    </div>
                    <div className="expertise-card">
                      <div className="expertise-icon">🌐</div>
                      <h4>Web Solutions</h4>
                      <p>Full-stack web applications with responsive design and robust backend systems</p>
                    </div>
                    <div className="expertise-card">
                      <div className="expertise-icon">🤖</div>
                      <h4>AI & Automation</h4>
                      <p>Intelligent automation scripts and AI-powered tools for business efficiency</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="tech-stack-sidebar">
                <h3>Technical Proficiency</h3>
                <div className="tech-category">
                  <h4>Frontend Technologies</h4>
                  <div className="tech-tags">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Next.js</span>
                    <span className="tech-tag">TypeScript</span>
                    <span className="tech-tag">Tailwind CSS</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>Backend Technologies</h4>
                  <div className="tech-tags">
                    <span className="tech-tag">Node.js</span>
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">Django</span>
                    <span className="tech-tag">PHP/Laravel</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>Mobile Development</h4>
                  <div className="tech-tags">
                    <span className="tech-tag">Kotlin</span>
                    <span className="tech-tag">Java</span>
                    <span className="tech-tag">React Native</span>
                    <span className="tech-tag">Flutter</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>DevOps & Tools</h4>
                  <div className="tech-tags">
                    <span className="tech-tag">Docker</span>
                    <span className="tech-tag">Git</span>
                    <span className="tech-tag">AWS</span>
                    <span className="tech-tag">CI/CD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Projects Section */}
        <section className="project-highlight">
          <div className="section-container">
            <div className="section-header">
              <h2>Featured <span className="highlight">Projects</span></h2>
              <p className="section-subtitle">Innovative Solutions Driving Digital Transformation</p>
            </div>
            
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-icon">📹</div>
                <h3>Social Media Downloaders</h3>
                <p>Advanced download tools for YouTube, Instagram, and TikTok with privacy-focused architecture</p>
                <ul className="project-features">
                  <li>🛡️ Secure API integration</li>
                  <li>⚡ High-performance processing</li>
                  <li>📱 Mobile-optimized interface</li>
                  <li>🔒 Privacy-first design</li>
                </ul>
                <div className="project-tech">
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">Node.js</span>
                </div>
              </div>
              
              <div className="project-card">
                <div className="project-icon">🏢</div>
                <h3>Enterprise Solutions</h3>
                <p>Custom business applications with scalable architecture and robust security features</p>
                <ul className="project-features">
                  <li>📊 Real-time analytics</li>
                  <li>🔐 Role-based access control</li>
                  <li>🌍 Multi-region deployment</li>
                  <li>📈 Performance monitoring</li>
                </ul>
                <div className="project-tech">
                  <span className="tech-badge">Java</span>
                  <span className="tech-badge">Spring Boot</span>
                  <span className="tech-badge">PostgreSQL</span>
                </div>
              </div>
              
              <div className="project-card">
                <div className="project-icon">🤖</div>
                <h3>AI Automation Tools</h3>
                <p>Intelligent automation systems that streamline business processes and enhance productivity</p>
                <ul className="project-features">
                  <li>🧠 Machine learning integration</li>
                  <li>🔄 Workflow automation</li>
                  <li>📧 Smart notifications</li>
                  <li>📊 Data processing</li>
                </ul>
                <div className="project-tech">
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">TensorFlow</span>
                  <span className="tech-badge">FastAPI</span>
                </div>
              </div>
            </div>
            
            <div className="projects-cta">
              <Link href="/projects">
                <button className="btn-primary">
                  <span>View All Projects</span>
                  <span className="btn-arrow">→</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Technical Philosophy */}
        <section className="tech-philosophy">
          <div className="section-container">
            <div className="section-header">
              <h2>Our <span className="highlight">Technical Philosophy</span></h2>
              <p className="section-subtitle">Building the Future with Code That Matters</p>
            </div>
            
            <div className="philosophy-grid">
              <div className="philosophy-item">
                <div className="philosophy-icon">⚡</div>
                <h3>Performance Excellence</h3>
                <p>We optimize every line of code for maximum efficiency, ensuring lightning-fast applications that scale seamlessly with your growth.</p>
              </div>
              
              <div className="philosophy-item">
                <div className="philosophy-icon">🔒</div>
                <h3>Security First</h3>
                <p>Security is integrated into every phase of development, from design to deployment, protecting your data and your users.</p>
              </div>
              
              <div className="philosophy-item">
                <div className="philosophy-icon">🧩</div>
                <h3>Modular Architecture</h3>
                <p>Clean, maintainable code with modular design patterns that make future updates and feature additions effortless.</p>
              </div>
              
              <div className="philosophy-item">
                <div className="philosophy-icon">🌍</div>
                <h3>Global Scalability</h3>
                <p>Applications designed to perform reliably across different regions, devices, and network conditions.</p>
              </div>
            </div>
            
            <div className="development-process">
              <h3>Our Development Process</h3>
              <div className="process-steps">
                <div className="process-step">
                  <span className="step-number">01</span>
                  <h4>Discovery & Planning</h4>
                  <p>Thorough requirement analysis and project architecture design</p>
                </div>
                <div className="process-step">
                  <span className="step-number">02</span>
                  <h4>Agile Development</h4>
                  <p>Iterative development with regular updates and feedback sessions</p>
                </div>
                <div className="process-step">
                  <span className="step-number">03</span>
                  <h4>Quality Assurance</h4>
                  <p>Comprehensive testing including security audits and performance checks</p>
                </div>
                <div className="process-step">
                  <span className="step-number">04</span>
                  <h4>Deployment & Support</h4>
                  <p>Smooth deployment and ongoing maintenance with 24/7 support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Call to Action */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to Transform Your Ideas into Reality?</h2>
              <p>
                Let's collaborate to build innovative solutions that drive your business forward. 
                From concept to deployment, we're here to ensure your project's success.
              </p>
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-icon">💬</span>
                  <span>Free initial consultation</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">⚡</span>
                  <span>Fast project delivery</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🛡️</span>
                  <span>Ongoing support & maintenance</span>
                </div>
              </div>
            </div>
            <div className="cta-actions">
              <Link href="/contact">
                <button className="btn-primary large">
                  <span>Start Your Project</span>
                  <span className="btn-sparkle">✨</span>
                </button>
              </Link>
              <Link href="/about">
                <button className="btn-secondary large">
                  Learn More About Us
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Enhancement */}
        <footer className="enhanced-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CASPER TECH KENYA</h3>
              <p>Building the future, one line of code at a time</p>
              <div className="social-links">
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Web Development</li>
                <li>Mobile Apps</li>
                <li>Cybersecurity</li>
                <li>AI Solutions</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>📍 Naivasha, Kenya</li>
                <li>📧 hello@caspertech.co.ke</li>
                <li>📞 +254 7XX XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CASPER TECH KENYA. All rights reserved.</p>
          </div>
        </footer>
      </Layout>
    </>
  )
}
