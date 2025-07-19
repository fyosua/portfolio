'use client'; 

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import DOMPurify from 'dompurify';
import ReCAPTCHA from 'react-google-recaptcha';
import { HiOutlineMail } from 'react-icons/hi';
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    if (!recaptchaToken) {
      setStatus('error');
      setStatusMessage('Please complete the reCAPTCHA.');
      return;
    }
    
    const templateParams = {
      user_name: DOMPurify.sanitize(name),
      user_email: DOMPurify.sanitize(email),
      message: DOMPurify.sanitize(message),
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      setStatus('success');
      setStatusMessage('Message sent successfully!');
      
      setName('');
      setEmail('');
      setMessage('');
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      
    } catch (error) {
      console.error('FAILED...', error);
      setStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Get In Touch</h2>
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
          <form onSubmit={sendEmail} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="user_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="user_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
            />

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={status === 'sending' || !recaptchaToken}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {status !== 'idle' && (
            <div className={`mt-4 text-center p-2 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusMessage}
            </div>
          )}

          <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-600 pt-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Or connect with me directly:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              
              <a href="mailto:ferdianyosua@gmail.com" className="flex items-center justify-center gap-2 text-primary font-medium hover:underline">
                <HiOutlineMail size={20} />
                <span>ferdianyosua@gmail.com</span>
              </a>

              <a href="https://www.linkedin.com/in/yosua-ferdian-a1a929116/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-primary font-medium hover:underline">
                <FaLinkedin size={20} />
                <span>Yosua Ferdian</span>
              </a>

              <a href="https://wa.me/6281290216083" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-primary font-medium hover:underline">
                <FaWhatsapp size={20} />
                <span>+62 812 9021 6083</span>
              </a>

              <a href="https://wa.me/601127817121" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-primary font-medium hover:underline">
                <FaWhatsapp size={20} />
                <span>+60 11 2781 7121</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}