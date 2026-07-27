import { FaFacebook, FaInstagram,FaTiktok} from 'react-icons/fa';

const Footer = () => {  
  return (
    <footer className="bg-emerald-900 text-emerald-200 py-8 text-center">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://www.facebook.com/muslimscoutma" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition">
          <FaFacebook />
        </a>
        <a href="https://www.facebook.com/muslimscoutma" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition">
          <FaInstagram />
        </a>
        <a 
  href="https://www.tiktok.com/@muslimscout_ma" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaTiktok />
</a>
      </div>
      <p className="text-sm">&copy; {new Date().getFullYear()} Muslim Scouts. All rights reserved.</p>
      <p className="text-xs mt-2 text-emerald-700 font-mono" title="Be Prepared">
        -... . / .--. .-. . .--. .- .-. . -..
      </p>
    </footer>
  );
}
export default Footer;