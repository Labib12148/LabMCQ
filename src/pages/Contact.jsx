import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function Contact() {
  return (
    <div className="prose dark:prose-invert max-w-xl mx-auto">
      <Seo title="Contact | LabMCQ" description="যোগাযোগ করুন" />
      <h1>যোগাযোগ</h1>
      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact/success">
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
        <label>নাম<input name="name" required className="input" /></label>
        <label>ইমেইল<input name="email" type="email" required className="input" /></label>
        <label>বার্তা<textarea name="message" required className="input"></textarea></label>
        <button type="submit">বার্তা পাঠান</button>
      </form>
      <p className="text-sm mt-4"><em>English:</em> Use the form above to reach us. Alternatively email <a href="mailto:team@labmcq.com">team@labmcq.com</a>.</p>
    </div>
  );
}
