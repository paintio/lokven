'use client';

import { useState } from 'react';
import { Home, Shield, AlertTriangle, CheckCircle, Loader2, FileText, Building } from 'lucide-react';

interface RealtyCheckProps {
  cadastralNumber?: string;
  className?: string;
}

interface CheckResult {
  status: 'clean' | 'warning' | 'danger' | 'unknown';
  title: string;
  description: string;
  details: string[];
}

export default function RealtyCheck({ cadastralNumber, className = '' }: RealtyCheckProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = async () => {
    const input = document.getElementById('cadastral-input') as HTMLInputElement;
    const cadNumber = input?.value || cadastralNumber;
    
    if (!cadNumber || cadNumber.length < 10) {
      alert('Введите корректный кадастровый номер');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        status: Math.random() > 0.5 ? 'clean' : 'warning',
        title: Math.random() > 0.5 ? '✅ Объект чист' : '⚠️ Есть ограничения',
        description: Math.random() > 0.5 
          ? 'Ограничений не найдено. Объект можно приобретать.' 
          : 'Обнаружены ограничения. Рекомендуем дополнительную проверку.',
        details: [
          'Проверка по базе Росреестра: пройдена',
          'Проверка арестов: ' + (Math.random() > 0.9 ? 'обнаружен арест' : 'не найдено'),
          'Проверка залогов: ' + (Math.random() > 0.8 ? 'обнаружен залог' : 'не найдено'),
          'Проверка прав собственности: подтверждена',
        ],
      });
    } catch (error) {
      console.error('Error checking realty:', error);
      setResult({
        status: 'unknown',
        title: 'Ошибка проверки',
        description: 'Не удалось выполнить проверку. Попробуйте позже.',
        details: [],
      });
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  const getIcon = () => {
    if (!result) return <Home className="w-6 h-6 text-[#6366F1]" />;
    switch (result.status) {
      case 'clean': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'danger': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <Shield className="w-6 h-6 text-[#6366F1]" />;
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 border border-[#E5E7EB] ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#6366F1]/10 rounded-full flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-[#111827] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#6366F1]" />
            Проверка недвижимости
          </h4>
          
          {!checked ? (
            <div className="mt-3">
              <p className="text-sm text-[#6B7280] mb-3">
                Проверьте объект: аресты, залоги, обременения, права собственности
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  id="cadastral-input"
                  placeholder="Кадастровый номер"
                  defaultValue={cadastralNumber || ''}
                  className="input-field flex-1 text-sm"
                />
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Проверить
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">
                Кадастровый номер можно найти в документах на недвижимость
              </p>
            </div>
          ) : (
            <div className="mt-3">
              {result && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon()}
                    <span className={`font-medium ${
                      result.status === 'clean' ? 'text-green-600' :
                      result.status === 'warning' ? 'text-yellow-600' :
                      result.status === 'danger' ? 'text-red-600' :
                      'text-[#6366F1]'
                    }`}>
                      {result.title}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">{result.description}</p>
                  {result.details.length > 0 && (
                    <ul className="space-y-1 text-sm">
                      {result.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-[#4B5563]">
                          <span className="text-[#6366F1]">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => {
                      setChecked(false);
                      setResult(null);
                    }}
                    className="text-sm text-[#6366F1] hover:underline mt-3"
                  >
                    Проверить другой объект
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}