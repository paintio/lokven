import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    // Пути для проверки флешки (Windows)
    const flashPaths = [
      'D:/',
      'E:/',
      'F:/',
      'G:/',
      'H:/',
    ];

    let detected = false;
    
    for (const path of flashPaths) {
      try {
        const keyPath = `${path}.lokven_key`;
        if (fs.existsSync(keyPath)) {
          detected = true;
          break;
        }
      } catch {}
    }

    return NextResponse.json({ detected });
  } catch {
    return NextResponse.json({ detected: false });
  }
}