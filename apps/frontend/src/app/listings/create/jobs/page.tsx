"use client";

import React from 'react';
import {
  Zap,
  ShieldCheck,
  Users,
  Search,
  User,
  UserPlus,
  PlusCircle,
  Building2,
  FileText,
  CheckCircle2
} from 'lucide-react';

const CreateVacancy = () => {
  return (
    <div className="container">
      {/* ===== ШАПКА ===== */}
      <header className="navbar">
        <div className="logo">Lokven</div>
        <div className="nav-links">
          <a href="#">Главная</a>
          <a href="#">Объявления</a>
          <a href="#">Подать</a>
        </div>
        <div className="nav-actions">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input className="search-input" type="text" placeholder="Поиск..." />
          </div>
          <button className="btn-outline-nav">
            <User size={16} />
            Войти
          </button>
          <button className="btn-outline-nav">
            <UserPlus size={16} />
            Регистрация
          </button>
          <button className="btn-primary-nav">
            <PlusCircle size={16} />
            Подать объявление
          </button>
        </div>
      </header>

      {/* ===== ХЛЕБНЫЕ КРОШКИ ===== */}
      <div className="breadcrumb">
        Главная / <span>Создание вакансии</span>
      </div>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-text">
          <h1>Создавайте <span>вакансии</span> на Lokven</h1>
          <p>Размещайте вакансии и находите лучших специалистов среди тысяч пользователей платформы.</p>
          <ul className="hero-features">
            <li>
              <ShieldCheck size={20} className="feature-icon" />
              Проверенные работодатели
            </li>
            <li>
              <Zap size={20} className="feature-icon" />
              Быстрая публикация
            </li>
            <li>
              <Users size={20} className="feature-icon" />
              Большая аудитория
            </li>
          </ul>
          <div className="hero-buttons">
            <button className="btn-primary">
              <Building2 size={18} />
              Заполнить данные компании
            </button>
            <button className="btn-secondary">
              <FileText size={18} />
              Разместить резюме
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://res.cloudinary.com/qunkgqft/image/upload/v1784271762/hero-employer_pzn4sn.png"
            alt="Работодатель"
          />
        </div>
      </section>

      {/* ===== ПРЕИМУЩЕСТВА ===== */}
      <div className="benefits">
        <div className="benefit-card">
          <Zap size={36} className="benefit-icon" />
          <h3>Быстрая публикация</h3>
          <p>Разместите вакансию за несколько минут и получайте отклик от соискателей.</p>
        </div>
        <div className="benefit-card">
          <ShieldCheck size={36} className="benefit-icon" />
          <h3>Проверенные компании</h3>
          <p>Все работодатели проходят проверку. Это повышает доверие соискателей к вашим вакансиям.</p>
        </div>
        <div className="benefit-card">
          <Users size={36} className="benefit-icon" />
          <h3>Тысячи соискателей</h3>
          <p>Ваша вакансия будет доступна тысячам пользователей на всей платформе Lokven.</p>
        </div>
      </div>

      <div className="footer-note">
        Lokven — создайте вакансию и найдите лучших специалистов
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
          padding: 24px 32px 48px;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eef3f8;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #0b1e33;
          letter-spacing: -0.5px;
        }
        .logo span {
          color: #2b7be4;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          font-size: 15px;
          font-weight: 500;
          color: #1e3a5f;
        }
        .nav-links a {
          text-decoration: none;
          color: inherit;
        }
        .nav-links a:hover {
          color: #2b7be4;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #8aa3bc;
        }

        .search-input {
          padding: 8px 16px 8px 40px;
          border-radius: 40px;
          border: 1px solid #d9e2ec;
          background-color: #f8fafc;
          font-size: 14px;
          width: 180px;
          outline: none;
          transition: 0.2s;
        }
        .search-input:focus {
          border-color: #2b7be4;
          background-color: #fff;
        }

        .btn-outline-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 40px;
          border: 1px solid #d0ddee;
          background: transparent;
          font-weight: 500;
          font-size: 14px;
          color: #1e3a5f;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-outline-nav:hover {
          background: #f0f6fe;
          border-color: #2b7be4;
        }

        .btn-primary-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 40px;
          border: none;
          background: #2b7be4;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-primary-nav:hover {
          background: #1a66c4;
        }

        .breadcrumb {
          margin: 18px 0 12px;
          font-size: 14px;
          color: #5e7a99;
        }
        .breadcrumb span {
          color: #0b1e33;
          font-weight: 500;
        }

        .hero {
          background: linear-gradient(135deg, #eef6fe 0%, #ffffff 100%);
          border-radius: 20px;
          padding: 40px 44px;
          margin: 12px 0 32px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e2edf7;
        }

        .hero-text {
          flex: 1 1 300px;
        }
        .hero-text h1 {
          font-size: 36px;
          font-weight: 700;
          color: #0b1e33;
          margin-bottom: 10px;
        }
        .hero-text h1 span {
          color: #2b7be4;
        }
        .hero-text p {
          font-size: 16px;
          color: #2e4a6e;
          line-height: 1.5;
          max-width: 480px;
          margin-bottom: 18px;
        }

        .hero-features {
          display: flex;
          flex-wrap: wrap;
          gap: 20px 32px;
          font-size: 15px;
          color: #1a3452;
          margin-bottom: 28px;
          padding-left: 0;
        }
        .hero-features li {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .feature-icon {
          color: #2b7be4;
          flex-shrink: 0;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 40px;
          border: none;
          background: #2b7be4;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(43, 123, 228, 0.25);
          transition: 0.2s;
        }
        .btn-primary:hover {
          background: #1a66c4;
          transform: translateY(-2px);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 40px;
          border: 1.5px solid #c9d9eb;
          background: transparent;
          color: #1e3a5f;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-secondary:hover {
          background: #f0f6fe;
          border-color: #2b7be4;
        }

        .hero-image {
          flex: 0 0 180px;
          text-align: center;
        }
        .hero-image img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
        }

        .benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin: 40px 0 16px;
        }

        .benefit-card {
          background: #f9fcff;
          padding: 28px 20px 24px;
          border-radius: 18px;
          border: 1px solid #e6eff8;
          text-align: center;
          transition: 0.2s;
        }
        .benefit-card:hover {
          border-color: #2b7be4;
          box-shadow: 0 4px 16px rgba(43, 123, 228, 0.08);
        }

        .benefit-icon {
          color: #2b7be4;
          margin-bottom: 10px;
        }

        .benefit-card h3 {
          font-size: 20px;
          color: #0b1e33;
          margin-bottom: 8px;
        }
        .benefit-card p {
          font-size: 14px;
          color: #3c5b7c;
          line-height: 1.5;
        }

        .footer-note {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ecf2f8;
          font-size: 13px;
          color: #6b88a6;
          text-align: center;
        }

        @media (max-width: 700px) {
          .container { padding: 16px; }
          .navbar { flex-direction: column; align-items: stretch; }
          .nav-links { flex-wrap: wrap; gap: 12px; }
          .nav-actions { flex-wrap: wrap; }
          .search-input { width: 100%; }
          .hero { flex-direction: column; text-align: center; padding: 28px 20px; }
          .hero-text p { margin-left: auto; margin-right: auto; }
          .hero-features { justify-content: center; }
          .hero-buttons { justify-content: center; }
          .hero-image { margin-top: 20px; }
        }
      `}</style>
    </div>
  );
};

export default CreateVacancy;