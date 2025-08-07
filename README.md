# 🏫 EduTrack

**Moderná webová aplikácia pre správu úloh a hodnotenia v súkromných školách**

EduTrack je interaktívna platforma navrhnutá pre efektívne riadenie vzdelávacieho procesu medzi učiteľmi, žiakmi a administrátormi. Aplikácia poskytuje intuitívne rozhrania pre vytváranie úloh, sledovanie pokroku a hodnotenie výsledkov.

---

## 🚀 Demo

**Live aplikácia:** http://localhost:5178/ (po spustení)

### 🔐 Demo účty
- **Administrátor:** `admin@edutrack.sk` / `demo`
- **Učiteľ:** `teacher@edutrack.sk` / `demo`
- **Žiak:** `student@edutrack.sk` / `demo`

---

## ✨ Kľúčové funkcionality

### 👨‍💼 Pre administrátorov
- 📊 **Centralizovaný dashboard** s prehľadom systému
- 🏫 **Správa škôl** - pridávanie a editácia škôl
- 👥 **Správa používateľov** - pridávanie učiteľov a žiakov
- 📚 **Správa predmetov** - vytvorenie predmetov s priradením učiteľov a žiakov
- 🔍 **Detailné reporty** - sledovanie aktivity a pokroku

### 👨‍🏫 Pre učiteľov
- 🎯 **Teacher Dashboard** s rýchlymi akciami
- 📝 **Vytváranie úloh** - jednoduché pridanie úloh s termínmi
- ⭐ **Hodnotenie žiakov** - bodovanie a spätná väzba
- 📈 **Sledovanie pokroku** - prehľad odovzdaní a výsledkov
- 🔔 **Notifikácie** - upozornenia na nové odovzdania

### 🎓 Pre žiakov
- 📱 **Student Dashboard** s prehľadom úloh
- 📤 **Odovzdávanie riešení** - upload súborov (simulované)
- 📊 **Progress tracking** - sledovanie vlastného pokroku
- 💬 **Spätná väzba** - zobrazenie hodnotení a komentárov učiteľa
- ⏰ **Termíny úloh** - prehľad nadchádzajúcich deadlinov

---

## 🛠️ Technológie

### Frontend
- **React 18** s TypeScript
- **Vite** - rýchly build tool
- **Tailwind CSS** - moderný styling
- **React Router** - navigácia
- **Lucide React** - ikony

### State Management
- **Context API** - autentifikácia a dáta
- **LocalStorage** - perzistencia dát
- **Mock Data** - simulované údaje

### Ďalšie nástroje
- **PostCSS** - CSS preprocessing
- **ESLint** - linting
- **TypeScript** - type safety

---

## 🏗️ Štruktúra projektu

```
edutrack/
├── public/                    # Statické súbory
├── src/
│   ├── components/           # Reusable komponenty
│   │   ├── Layout.tsx       # Hlavný layout s navigáciou
│   │   └── ProtectedRoute.tsx # Ochrana routes podľa rolí
│   ├── contexts/            # Context providers
│   │   ├── AuthContext.tsx  # Autentifikácia
│   │   └── DataContext.tsx  # Správa dát
│   ├── data/                # Mock dáta
│   │   └── mockData.ts      # Simulované údaje
│   ├── pages/               # Stránky aplikácie
│   │   ├── admin/           # Administrátorské stránky
│   │   ├── teacher/         # Učiteľské stránky
│   │   ├── student/         # Žiacke stránky
│   │   └── Login.tsx        # Prihlásenie
│   ├── types/               # TypeScript typy
│   │   └── index.ts         # Definície typov
│   ├── App.tsx              # Hlavná aplikácia
│   └── main.tsx             # Entry point
├── package.json
└── README.md
```

---

## 🚦 Spustenie projektu

### Požiadavky
- Node.js 18+
- npm alebo yarn

### Inštalácia a spustenie

```bash
# Klonovanie projektu
git clone <repository-url>
cd edutrack

# Inštalácia závislostí
npm install

# Spustenie dev servera
npm run dev

# Otvorenie v prehliadači
http://localhost:5178
```

### Dostupné skripty

```bash
npm run dev        # Spustenie development servera
npm run build      # Build pre produkciu
npm run preview    # Preview produkčnej verzie
npm run lint       # ESLint kontrola
npm run typecheck  # TypeScript kontrola
```

---

## 🎨 Design systém

### Farebná paleta
- **Primárna:** Modrá (#2563EB)
- **Úspech:** Zelená (#059669)
- **Upozornenie:** Oranžová (#D97706)
- **Chyba:** Červená (#DC2626)
- **Neutrálna:** Sivá škála

### Komponenty
- **Karty** - s tieňmi a zaoblenými rohmi
- **Tlačidlá** - s hover efektami
- **Formuláre** - s validáciou
- **Modálne okná** - pre akcie
- **Progress bary** - pre sledovanie pokroku

---

## 📊 Dátový model

### Základné entity
```typescript
User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
}

School {
  id: string
  name: string
  address: string
  teacherIds: string[]
  studentIds: string[]
}

Subject {
  id: string
  name: string
  description: string
  schoolId: string
  teacherId: string
  studentIds: string[]
}

Assignment {
  id: string
  subjectId: string
  title: string
  description: string
  dueDate: Date
}

Submission {
  id: string
  assignmentId: string
  studentId: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'reviewed'
  score?: number
  teacherFeedback?: string
}
```

---

## 🔮 Plánované funkcionality

### Fáza 2 - Backend integrácia
- [ ] REST API s Node.js/Express
- [ ] PostgreSQL databáza
- [ ] JWT autentifikácia
- [ ] File upload do cloud storage

### Fáza 3 - AI integrácia
- [ ] Rozpoznávanie rukopisu (OCR)
- [ ] Automatické hodnotenie jednoduchých úloh
- [ ] AI asistent pre učiteľov
- [ ] Inteligentné odporúčania

### Fáza 4 - Rozšírené funkcie
- [ ] Real-time notifikácie (WebSocket)
- [ ] Video konferencie
- [ ] Mobilná aplikácia (React Native)
- [ ] Analytika a reporty
- [ ] Export do PDF/Excel

---

## 🏆 Status projektu

**Aktuálna verzia:** 1.0.0 (Frontend Demo)  
**Status:** ✅ Demo pripravené pre prezentáciu investorom

### ✅ Dokončené
- [x] Kompletné UI pre všetky 3 roly
- [x] Autentifikácia a role-based routing
- [x] CRUD operácie (simulované)
- [x] Responzívny dizajn
- [x] Mock dáta a state management

### 🔄 V procese
- [ ] Backend API
- [ ] Databázová integrácia
- [ ] Unit testy

---

## 👥 Tím

- **Frontend Developer** - React/TypeScript implementácia
- **UI/UX Designer** - Dizajn a používateľská skúsenosť
- **Product Manager** - Požiadavky a roadmap

---

## 📧 Kontakt

Pre otázky ohľadom projektu alebo demo prezentácie:

**Email:** info@edutrack.sk  
**Website:** https://edutrack.sk

---

## 📄 Licencia

Tento projekt je chránený autorskými právami. Všetky práva vyhradené.

---

*Vyrobené s ❤️ pre modernú edukcií*