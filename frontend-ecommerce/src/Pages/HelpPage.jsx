import React from 'react';
import '../styles/HelpPage.css';

const HelpPage = () => {
  return (
    <div className="help-container">
      <div className="help-box">
        <h2>Help & Support</h2>

        <section>
          <h3>🛒 Placing an Order</h3>
          <p>
            Browse products on the Home or Categories page. Click "Add to Cart" to add items. Once you're done, go to the Cart and click "Buy Now" to place your order.
          </p>
        </section>

        <section>
          <h3>👤 Managing Your Profile</h3>
          <p>
            Go to the Profile page from the menu. You can view and edit your name, phone number, and address there.
          </p>
        </section>

        <section>
          <h3>📦 Viewing Your Orders</h3>
          <p>
            Go to "My Orders" from the navigation bar. You can see all your past orders, including products, quantity, and total price.
          </p>
        </section>

        <section>
          <h3>🔐 Login & Security</h3>
          <p>
            Make sure you're logged in with your registered email. If you're logged out, you'll be redirected to the login page.
          </p>
        </section>

        <section>
          <h3>❓ Still Need Help?</h3>
          <p>
            Contact us at <strong>mdeena910@gmail.com</strong> or call us at <strong>+91-7540026828</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
