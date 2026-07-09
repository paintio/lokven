'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [agreements, setAgreements] = useState({
    personalData: false,
    userAgreement: false,
  });
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    name: '',
    isSeller: false,
    inn: '',
    ogrn: '',
    companyName: '',
    legalAddress: '',
    bankAccount: '',
    bik: '',
    documents: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'isSeller') {
        setFormData({
          ...formData,
          isSeller: checked,
        });
        if (!checked) {
          setFormData(prev => ({
            ...prev,
            isSeller: false,
            inn: '',
            ogrn: '',
            companyName: '',
            legalAddress: '',
            bankAccount: '',
            bik: '',
            documents: {},
          }));
        }
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements({
      ...agreements,
      [name]: checked,
    });
  };

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreements.personalData || !agreements.userAgreement) {
      alert('Необходимо принять условия обработки персональных данных и пользовательское соглашение');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
      }

      const data = await response.json();

      setCookie('token', data.token);
      setCookie('user', JSON.stringify(data.user));

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = () => {
    return formData.phone && formData.password && formData.password.length >= 6;
  };

  const canSubmit = () => {
    if (formData.isSeller) {
      return formData.inn && formData.companyName && formData.legalAddress;
    }
    return true;
  };

  return (
    <div className="container-custom max-w-2xl py-8">
      <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Регистрация</h1>
        <p className="text-[#6B7280] text-sm mb-6">Создайте аккаунт на Локвен</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="+7 999 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="example@mail.ru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Пароль *</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Минимум 6 символов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Ваше имя"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#3B82F6]"
                />
                <label className="text-sm text-[#6B7280]">
                  Зарегистрироваться как продавец/магазин
                </label>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F3F4F6]">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="personalData"
                    checked={agreements.personalData}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 mt-0.5 accent-[#3B82F6]"
                    required
                  />
                  <label className="text-sm text-[#6B7280]">
                    Я даю согласие на обработку персональных данных в соответствии с{' '}
                    <a href="#" className="text-[#3B82F6] hover:underline">
                      Политикой конфиденциальности
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="userAgreement"
                    checked={agreements.userAgreement}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 mt-0.5 accent-[#3B82F6]"
                    required
                  />
                  <label className="text-sm text-[#6B7280]">
                    Я принимаю{' '}
                    <a href="#" className="text-[#3B82F6] hover:underline">
                      Пользовательское соглашение
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-[#3B82F6] hover:underline">
                      Правила использования
                    </a>{' '}
                    платформы
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!canProceedToStep2()) {
                    alert('Заполните обязательные поля: телефон и пароль (минимум 6 символов)');
                    return;
                  }
                  if (!agreements.personalData || !agreements.userAgreement) {
                    alert('Необходимо принять условия обработки персональных данных и пользовательское соглашение');
                    return;
                  }
                  setStep(2);
                }}
                className="btn-primary w-full"
              >
                Далее
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {formData.isSeller ? (
                <>
                  <h3 className="font-semibold text-[#111827]">Данные организации</h3>
                  <p className="text-xs text-[#6B7280]">Заполните данные для регистрации магазина</p>

                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">ИНН *</label>
                    <input
                      type="text"
                      name="inn"
                      required={formData.isSeller}
                      value={formData.inn}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">ОГРН</label>
                    <input
                      type="text"
                      name="ogrn"
                      value={formData.ogrn}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="1234567890123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">Название компании *</label>
                    <input
                      type="text"
                      name="companyName"
                      required={formData.isSeller}
                      value={formData.companyName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="ООО Ромашка"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">Юридический адрес *</label>
                    <input
                      type="text"
                      name="legalAddress"
                      required={formData.isSeller}
                      value={formData.legalAddress}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="г. Москва, ул. Тверская, 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">Расчетный счет</label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="40817810099910004312"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">БИК</label>
                    <input
                      type="text"
                      name="bik"
                      value={formData.bik}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="044525974"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">Документы (ссылки)</label>
                    <input
                      type="text"
                      name="documents"
                      value={JSON.stringify(formData.documents)}
                      onChange={(e) => {
                        try {
                          const docs = JSON.parse(e.target.value);
                          setFormData({ ...formData, documents: docs });
                        } catch {
                          // ignore
                        }
                      }}
                      className="input-field w-full"
                      placeholder='{"passport": "url", "inn": "url"}'
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6B7280]">Вы регистрируетесь как обычный пользователь</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Документы для продавца не требуются</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </div>

              {formData.isSeller && !canSubmit() && (
                <p className="text-xs text-[#EF4444] text-center">
                  Заполните обязательные поля: ИНН, Название компании, Юридический адрес
                </p>
              )}
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#6366F1] hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}