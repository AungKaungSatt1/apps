export default function Envelope() {
    const envelopes = ["about", "challenges", "outcomes"];
    const letters = [project.description, project.challenges, project.outcomes];

    const openEnvelope = (e, envelope) => {
        if (e.target.classList.contains("clicked")) {
            e.target.setAttribute("onClick", null);
            e.target.classList.remove("clicked");
            e.target.children[5].classList.add("-bottom-10");
            e.target.children[5].classList.remove("-bottom-15", "opacity-0");
            e.target.children[0].classList.remove("top-15", "opacity-0");
            e.target.children[1].classList.remove("top-10");
            e.target.children[2].classList.remove("top-15", "opacity-0");
            e.target.children[3].classList.remove("top-15", "opacity-0");
            e.target.children[4].children[0].classList.remove("w-[150px]");
            e.target.children[4].children[0].children[1].remove();
            e.target.children[4].classList.add("top-25");
            e.target.children[4].classList.remove("-top-7");
            setTimeout(() => {
                e.target.children[3].classList.remove(
                    "transform-[rotateX(180deg)]",
                    "-z-3"
                );
            }, 500);
            setTimeout(() => {
                e.target.setAttribute(
                    "onClick",
                    "(e) => {openEnvelope(e, envelope)};"
                );
            }, 2000);
        } else {
            e.target.classList.add("clicked");
            e.target.setAttribute("onClick", null);
            e.target.children[3].classList.add(
                "transform-[rotateX(180deg)]",
                "-z-3"
            );
            setTimeout(() => {
                e.target.children[5].classList.remove("-bottom-10");
                e.target.children[5].classList.add("-bottom-15", "opacity-0");
                e.target.children[4].classList.remove("top-25");
                e.target.children[4].classList.add("-top-7");
                e.target.children[4].children[0].classList.add("w-[150px]");
                e.target.children[3].classList.add("top-15", "opacity-0");
                e.target.children[2].classList.add("top-15", "opacity-0");
                e.target.children[1].classList.add("top-10");
                e.target.children[0].classList.add("top-15", "opacity-0");
                setTimeout(() => {
                    if (!e.target.children[4].children[0].children[1])
                        e.target.children[4].children[0].innerHTML += `<span style="color:white; display:inline-block; width: 80%; text-align: center; font-weight: 700;">${envelope.toUpperCase()}</span>`;
                }, 300);
            }, 500);
            setTimeout(() => {
                e.target.setAttribute(
                    "onClick",
                    "(e) => {openEnvelope(e, envelope)};"
                );
            }, 2000);
        }
    };

    return (
        <div>
            {envelopes.map((envelope, index) => {
                return (
                    <div key={envelope} className="mb-[100px]">
                        <div
                            className="w-full h-full [&>*]:transition-all [&>*]:ease-in-out [&>*]:duration-1000 cursor-pointer"
                            onClick={(e) => openEnvelope(e, envelope)}
                        >
                            <div className="bg-[#acacf3] w-[106.5%] h-full -z-4 absolute top-0"></div>
                            <div className="bg-(--primary-color) shadow-lg w-[80%] h-full -z-2 absolute top-0 left-11 text-[0.9em] p-[10px]">
                                {letters[index]}
                            </div>
                            <div className="w-full h-full border-t-transparent border-t-[100px] border-s-[160px] border-e-[160px] border-e-(--secondary-color) border-s-(--secondary-color) origin-top absolute -z-1 top-0"></div>
                            <div className="w-full h-full border-t-[120px] border-t-[#acacf3] border-s-[160px] border-e-[160px] border-s-transparent border-e-transparent origin-top absolute top-0 -z-1 transition-all ease-in-out duration-700 cursor-pointer"></div>
                            <div className="text-center absolute top-25 w-full -z-1">
                                <span className="text-start inline-block mx-auto bg-[#c785ec] border-2 border-(--secondary-color) p-[5px] rounded-full ms-[25px] [&>*]:inline-block w-[39px] transition-all duration-500 ease-in-out">
                                    <StarFour
                                        className="text-[#ffd700]"
                                        size="1.5em"
                                        weight="fill"
                                    />
                                </span>
                            </div>
                            <h1 className="text-center text-[1.5em] ms-[10px] absolute -bottom-10 w-full">
                                {envelope.toUpperCase()}
                            </h1>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
