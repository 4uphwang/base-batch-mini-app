"use client";

export default function MyCardSection() {

    return (
        <div className="w-full px-5 flex flex-col gap-y-4">
            <h2 className="font-semibold text-3xl">Onchain social<br />Business Card</h2>

            {/** nft 보여주기 */}
            <div className="flex w-full h-48 rounded-xl border ">
                BASECARD 영역
            </div>

            <div className="flex gap-x-2 ">
                <button className="flex flex-1 h-11 bg-button-1 rounded-xl justify-center items-center text-white font-medium text-lg">My Basecard</button>
                <button className="flex flex-1 h-11 bg-button-1 rounded-xl justify-center items-center text-white font-medium text-lg">Share</button>
            </div>
        </div>
    );
}