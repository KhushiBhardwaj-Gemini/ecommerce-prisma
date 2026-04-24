import "../styles/footer.css";
import { Phone, MapPin, Mail, Copyright } from "lucide-react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <div className="footer-heading">About Company</div>
          <div className="footer-text">
            We build modern and scalable web applications with clean UI.
          </div>
          <div className="footer-text icon-row">
            <MapPin size={16} />
            India
          </div>

          <div className="footer-text icon-row">
            <Phone size={16} />
            +91 98765 43210
          </div>
          <div className="footer-text icon-row">
            <Mail size={16} />
            support@productstore.com
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Our Services</div>
          <div>Product Listing</div>
          <div>Cart Management</div>
          <div>UI Design</div>
          <div>Performance</div>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Customer Support</div>
          <div>FAQ</div>
          <div>Help Center</div>
          <div>Privacy Policy</div>
          <div>Terms</div>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Useful Links</div>
          <div>Home</div>
          <div>About</div>
          <div>Cart</div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="logo">Product Store</div>
        <div className="copyright">
          <Copyright size={14} />
          <span>2026 Product Store. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
