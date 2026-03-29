 # Project Structure
 
  Learning-app/
  ├── index.html                # Vite entry HTML — load Google Fonts (Nunito, Kiwi Maru)
  ├── vite.config.ts            # Vite + TailwindCSS plugin + path alias @/ → ./src
  ├── tsconfig.app.json         # TS config — strict mode, paths: @/* → ./src/*
  ├── components.json           # shadcn/ui config — style: new-york, icons: @phosphor-icons/react
  ├── package.json
  │
  └── src/
      ├── main.tsx              # React root — StrictMode, gọi setupInterceptors() trước render
      ├── App.tsx               # BrowserRouter + Routes + sử dụng <GoeyToaster/>
      ├── index.css             # @tailwind imports + CSS variables 
      │
      ├── components/
      │   ├── ui/               # shadcn components (button, input, label, card, form...)
      │   │
      │   ├── auth/             # Form components + routing guards liên quan đến auth
      │   │   ├── LoginForm.tsx
      │   │   ├── RegisterForm.tsx
      │   │   ├── ProtectedRoute.tsx   # Redirect → /login nếu chưa auth
      │   │   └── GuestRoute.tsx       # Redirect → /dashboard nếu đã auth
      │   │
      │   └── layout/
      │       └── Navbar.tsx           # Landing page navbar — sticky, blur-on-scroll
      │
      ├── pages/
      │   ├── HomePage.tsx       # Landing page: hero, features, how-it-works, CTA, footer
      │   ├── LoginPage.tsx      # Split layout: minh hoạ bên trái + form bên phải
      │   ├── RegisterPage.tsx   # Split layout: minh hoạ bên trái + form bên phải
      │   └── DashboardPage.tsx  # [OUT OF SCOPE — chỉ export placeholder, không implement]
      │
      ├── constants/             # Toàn bộ text/data tĩnh — component chỉ render, không hardcode
      │   ├── home.ts            # HOME_HERO, HOME_FEATURES, HOME_HOW_IT_WORKS, HOME_CTA
      │   └── auth.ts            # AUTH_LOGIN_COPY, AUTH_REGISTER_COPY (label, placeholder, link text)
      │
      ├── services/
      │   ├── api.ts             # Axios instance — baseURL từ env, withCredentials: true
      │   ├── authService.ts     # Gọi API: login, register, refresh, logout
      │   └── setupInterceptors.ts  # Request interceptor gắn Bearer token
      │                             # Response interceptor: 401 → refresh → retry queue
      │                             # Export setupInterceptors() — gọi trong main.tsx
      │
      ├── stores/
      │   └── authStore.ts       # Zustand — accessToken lưu in-memory (KHÔNG localStorage)
      │                          # Shape: { token, user, isLoading, login(), logout(), init() }
      │                          # init(): gọi refresh API khi app load để khôi phục session
      │
      ├── hooks/
      │   └── .gitkeep           # Custom hooks đặt tại đây — prefix "use", ví dụ: useAuth.ts
      │
      ├── types/
      │   ├── api.ts             # ApiResponse<T>, PaginatedResponse<T>, error code → tiếng Việt
      │   └── auth.ts            # LoginRequest, RegisterRequest, AuthDTO, UserDTO
      │
      └── lib/
          ├── utils.ts           # cn() = clsx + tailwind-merge
          └── validations/
              └── auth.ts        # Zod schemas: loginSchema, registerSchema



  # Note

  ### CSS Variables
  Tất cả màu được định nghĩa tại `src/index.css` dưới dạng CSS variables theo chuẩn shadcn/ui.

  ### Font chữ
  - Sử dụng **font stack** để tự động chọn font theo ngôn ngữ:
  ```css
  font-family: "Nunito", "Kiwi Maru", system-ui, sans-serif;
  ```
  - **Nunito**: Dùng cho tiếng Việt và ký tự Latin (weights: 400, 500, 600, 700)
  - **Kiwi Maru**: Dùng cho tiếng Nhật — Hiragana, Katakana, Kanji (weights: 300, 400, 500)
  - Trình duyệt tự động chọn font dựa trên Unicode range của từng ký tự
  - Load qua **Google Fonts** trong `index.html`
  ---

  ### Bento Box Layout
  - Grid bất đối xứng (asymmetric grid)
  - Các card/box có kích thước khác nhau (span 1 hoặc 2 cột/hàng)
  - Tạo cảm giác hiện đại, không nhàm chán
  - Mỗi box là một "feature" hoặc "content block" độc lập


  # Components & conventions

  ### shadcn/ui
  - Prefer shadcn/ui components over writing raw HTML — do not reinvent what shadcn already provides.
  - Install new components via: `npx shadcn@latest add <component-name>`
  - Style preset: `new-york` — do not change this.
  - Icon library: `@phosphor-icons/react` — do NOT use lucide-react even though shadcn defaults to it.

  ### Naming conventions
  - Components: PascalCase — `HeroSection.tsx`, `LoginForm.tsx`
  - Constants / static data: UPPER_SNAKE_CASE — `HOME_HERO`, `AUTH_LOGIN_COPY`
  - Hooks: camelCase with `use` prefix — `useAuth.ts`, `useScrollSpy.ts`
  - Files: follow React convention — PascalCase for components, camelCase for everything else

  ### Data layer
  - All static text and data for each page lives in `src/constants/` — one file per page or domain.
  - Components only render — never hardcode strings, labels, or copy inside JSX.
  - Export constants as `as const` objects or typed arrays. Example:
  ```ts
    export const HOME_HERO = {
      headline: "...",
      ctaPrimary: "...",
    } as const
  ```

  ### UI language
  - Default language: **Vietnamese** — all user-facing text must be in Vietnamese.
  - This applies to: labels, placeholders, error messages, form validation text, toast notifications.
  - No i18n setup needed at this stage — hardcode Vietnamese strings in `src/constants/`.

  ### Auth & security
  - Access token: stored **in-memory via Zustand only** — NEVER write to `localStorage` or `sessionStorage`.
  - Refresh token: sent and received via **HttpOnly cookie** — not accessible from JS.
  - Token refresh flow: response interceptor in `setupInterceptors.ts` catches 401, calls refresh endpoint, retries queued requests. On refresh failure → logout + redirect to `/login`.
  - `setupInterceptors()` must be called in `main.tsx` before the React tree renders.

  # Documentation of goey-toast package
  goeyToast('Hello')                    // default (neutral)
  goeyToast.success('Saved!')           // green
  goeyToast.error('Failed')             // red
  goeyToast.warning('Careful')          // yellow
  goeyToast.info('FYI')                 // blue

  # SYSTEM INSTRUCTION: UI/UX & LAYOUT MASTER GUIDE
  You are an Expert Frontend Engineer and UI/UX Designer. When generating code, designing layouts, or suggesting UI structures, you must strictly adhere to the following rules to maintain a professional, consistent, and highly readable "vibe".

  ## 1. THE 8-POINT GRID SYSTEM (STRICT RULE)
  - **Constraint:** All spatial dimensions (margin, padding, height, width, border-radius) MUST be multiples of 8 (8px, 16px, 24px, 32px, 40px, 48px, 64px, etc.).
  - **Micro-spacing:** For extremely tight spacing (e.g., space between an icon and text inside a button), you may use multiples of 4 (4px, 12px).
  - **NEVER** use arbitrary values like 10px, 15px, 20px, or 25px for spacing.

  ## 2. SPACING & PROXIMITY (GESTALT PRINCIPLE)
  - **Grouping:** Elements that are logically related must be visually closer together. 
  - **Inner vs. Outer:** Inner padding of a container must always be smaller than or equal to the outer margin separating it from other containers.
  - **Text Content:** Space below a heading (margin-bottom) must be smaller than the space above it (margin-top) to show it belongs to the paragraph below it.

  ## 3. LAYOUT ARCHITECTURE (FLEXBOX vs. GRID)
  - **Flexbox:** Use Flexbox exclusively for 1-dimensional layouts (either a single row or a single column). Ideal for navbars, button groups, and lists. Always define `gap` instead of using margins on child elements.
  - **CSS Grid:** Use Grid exclusively for 2-dimensional layouts (both rows and columns simultaneously). Ideal for page skeletons, dashboard layouts, image galleries, and card grids.
  - **Alignment:** Never leave items floating aimlessly. Always explicitly use `align-items` and `justify-content` to control positioning.

  ## 4. RESPONSIVE DESIGN (MOBILE-FIRST MINDSET)
  - **Base Styles:** All default CSS rules must be written for Mobile devices first (smallest screens).
  - **Scaling Up:** Use `min-width` media queries to adjust layouts for larger screens. 
  - **Standard Breakpoints:** - Tablet: `min-width: 768px`
    - Desktop: `min-width: 1024px`
    - Large Desktop: `min-width: 1280px`
  - **Behavior:** Stack elements vertically on mobile. Use Flex/Grid to place them side-by-side only at Tablet/Desktop breakpoints.

  ## 5. VISUAL HIERARCHY & NEGATIVE SPACE
  - **Let it breathe:** Default to generous padding/margins for macro-sections (e.g., `padding: 64px 0` or `96px 0` for landing page sections) to create a premium, clean vibe.
  - **Contrast:** Ensure clear visual distinction between Primary, Secondary, and Tertiary elements (using size, font-weight, or color opacity).

  ## 6. CODE QUALITY & EXECUTION
  - Semantic HTML is mandatory (use `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`).
  - Avoid deeply nested `<div>` soup.

  ## 7. Borders & dividers
  - NEVER use `border`, `border-b`, `divide-y` to separate sections — this violates the No-Line Rule.
  - Separate sections using background color shifts instead:
    - `bg-[#fff9eb]` → `bg-[#f9f3e5]` → `bg-[#e8e2d4]` (light to darker surface)
  - Separate list items using vertical spacing (`space-y-4`) or alternating `bg-*`, never `divide-y`.
  - Ghost border (accessibility fallback only): `border border-[#1d1c13]/15`