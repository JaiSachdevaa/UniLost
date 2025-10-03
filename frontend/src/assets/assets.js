import about_image from './about_image.png'
import appointment_img from './appointment_img.png'
import arrow_icon from './arrow_icon.svg'
import chats_icon from './chats_icon.svg'
import contact_image from './contact_image.png'
import cross_icon from './cross_icon.png'
import Dermatologist from './Dermatologist.svg'
import doc1 from './doc1.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import dropdown_icon from './dropdown_icon.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import group_profiles from './group_profiles.png'
import Gynecologist from './Gynecologist.svg'
import header_img from './header_img.png'
import info_icon from './info_icon.svg'
import logo from './logo.svg'
import menu_icon from './menu_icon.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import profile_pic from './profile_pic.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import upload_icon from './upload_icon.png'
import verified_icon from './verified_icon.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'Mobile Phones',
        image: General_physician
    },
    {
        speciality: 'Keys',
        image: Gynecologist
    },
    {
        speciality: 'Notes & Books',
        image: Dermatologist
    },
    {
        speciality: 'Lunches & Bottles',
        image: Pediatricians
    },
    {
        speciality: 'Wearables',
        image: Neurologist
    },
    {
        speciality: 'Others',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Lost iPhone 13',
        image: doc1,
        speciality: 'Mobile Phones',
        degree: 'Apple',
        experience: 'Lost 2 days ago',
        about: 'A black iPhone 13 with a cracked screen, last seen near the library. Comes with a blue silicone case.',
        fees: 0,
        address: {
            line1: 'Library, Main Campus',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc2',
        name: 'Set of Car Keys',
        image: doc2,
        speciality: 'Keys',
        degree: 'Honda',
        experience: 'Lost yesterday',
        about: 'A set of Honda car keys with a red keychain, lost in the cafeteria area.',
        fees: 0,
        address: {
            line1: 'Cafeteria, Block A',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc3',
        name: 'Math Notebook',
        image: doc3,
        speciality: 'Notes & Books',
        degree: 'Spiral-bound',
        experience: 'Lost 3 days ago',
        about: 'A blue spiral notebook with handwritten math notes, last seen in Lecture Hall 2.',
        fees: 0,
        address: {
            line1: 'Lecture Hall 2',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc4',
        name: 'Water Bottle',
        image: doc4,
        speciality: 'Lunches & Bottles',
        degree: '500ml Stainless Steel',
        experience: 'Lost today',
        about: 'A silver stainless steel water bottle with a black lid, misplaced near the gym.',
        fees: 0,
        address: {
            line1: 'Gym Area',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc5',
        name: 'Smartwatch',
        image: doc5,
        speciality: 'Wearables',
        degree: 'Apple Watch Series 7',
        experience: 'Lost 1 day ago',
        about: 'A black Apple Watch Series 7, last seen near the sports ground.',
        fees: 0,
        address: {
            line1: 'Sports Ground',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc6',
        name: 'Umbrella',
        image: doc6,
        speciality: 'Others',
        degree: 'Foldable Black',
        experience: 'Lost 4 days ago',
        about: 'A black foldable umbrella with a wooden handle, lost near the main gate.',
        fees: 0,
        address: {
            line1: 'Main Gate',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc7',
        name: 'Lost Samsung Galaxy S21',
        image: doc7,
        speciality: 'Mobile Phones',
        degree: 'Samsung',
        experience: 'Lost 2 days ago',
        about: 'A black Samsung Galaxy S21 with a red case, last seen near the cafeteria.',
        fees: 0,
        address: {
            line1: 'Cafeteria Area',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc8',
        name: 'House Keys',
        image: doc8,
        speciality: 'Keys',
        degree: 'Metal Key Set',
        experience: 'Lost yesterday',
        about: 'A bunch of house keys with a green keychain, misplaced near the library entrance.',
        fees: 0,
        address: {
            line1: 'Library Entrance',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc9',
        name: 'Physics Textbook',
        image: doc9,
        speciality: 'Notes & Books',
        degree: 'Hardcover',
        experience: 'Lost 3 days ago',
        about: 'A hardcover physics textbook, blue cover, last seen in Lecture Hall 5.',
        fees: 0,
        address: {
            line1: 'Lecture Hall 5',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc10',
        name: 'Lunchbox',
        image: doc10,
        speciality: 'Lunches & Bottles',
        degree: 'Plastic Container',
        experience: 'Lost today',
        about: 'A red plastic lunchbox, last seen in the student lounge.',
        fees: 0,
        address: {
            line1: 'Student Lounge',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc11',
        name: 'Fitness Tracker',
        image: doc11,
        speciality: 'Wearables',
        degree: 'Mi Band 6',
        experience: 'Lost 1 day ago',
        about: 'A black Mi Band 6 fitness tracker, misplaced near the sports ground.',
        fees: 0,
        address: {
            line1: 'Sports Ground',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc12',
        name: 'Sunglasses',
        image: doc12,
        speciality: 'Others',
        degree: 'Ray-Ban Aviator',
        experience: 'Lost 2 days ago',
        about: 'A pair of Ray-Ban Aviator sunglasses, black frame, last seen near the parking lot.',
        fees: 0,
        address: {
            line1: 'Parking Lot',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc13',
        name: 'iPad Mini',
        image: doc13,
        speciality: 'Mobile Phones',
        degree: 'Apple',
        experience: 'Lost yesterday',
        about: 'A space gray iPad Mini with a black cover, lost in Lecture Hall 3.',
        fees: 0,
        address: {
            line1: 'Lecture Hall 3',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc14',
        name: 'USB Drive',
        image: doc14,
        speciality: 'Others',
        degree: '16GB SanDisk',
        experience: 'Lost 1 day ago',
        about: 'A 16GB SanDisk USB drive, blue color, last seen in the computer lab.',
        fees: 0,
        address: {
            line1: 'Computer Lab',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    },
    {
        _id: 'doc15',
        name: 'Notebook Set',
        image: doc15,
        speciality: 'Notes & Books',
        degree: 'Spiral Notebooks',
        experience: 'Lost 3 days ago',
        about: 'A set of three spiral notebooks, red, blue, and green, last seen in the library reading area.',
        fees: 0,
        address: {
            line1: 'Library Reading Area',
            line2: 'Rajasthan Manipal University, Jaipur'
        }
    }
]
