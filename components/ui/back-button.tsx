"use client";

import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6'; // FaAngleLeft 아이콘 사용
import { cn } from '@/lib/utils'; // Tailwind 클래스 병합 유틸리티 (cn)

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  // 기본 스타일
  const baseClasses = 'absolute left-2 top-2 p-2 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-100';

  return (
    <FaAngleLeft 
      size={40} 
      onClick={() => router.back()} // 💡 router.back() 호출
      className={cn(baseClasses, className)} // 💡 기본 스타일과 추가 스타일 병합
    />
  );
}