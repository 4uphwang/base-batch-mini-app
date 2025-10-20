"use client";

import { useAtom } from "jotai";
import { useState } from "react";

import { userProfileAtom } from "@/store/userProfileState";

import BackButton from "@/components/common/BackButton";
import { FloatingInput, FloatingLabel } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";


const MAX_SKILLS = 8;
const MAX_WEBSITES = 3;
const ALL_SKILLS = [
    "Solidity", "Rust", "Security", "Javascript", "Typescript",
    "Go", "Game development", "Data", "UI/UX", "Prototyping",
    "Research", "Music", "Illustration", "Writing", "Video",
    "Graphic design", "Animation", "Visual design", "Design",
    "Digital art", "Photography", "Community",
    "Product management", "Strategy", "Business development",
    "Legal", "Marketing"
];

interface SkillTagProps {
    skill: string;
    isSelected: boolean;
    onClick: () => void;
}

const SkillTag = ({ skill, isSelected, onClick }: SkillTagProps) => {
    const baseClasses = "py-1 px-3 text-sm rounded-full transition-colors duration-150 flex items-center";
    const selectedClasses = "bg-[#DFE9FF] text-primary-1 border border-primary-1";
    const defaultClasses = "bg-background-light-2 text-gray-700 hover:bg-gray-200 border border-transparent";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
        >
            <span>{skill}</span>
            <span className="ml-1 text-xs  font-bold w-2">{isSelected ? '✕' : '+'}</span>
        </button>
    );
};


