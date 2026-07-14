'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Globe,
  HeartHandshake,
  Laptop,
  Rocket,
  TrendingUp,
} from 'lucide-react';

const IMAGES = {
  hero:
    'https://res.cloudinary.com/REPLACE/image/upload/v1/careers/hero',
};

const benefits = [
  {
    icon: Code2,
    title: 'Современный стек',
    text: 'React, Next.js, NestJS, PostgreSQL, Prisma и современные инструменты разработки.',
  },
  {
    icon: Globe,
    title: 'Международный продукт',
    text: 'Мы создаём платформу, рассчитанную на пользователей из разных стран.',
  },
  {
    icon: Rocket,
    title: 'Быстрое развитие',
    text: 'Идеи быстро превращаются в новые функции продукта.',
  },
  {
    icon: Laptop,
    title: 'Remote First',
    text: 'Работайте из любой точки мира с удобным графиком.',
  },
  {
    icon: TrendingUp,
    title: 'Карьерный рост',
    text: 'Берите ответственность и развивайтесь вместе с компанией.',
  },
  {
    icon: HeartHandshake,
    title: 'Команда',
    text: 'Мы ценим открытость, взаимопомощь и инженерный подход.',
  },
];

export default function JobsPage() {
  return (
    <main className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#F9FAFB]">

      {/* HERO */}

      <section className="container-custom py-10 md:py-16">

        <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-xl">

          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-2 items-center p-8 md:p-14">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">

                <BriefcaseBusiness className="h-4 w-4 text-blue-600" />

                <span className="text-sm font-semibold text-blue-700">
                  Карьера в Lokven
                </span>

              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-[#111827] xl:text-6xl">

                Создавайте
                <span className="block text-blue-600">
                  будущее вместе
                </span>
                с Lokven

              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6B7280]">

                Мы создаём современную международную платформу объявлений.
                Если вам нравится разрабатывать быстрые, красивые и удобные
                цифровые продукты — будем рады видеть вас в нашей команде.

              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/listings?type=jobs"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                >
                  Смотреть вакансии
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 font-semibold text-[#111827] transition hover:bg-gray-50"
                >
                  Отправить резюме
                </Link>

              </div>

              <div className="mt-10 flex flex-wrap gap-6">

                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Laptop className="h-4 w-4 text-blue-600" />
                  Remote First
                </div>

                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Code2 className="h-4 w-4 text-blue-600" />
                  Современный стек
                </div>

                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Международная команда
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="relative">

              <div className="overflow-hidden rounded-3xl">

                <Image
                  src={IMAGES.hero}
                  alt="Команда Lokven"
                  width={900}
                  height={900}
                  className="h-[560px] w-full object-cover transition duration-700 hover:scale-105"
                  priority
                />

              </div>

              <div className="absolute left-6 top-6 rounded-2xl border border-white/60 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">

                <div className="text-3xl font-black text-[#111827]">
                  12+
                </div>

                <div className="text-sm text-[#6B7280]">
                  открытых вакансий
                </div>

              </div>

              <div className="absolute bottom-6 right-6 rounded-2xl border border-white/60 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">

                <div className="font-bold text-[#111827]">
                  React · Next.js
                </div>

                <div className="mt-1 text-sm text-[#6B7280]">
                  NestJS · PostgreSQL
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* WHY LOKVEN */}

      <section className="container-custom py-10 md:py-16">

        <div className="mb-10 max-w-3xl">

          <h2 className="text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
            Почему Lokven
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#6B7280]">
            Мы создаём не просто сервис объявлений.
            Мы строим технологическую платформу, которой удобно пользоваться
            людям и компаниям по всему миру.
          </p>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {benefits.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  rounded-3xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-xl
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-50
                    text-blue-600
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >

                  <Icon className="h-6 w-6" />

                </div>


                <h3 className="mt-5 text-xl font-bold text-[#111827]">
                  {item.title}
                </h3>


                <p className="mt-3 leading-7 text-[#6B7280]">
                  {item.text}
                </p>


              </div>
            );

          })}

        </div>

      </section>


      {/* TECHNOLOGY STACK */}

      <section className="container-custom py-10 md:py-16">

        <div
          className="
            rounded-3xl
            border
            border-[#E5E7EB]
            bg-white
            p-8
            md:p-12
          "
        >

          <div className="max-w-2xl">

            <h2 className="text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
              Наш стек
            </h2>

            <p className="mt-4 text-lg leading-8 text-[#6B7280]">
              Мы используем современные технологии,
              чтобы создавать быстрый, стабильный и масштабируемый продукт.
            </p>

          </div>


          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">


            {[
              'React',
              'Next.js',
              'TypeScript',
              'NestJS',
              'Prisma',
              'PostgreSQL',
              'Docker',
              'Redis',
              'GitHub',
              'Cloudinary',
            ].map((tech) => (

              <div
                key={tech}
                className="
                  flex
                  h-20
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#E5E7EB]
                  bg-[#F9FAFB]
                  font-semibold
                  text-[#111827]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-300
                  hover:bg-white
                  hover:shadow-lg
                "
              >

                {tech}

              </div>

            ))}


          </div>


        </div>

      </section>
            {/* OPEN POSITIONS */}

      <section className="container-custom py-10 md:py-16">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <h2 className="text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
              Открытые вакансии
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6B7280]">
              Присоединяйтесь к команде Lokven и помогайте создавать продукт,
              которым пользуются реальные люди.
            </p>

          </div>


          <Link
            href="/listings?type=jobs"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >

            Все вакансии

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>


        <div className="mt-10 grid gap-5 lg:grid-cols-3">


          {[
            {
              title: 'Frontend Developer',
              stack: 'React · Next.js · TypeScript',
              type: 'Remote',
            },
            {
              title: 'Backend Developer',
              stack: 'NestJS · Prisma · PostgreSQL',
              type: 'Remote',
            },
            {
              title: 'UI/UX Designer',
              stack: 'Figma · Design System',
              type: 'Remote',
            },
          ].map((job) => (

            <div
              key={job.title}
              className="
                rounded-3xl
                border
                border-[#E5E7EB]
                bg-white
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <div className="flex items-center justify-between">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-50
                    text-blue-600
                  "
                >

                  <BriefcaseBusiness className="h-6 w-6" />

                </div>


                <span
                  className="
                    rounded-full
                    bg-green-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                  "
                >
                  {job.type}
                </span>


              </div>


              <h3 className="mt-6 text-xl font-bold text-[#111827]">
                {job.title}
              </h3>


              <p className="mt-3 text-[#6B7280]">
                {job.stack}
              </p>


              <Link
                href="/listings?type=jobs"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >

                Подробнее

                <ArrowRight className="h-4 w-4" />

              </Link>


            </div>

          ))}


        </div>


      </section>



      {/* HIRING PROCESS */}


      <section className="container-custom py-10 md:py-16">


        <div
          className="
            rounded-3xl
            bg-[#111827]
            p-8
            text-white
            md:p-12
          "
        >


          <h2 className="text-3xl font-black md:text-4xl">
            Как проходит найм
          </h2>


          <p className="mt-4 max-w-2xl text-white/70">
            Мы стараемся сделать процесс максимально прозрачным и комфортным.
          </p>



          <div className="mt-10 grid gap-6 md:grid-cols-4">


            {[
              {
                number: '01',
                title: 'Отклик',
                text: 'Вы отправляете резюме и рассказываете о себе.',
              },
              {
                number: '02',
                title: 'Знакомство',
                text: 'Обсуждаем опыт, цели и ожидания.',
              },
              {
                number: '03',
                title: 'Интервью',
                text: 'Проверяем технические навыки и подход.',
              },
              {
                number: '04',
                title: 'Старт',
                text: 'Добро пожаловать в команду Lokven.',
              },
            ].map((step) => (

              <div
                key={step.number}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                "
              >

                <div className="text-3xl font-black text-blue-400">
                  {step.number}
                </div>


                <h3 className="mt-4 text-xl font-bold">
                  {step.title}
                </h3>


                <p className="mt-3 leading-7 text-white/70">
                  {step.text}
                </p>


              </div>

            ))}


          </div>


        </div>


      </section>
            {/* LIFE AT LOKVEN */}

      <section className="container-custom py-10 md:py-16">

        <div className="max-w-3xl">

          <h2 className="text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
            Жизнь в Lokven
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#6B7280]">
            Мы создаём продукт вместе: обсуждаем идеи, экспериментируем,
            развиваем технологии и постоянно улучшаем платформу.
          </p>

        </div>


        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">


          {[
            {
              image:
                'https://res.cloudinary.com/REPLACE/image/upload/v1/careers/team',
              title: 'Команда',
            },
            {
              image:
                'https://res.cloudinary.com/REPLACE/image/upload/v1/careers/workspace',
              title: 'Рабочий процесс',
            },
            {
              image:
                'https://res.cloudinary.com/REPLACE/image/upload/v1/careers/meeting',
              title: 'Обсуждение идей',
            },
          ].map((item) => (

            <div
              key={item.title}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-[#E5E7EB]
                bg-white
              "
            >

              <div className="overflow-hidden">

                <Image
                  src={item.image}
                  alt={item.title}
                  width={700}
                  height={500}
                  className="
                    h-72
                    w-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-105
                  "
                />

              </div>


              <div className="p-5">

                <h3 className="text-xl font-bold text-[#111827]">
                  {item.title}
                </h3>

              </div>


            </div>

          ))}


        </div>

      </section>



      {/* FAQ */}

      <section className="container-custom py-10 md:py-16">


        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 md:p-12">


          <h2 className="text-3xl font-black text-[#111827] md:text-4xl">
            Частые вопросы
          </h2>


          <div className="mt-8 space-y-4">


            {[
              {
                q: 'Можно работать удалённо?',
                a: 'Да. Lokven поддерживает удалённый формат работы.',
              },
              {
                q: 'Какие технологии используются?',
                a: 'Frontend: React, Next.js. Backend: NestJS, Prisma, PostgreSQL.',
              },
              {
                q: 'Есть ли возможность роста?',
                a: 'Да. Мы приветствуем инициативу и развитие внутри команды.',
              },
              {
                q: 'Как быстро приходит ответ?',
                a: 'Мы стараемся отвечать кандидатам максимально быстро.',
              },
            ].map((item) => (

              <details
                key={item.q}
                className="
                  group
                  rounded-2xl
                  border
                  border-[#E5E7EB]
                  p-5
                "
              >

                <summary
                  className="
                    cursor-pointer
                    list-none
                    font-semibold
                    text-[#111827]
                  "
                >

                  {item.q}

                </summary>


                <p className="mt-3 leading-7 text-[#6B7280]">

                  {item.a}

                </p>


              </details>

            ))}


          </div>


        </div>


      </section>



      {/* FINAL CTA */}

      <section className="container-custom pb-16 md:pb-24">


        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-blue-600
            p-8
            text-white
            md:p-14
          "
        >


          <div
            className="
              absolute
              -right-20
              -top-20
              h-72
              w-72
              rounded-full
              bg-white/10
              blur-3xl
            "
          />


          <div className="relative max-w-3xl">


            <h2 className="text-3xl font-black md:text-5xl">

              Готовы создавать Lokven вместе с нами?

            </h2>


            <p className="mt-5 text-lg leading-8 text-white/80">

              Если вам близки технологии, развитие продукта и желание
              создавать полезные сервисы — будем рады познакомиться.

            </p>


            <div className="mt-8 flex flex-wrap gap-4">


              <Link
                href="/listings?type=jobs"
                className="
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  font-semibold
                  text-blue-600
                  transition
                  hover:bg-gray-100
                "
              >

                Открытые вакансии

              </Link>


              <Link
                href="/contact"
                className="
                  rounded-xl
                  border
                  border-white/30
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-white/10
                "
              >

                Отправить резюме

              </Link>


            </div>


          </div>


        </div>


      </section>


    </main>
  );
}