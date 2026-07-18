'use client';

import { useState } from 'react';
import { Car, Shield, AlertTriangle, CheckCircle, Loader2, FileText } from 'lucide-react';

interface VehicleCheckProps {
  vin: string; // 👈 ОБЯЗАТЕЛЬНО ДОБАВЬТЕ ЭТОТ ПРОПС
  className?: string;
}

interface CheckResult {
  status: 'clean' | 'warning' | 'danger' | 'unknown';
  title: string;
  description: string;
  details: string[];
}

export default function VehicleCheck({ vin, className = '' }: VehicleCheckProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = async () => {
    const input = document.getElementById('vin-input') as HTMLInputElement;
    const vinNumber = input?.value || vin;
    
    if (!vinNumber || vinNumber.length < 17) {
      alert('Введите корректный VIN номер (17 символов)');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        status: Math.random() > 0.5 ? 'clean' : 'warning',
        title: Math.random() > 0.5 ? 'Автомобиль чист' : 'Есть ограничения',
        description: Math.random() > 0.5 
          ? 'Ограничений не найдено. Автомобиль можно приобретать.' 
          : 'Обнаружены ограничения. Рекомендуем дополнительную проверку.',
        details: [
          'Проверка по базам ГИБДД: пройдена',
          'Проверка залогов: ' + (Math.random() > 0.7 ? 'обнаружен залог' : 'не найдено'),
          'Проверка арестов: не найдено',
          'История ДТП: ' + (Math.random() > 0.8 ? 'есть записи' : 'чистая'),
        ],
      });
    } catch (error) {
      console.error('Error checking vehicle:', error);
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
    if (!result) return <Car className="w-6 h-6 text-[#6366F1]" />;
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
            <Car className="w-4 h-4 text-[#6366F1]" />
            Проверка автомобиля по VIN
          </h4>
          
          {!checked ? (
            <div className="mt-3">
              <p className="text-sm text-[#6B7280] mb-3">
                Проверьте историю автомобиля: ДТП, залоги, аресты, ограничения
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  id="vin-input"
                  placeholder="VIN номер (17 символов)"
                  defaultValue={vin || ''}
                  className="input-field flex-1 text-sm"
                  maxLength={17}
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
                VIN номер можно найти в ПТС или на лобовом стекле автомобиля
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
                    Проверить другой VIN
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