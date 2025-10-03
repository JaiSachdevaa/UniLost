import { assets } from "../assets/assets"

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src ={assets.about_image} alt=""/>
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>Welcome to UniLost, your trusted partner in managing lost and found items conveniently and efficiently. At UniLost, we understand the challenges individuals face when trying to recover lost belongings or report missing items.</p>
          <p>UniLost is committed to excellence in lost & found management. We continuously strive to enhance our platform, integrating the latest technology to improve user experience and deliver a seamless service. Whether you're reporting a lost item or recovering a found one, UniLost is here to support you every step of the way.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>
  Our vision at <strong>UniLost</strong> is to revolutionize the lost & found experience by providing a centralized, secure, and transparent platform that makes recovering lost items effortless and efficient. We aim to replace outdated manual methods with a streamlined system that saves time, reduces stress, and ensures every user can recover their belongings quickly and reliably.
</p>

        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'> 
    <b>Efficiency:</b>
    <p>Quick reporting and searching of lost items through a centralized platform.</p>
  </div>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Convenience:</b>
    <p>Seamless access to found item listings anytime, anywhere.</p>
  </div>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Transparency:</b>
    <p>Clear, secure, and trustworthy process to ensure belongings are returned to the rightful owner.</p>
  </div>
</div>

    </div>
  )
}

export default About 
