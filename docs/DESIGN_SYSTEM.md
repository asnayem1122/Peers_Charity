# PEER'S CHARITY — DESIGN SYSTEM & TOKENS

> **Design Direction:** Horizon UI inspired modern SaaS polish tailored with a crisp, friendly academic personality. Clean typography, generous whitespace, micro-interactions, subtle borders, and harmonious dark/light themes.

---

## 1. Color Tokens & Theme System

### Dark Theme (Primary SaaS Dark Mode)
- **Page Background:** `hsl(222, 47%, 7%)` (`#0b0f19` - Deep Slate Navy)
- **Sidebar Surface:** `hsl(222, 40%, 10%)` (`#101726` - Slightly Elevated Navy)
- **Card Surface:** `hsl(222, 38%, 13%)` (`#161e31` - Surface Container)
- **Surface Hover:** `hsl(222, 35%, 17%)` (`#1e2942`)
- **Subtle Border:** `hsl(222, 25%, 22%)` (`#2a364f`)
- **Primary Accent:** `hsl(217, 91%, 60%)` (`#3b82f6` - Academic Blue)
- **Secondary Accent:** `hsl(262, 83%, 58%)` (`#8b5cf6` - Generosity Violet)
- **Primary Text:** `hsl(210, 40%, 98%)` (`#f8fafc`)
- **Muted Text:** `hsl(215, 20%, 65%)` (`#94a3b8`)

### Light Theme
- **Page Background:** `hsl(210, 40%, 98%)` (`#f8fafc` - Soft Cool Gray)
- **Sidebar Surface:** `hsl(0, 0%, 100%)` (`#ffffff` - Crisp White)
- **Card Surface:** `hsl(0, 0%, 100%)` (`#ffffff`)
- **Surface Hover:** `hsl(210, 40%, 96%)` (`#f1f5f9`)
- **Subtle Border:** `hsl(214, 32%, 91%)` (`#e2e8f0`)
- **Primary Accent:** `hsl(217, 91%, 56%)` (`#2563eb`)
- **Primary Text:** `hsl(222, 47%, 11%)` (`#0f172a`)
- **Muted Text:** `hsl(215, 16%, 47%)` (`#64748b`)

---

## 2. Layout & Application Shell

```
+-----------------------------------------------------------------------------------+
|  [Logo] PEER'S CHARITY   |  Topbar Search (Cmd+K)     Notifications Theme Profile |
+--------------------------+--------------------------------------------------------+
|  Sidebar                 |                                                        |
|  - Charity HQ            |   Main Dashboard Content                               |
|  - Charity Bazaar        |   Header: Good evening, Sarah 👋                       |
|  - Academic Pantry       |   Stats Grid (Donations, Students Helped, RQS, Points)  |
|  - Exam Emergency Room   |   - Recommend For You                                  |
|  - Donate Knowledge      |   - Academic Pantry Health                             |
|  - My Treasure           |   - Trending Donations                                 |
|  - Charity Circle        |                                                        |
|  - Generosity Olympics   |                                                        |
|  - Fine Print            |                                                        |
+--------------------------+--------------------------------------------------------+
```

### Mobile Layout
- Fixed Header with Logo & Notification Bell.
- Bottom Navigation Bar: **HQ** | **Bazaar** | **Donate** | **Exam** | **Profile**.

---

## 3. Playful Copy & Tone Strategy

| Context | Tone Example |
|---|---|
| Empty Treasure | *"Your treasure chest is empty. Time to visit the Charity Bazaar."* |
| Exam Emergency | *"Congratulations. Panic has been detected."* |
| Duplicate File Upload | *"Hold your horses, fellow philanthropist. A very similar donation already exists."* |
| Error State | *"Looks like this donation wandered off."* |
| Final CTA | *"Every semester needs a hero."* |

---

## 4. Design Components Catalog
- **Cards:** Crisp SaaS container cards with `border border-border/50 rounded-xl hover:shadow-lg transition-all duration-200`.
- **Command Palette:** Modal activated via `Cmd+K` / `Ctrl+K` for instant keyboard navigation.
- **PDF Viewer Modal:** Dual-view browser preview with zoom, page control, and metadata sidebar.
- **Skeleton Loaders:** Custom animated pulse placeholders matching card & list layouts.