export default function Mint() {
    const [userProfile] = useAtom(userProfileAtom);
    const username = userProfile.username;

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [github, setGithub] = useState("");
    const [facaster, setFacaster] = useState("");
    const [twitter, setTwitter] = useState("");
    const [websites, setWebsites] = useState<string[]>([]);
    const [newWebsite, setNewWebsite] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isBaseNameIncluded, setIsBaseNameIncluded] = useState(false);



    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => {
            if (prev.includes(skill)) {
                // 이미 선택된 경우 제거
                return prev.filter(s => s !== skill);
            } else {
                // 선택되지 않은 경우 추가 (최대 개수 확인)
                if (prev.length >= MAX_SKILLS) {
                    // 사용자에게 명확히 알림
                    // alert(`스킬은 최대 ${MAX_SKILLS}개까지만 선택할 수 있습니다`);
                    return prev; // 추가하지 않고 기존 배열 반환
                }
                return [...prev, skill];
            }
        });
    };


    const handleAddWebsite = () => {
        const urlToAdd = newWebsite.trim();
        if (!urlToAdd) return;
        if (websites.includes(urlToAdd)) return;
        if (websites.length < MAX_WEBSITES) {
            setWebsites(prev => [...prev, urlToAdd]);
            setNewWebsite("");
        }
    };

    const handleRemoveWebsite = (urlToRemove: string) => {
        setWebsites(prev => prev.filter(url => url !== urlToRemove));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalData = {
            name,
            role,
            bio,
            github,
            twitter,
            websites,
            skills: selectedSkills,
            baseName: isBaseNameIncluded ? username : undefined
        };
        console.log("민팅 데이터:", finalData);
        // TODO: 민팅 API 호출 로직 구현
    };

    return (
        <div className="bg-white text-black">
            <div className="relative">
                <BackButton />
            </div>
            <div className="flex flex-col pt-14 px-5 ">
                <h1 className="text-3xl font-semibold">Mint Your BaseCard</h1>
                <p className="text-lg font-medium text-gray-400">Everyone can be a builder</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-start px-5 py-4 gap-y-6">

                {/* 프로필 이미지 영역 */}
                <div className="w-24 h-24 rounded-xl border border-black overflow-hidden">
                    {
                        userProfile?.pfpUrl
                            ? <Image src={userProfile.pfpUrl} alt="profile_mintpage" className="w-24 h-24 object-contain" />
                            : <div className="w-full h-full bg-gray-200" />
                    }
                </div>

                {/* 1. 이름 입력 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="name" className="text-lg font-medium">Your Name*</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 text-lg border border-gray-300"
                    />
                </div>

                {/* 2. 역할 입력 (라벨/인풋 분리) */}
                <div className="w-full space-y-2">
                    <Label htmlFor="role" className="text-lg font-medium">Your Role*</Label>
                    <Input
                        id="role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        placeholder="e.g., Senior Developer"
                        className="h-12 text-lg border border-gray-300"
                    />
                </div>

                {/* 3. 스킬 선택 영역 */}
                {/**TODO: 드롭다운으로 변경예정 */}
                <div className="w-full">
                    <h3 className="text-lg font-medium mb-3">Skills*</h3>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg">
                        {ALL_SKILLS.map(skill => {
                            const isSelected = selectedSkills.includes(skill);
                            // const isDisabled = !isSelected && selectedSkills.length >= MAX_SKILLS;

                            return (
                                <SkillTag
                                    key={skill}
                                    skill={skill}
                                    isSelected={isSelected}
                                    onClick={() => toggleSkill(skill)}
                                />
                            );
                        })}
                    </div>
                </div>



                {/* 추가 선택 영역 4. Socials 그룹을 위한 공간 */}
                <div className="flex flex-col w-full gap-y-2">
                    <h3 className="text-lg font-medium">Socials</h3>

                    <div className="relative w-full">
                        <FloatingInput
                            id="twitter/x"
                            type="text"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="twitter/x">Twitter / X</FloatingLabel>
                    </div>

                    <div className="relative w-full">
                        <FloatingInput
                            id="github"
                            type="text"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="github">GitHub</FloatingLabel>
                    </div>

                    <div className="relative w-full">
                        <FloatingInput
                            id="github"
                            type="text"
                            value={facaster}
                            onChange={(e) => setFacaster(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="github">Facaster</FloatingLabel>
                    </div>
                </div>


                {/* 5. 웹사이트 목록 */}
                <div className="w-full">
                    <h3 className="text-lg font-medium mb-3">Websites ({websites.length}/{MAX_WEBSITES})</h3>

                    {/* 웹사이트 추가 입력 필드 */}
                    <div className="flex gap-2 mb-3">
                        <FloatingInput
                            id="new-website"
                            type="url"
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value)}
                            className="flex-1 p-3 text-base h-12 border border-gray-300"
                            placeholder="https://your-site.com"
                            disabled={websites.length >= MAX_WEBSITES}
                        />
                        <button
                            type="button"
                            onClick={handleAddWebsite}
                            disabled={!newWebsite.trim() || websites.length >= MAX_WEBSITES}
                            // 🚨 w-12 h-12로 크기를 Input과 동일하게 고정
                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium text-white transition-colors ${!newWebsite.trim() || websites.length >= MAX_WEBSITES
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {/* 아이콘 크기를 조정하고, flex-center로 중앙 정렬 */}
                            <FaPlus size={18} />
                        </button>
                    </div>

                    {/* 현재 웹사이트 목록 */}
                    {websites.length > 0 && <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[40px]">
                        {websites.map(url => (
                            <div key={url} className="py-1 px-3 text-sm rounded-full bg-background-light-2 text-gray-800 flex items-center">
                                <span className="truncate max-w-[150px]">{url}</span>
                                <button
                                    type="button"
                                    className="ml-1 text-red-400 hover:text-red-600 font-bold text-base transition-colors "
                                    onClick={() => handleRemoveWebsite(url)}
                                    aria-label={`${url} Delete`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>}
                </div>

                <div className="w-full space-y-2"> {/* 💡 전체 필드를 위한 간격 확보 */}

                    <Label htmlFor="base_name_input" className="text-lg font-medium">Base Name</Label>
                    <div className="flex gap-x-2 items-center">
                        <div className="relative flex-1">
                            <input
                                id="base_name_input"
                                type="text"
                                value={username || undefined}
                                disabled
                                className="w-full p-3 text-lg h-12 border border-gray-400 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                            />
                        </div>

                        <Switch
                            id="include-base-name"
                            disabled={!username}
                            checked={isBaseNameIncluded}
                            onCheckedChange={setIsBaseNameIncluded}
                        />
                    </div>
                </div>

                {/* 7. 자기소개 텍스트 영역 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="bio" className="text-lg font-medium">About Yourself</Label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                        rows={4}
                        placeholder="Summarize your experience and goals."
                    />
                </div>

                {/* 민팅 버튼 */}
                <button
                    type="submit"
                    className="w-full py-3 mt-6 text-lg font-bold bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                >
                    MINT YOUR BASECARD
                </button>
            </form>
        </div>
    );
}