import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Logo from "../assets/logo.png";

// this component was adapted from Flowbite UI library
const Footer = () => {
    return (
        <footer className="bg-primary mt-16">
            <div className="mx-auto w-full p-8 py-12 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="flex flex-col items-start gap-4 mb-8">
                        <div className="flex items-center justify-start gap-4">
                            <Image src={Logo} alt="Logo" className="w-16 h-16" />
                            <Link href="/" className="text-background text-xl lg:text-2xl tracking-wide">UBC BIONICS</Link>
                        </div>
                        <p className="text-background">Reinventing the world of prosthesis through bionic engineering.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-background">Pages</h2>
                            <ul className="text-neutral-200">
                                <li className="mb-4">
                                    <Link href="/teams">Teams</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/projects">Projects</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/sponsors">Sponsors</Link>
                                </li>
                                <li>
                                    <Link href="/contact">Contact</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-background">Follow Us</h2>
                            <ul className="text-neutral-200">
                                <li className="mb-4">
                                    <a href="https://www.instagram.com/ubcbionicsteam/" target="_blank">Instagram</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://www.facebook.com/ubcbionicsteampage/" target="_blank">Facebook</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://x.com/ubcbionicsteam/" target="_blank">Twitter</a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/company/ubcbionicsteam/" target="_blank">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-background">Other</h2>
                            <ul className="text-neutral-200">
                                <li className="mb-4">
                                    <a href="https://engineering.ubc.ca/engineering-design-teams/bionics" target="_blank">Our UBC Page</a>
                                </li>
                                <li>
                                    <a href="https://experience.apsc.ubc.ca/student-groups/engineering-design-teams" target="_blank">About Design Teams</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-neutral-200 sm:text-center">© 2024 UBC Bionics. All rights reserved.</span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0 gap-4">
                        <a href="https://www.instagram.com/ubcbionicsteam/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-neutral-200 hover:text-background text-2xl" />
                        </a>
                        <a href="https://www.facebook.com/ubcbionicsteampage/" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-neutral-200 hover:text-background text-2xl" />
                        </a>
                        <a href="https://x.com/ubcbionicsteam/" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="text-neutral-200 hover:text-background text-2xl" />
                        </a>
                        <a href="https://www.linkedin.com/company/ubcbionicsteam/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-neutral-200 hover:text-background text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
