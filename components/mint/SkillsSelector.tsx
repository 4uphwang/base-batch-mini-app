"use client";

import { ALL_SKILLS, MAX_SKILLS } from "@/lib/constants/mint";
import { memo } from "react";
import { SkillTag } from "./SkillTag";

interface SkillsSelectorProps {
    selectedSkills: string[];
    onToggleSkill: (skill: string) => void;
}

/**
 * 스킬 선택 컴포넌트 - 모바일 최적화
 */
export const SkillsSelector = memo(function SkillsSelector({ selectedSkills, onToggleSkill }: SkillsSelectorProps) {
    const selectedCount = selectedSkills.length;

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-900">
                    Skills <span className="text-red-500">*</span>
                </label>
                {selectedCount > 0 && (
                    <span className="text-xs text-gray-600 font-medium">
                        <span className="text-[#0050FF] font-bold">{selectedCount}</span> / {MAX_SKILLS}
                    </span>
                )}
            </div>

            {/* 스킬 컨테이너 - 모바일 최적화 */}
            <div
                className={`flex flex-wrap gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 min-h-[60px] ${selectedCount > 0
                    ? "border-[#0050FF]/30 bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
            >
                {ALL_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                        <SkillTag
                            key={skill}
                            skill={skill}
                            isSelected={isSelected}
                            onClick={() => onToggleSkill(skill)}
                        />
                    );
                })}
            </div>

            {/* 안내 텍스트 */}
            {selectedCount === 0 && (
                <p className="text-xs text-gray-500 italic">Select up to {MAX_SKILLS} skills</p>
            )}
            {selectedCount >= MAX_SKILLS && (
                <p className="text-xs text-[#0050FF] font-medium flex items-center gap-1">
                    <span>✓</span> Maximum {MAX_SKILLS} skills selected
                </p>
            )}
        </div>
    );
});
