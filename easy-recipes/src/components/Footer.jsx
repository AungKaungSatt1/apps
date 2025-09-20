import {
    Phone,
    EnvelopeSimple,
    MapPinLine,
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
    TiktokLogo,
} from "phosphor-react";

export default function Footer() {
    return (
        <footer className="flex flex-row flex-wrap w-full justify-evenly h-[300px] mt-[50px] text-white bg-(--secondary-color) pt-5 relative">
            <div className="flex flex-col w-[200px] gap-5">
                <strong className="text-[1.5em]">Contact Us</strong>
                <span>
                    <Phone className="inline me-2" />
                    +95 912 3456 789
                </span>
                <span>
                    <EnvelopeSimple className="inline me-2" />
                    stinky12@gmail.com
                </span>
                <span>
                    <MapPinLine className="inline me-2" />
                    No. 234, Stinky st. Stinkiest Township
                </span>
            </div>
            <div className="flex flex-col w-[300px] gap-5 [&>*]:cursor-pointer">
                <strong className="text-[1.5em]">Terms and Services</strong>
                <span>Terms and Policies</span>
                <span>Terms of Services</span>
                <span>Help</span>
            </div>
            <div className="flex flex-col w-[250px] gap-5">
                <strong className="text-[1.5em]">About Website</strong>
                <p>
                    Easy Recipes is a website where people can share their way of cooking food and
                    spread kindness through dishes!
                </p>
            </div>
            <div className="flex w-[300px] flex-col">
                <strong className="text-[1.5em]">Follow Us for Updates!</strong>
                <span className="[&>*]:inline [&>*]:me-5 [&>*]:cursor-pointer font-bold text-[3em] ">
                    <FacebookLogo />
                    <TwitterLogo />
                    <InstagramLogo />
                    <TiktokLogo />
                </span>
            </div>
            <span className="absolute bottom-5 right-5">
                2024 Copyrights &copy; | all rights reserved | Easy Recipes
            </span>
        </footer>
    );
}
