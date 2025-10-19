import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // 1. 클라이언트에서 전송된 JSON 데이터를 파싱합니다.
        const logData = await request.json();

        const timestamp = new Date().toISOString();

        // 2. 서버 콘솔에 로그를 출력합니다. (Vercel 대시보드에서 확인 가능)
        console.log(`[CLIENT LOG] - ${timestamp}`);
        console.log(`[PATH] - ${logData.path || 'N/A'}`);
        console.log(`[MESSAGE] - ${logData.message || 'No message'}`);
        // 중요: 전체 데이터 객체를 한 번 더 출력하여 상세 정보를 확인합니다.
        console.log('--- Full Payload ---', logData);
        console.log('--------------------');

        // 3. 성공 응답
        return NextResponse.json({ success: true, receivedAt: timestamp }, { status: 200 });

    } catch (error) {
        // JSON 파싱 오류 등 서버 내부 오류 처리
        console.error('Failed to process debug log request:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}