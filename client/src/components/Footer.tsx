import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h4>Contact Information</h4>
          <p>Email: contact@fishstore.com</p>
          <p>Phone: +84 123 456 789</p>
          <p>Address: 123 Fish Street, Ho Chi Minh City, Vietnam</p>
        </div>
        <div className="footer-author">
          <p>Created by Nguyễn Quốc Khánh</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Fish Store. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
