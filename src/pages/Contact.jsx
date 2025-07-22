import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="contact-info-title">Contact Information</h2>
            
            <div className="contact-item">
              <div className="contact-item-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-item-details">
                <h4>Address</h4>
                <p>123 Food Street, Delicious City, FC 12345</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Phone size={24} />
              </div>
              <div className="contact-item-details">
                <h4>Phone</h4>
                <p>+1 (234) 567-8900</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Mail size={24} />
              </div>
              <div className="contact-item-details">
                <h4>Email</h4>
                <p>info@foodease.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Clock size={24} />
              </div>
              <div className="contact-item-details">
                <h4>Hours</h4>
                <p>Mon - Sun: 9:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="contact-form-title">Send us a Message</h2>
            
            {submitted && (
              <div className="contact-success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Message subject"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="form-textarea"
                  placeholder="Your message"
                />
              </div>

              <button type="submit" className="contact-submit-btn btn-orange">
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;