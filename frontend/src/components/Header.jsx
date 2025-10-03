import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
      
      {/*-----Left Side------*/}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
    Find Items <br />
    <span className='text-[60%] italic text-yellow-200'>With a Trusted Platform</span>
  </p>
        <div className='flex flex-col md:flex-row items-center gap-4 text-white text-sm font-light'>
          <img className='w-30 h-20 object-cover' src={assets.group_profiles} alt="" />
          <p>
            Simply browse through our list of all items,
            <br className='hidden sm:block' />
            find your item hassle-free
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {/* Find Item (same as before, scrolls to speciality) */}
          <a
            href="#speciality"
            className='flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'
          >
            Find Item <img className='w-3' src={assets.arrow_icon} alt="" />
          </a>

          {/* Report Item (redirects to Report page) */}
          <Link
            to="/report"
            className='flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'
          >
            Report Item <img className='w-3' src={assets.arrow_icon} alt="" />
          </Link>
        </div>
      </div>

      {/*-----Right Side------*/}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
