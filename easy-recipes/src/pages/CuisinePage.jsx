import Cuisine from "../components/Cuisine";
import Footer from "../components/Footer";

export default function CuisinePage() {
    const cuisine = ["American", "Japanese", "Italian"];

    return (
        <div className="absolute w-full left-0 top-25">
            <h1 className="text-[50px] text-(--black) font-bold text-center">Cuisine</h1>
            <div className="border-t border-t-(--border-color) w-[85%] mx-auto pt-[25px] ">
                <p className="text-[25px] text-(--black) font-bold ms-[3%] mb-[20px]">Trending</p>
                <div className="flex justify-center gap-15 flex-wrap">
                    {cuisine.map((cuisine) => {
                        return <Cuisine cuisine={cuisine} key={cuisine} />;
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
}
